import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import StudentModel from './models/Student.js';
import Product from './models/Product.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import logger from "./config/logger.js";
import { requestLogger } from "./middleware/loggerMiddleware.js";
import Order from './models/Order.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(requestLogger); 


// Enhanced logging setup (consider using a library like 'winston' or 'morgan')
const logLevel = process.env.LOG_LEVEL || 'info';
if (logLevel === 'debug') {
    console.debug('Debugging information');
} else {
    console.log(`Log level set to ${logLevel}`);
}

// connection to MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Register route for student
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await StudentModel.create({
          name,
          email,
          password: hashedPassword, 
      });

      res.json({ message: "User registered successfully", user });
  } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(500).json({ error: error.message });
  }
});

// Login route for student
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`Attempting login for email: ${email}`);

  StudentModel.findOne({ email })
      .then(user => {
          if (!user) {
              console.error("User not found");
              return res.status(401).json({ login: false, message: "Invalid credentials" });
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                  console.error("Error comparing passwords", err);
                  return res.status(500).json({ error: err.message });
              }

              if (isMatch) {
                  console.log("Password matched, generating tokens...");
                  const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
                  const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

                  return res.json({ login: true, accessToken, refreshToken });
              } else {
                  console.error("Password mismatch");
                  return res.status(401).json({ login: false, message: "Invalid credentials" });
              }
          });
      })
      .catch(err => {
          console.error("Error during login", err);
          res.status(500).json({ error: err.message });
      });
});


const verifyUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ valid: false, message: "No access token provided" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
          return res.status(403).json({ valid: false, message: "Invalid or expired token" });
      }
      try {
          // Find the user and attach their ID to the request
          const user = await StudentModel.findOne({ email: decoded.email });
          if (!user) {
              return res.status(404).json({ valid: false, message: "User not found" });
          }
          req.userId = user._id; // Attach user ID
          req.email = decoded.email; // Keep email for backward compatibility
          next();
      } catch (error) {
          return res.status(500).json({ valid: false, message: "Error verifying user" });
      }
  });
};

app.post('/token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
      return res.status(401).json({ valid: false, message: "No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).json({ valid: false, message: "Invalid or expired refresh token" });
      }

      const accessToken = jwt.sign({ email: decoded.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
      return res.json({ valid: true, accessToken });
  });
});


// Function to renew access token using the refresh token
const renewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return false;
    } else {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie("refreshToken");
                return res.status(401).json({ valid: false, message: "Invalid Refresh Token" });
            } else {
                const accessToken = jwt.sign({ email: decoded.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
                res.cookie("accessToken", accessToken, { maxAge: 2 * 60 * 60 * 1000 });
                return true;
            }
        });
    }
};

// Route to get user information
app.get('/user', verifyUser, (req, res) => {
    const email = req.email;
    StudentModel.findOne({ email })
        .then(user => {
            if (user) {
                return res.json({ valid: true, user });
            } else {
                return res.status(404).json({ valid: false, message: "User not found" });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});


// Admin registration route
app.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ username });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin login route
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ login: false, message: 'Invalid admin credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ login: false, message: 'Invalid admin credentials' });
        }
        const adminToken = jwt.sign({ username: admin.username }, process.env.JWT_ADMIN_SECRET, { expiresIn: '2h' });
        res.cookie('adminToken', adminToken, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000 });
        return res.json({ login: true, adminToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware to verify the admin
const verifyAdmin = (req, res, next) => {
    const adminToken = req.cookies.adminToken || req.headers['authorization']?.split(' ')[1];
    if (!adminToken) {
        return res.status(401).json({ valid: false, message: "No admin token provided" });
    }
    jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: "Invalid admin token" });
        } else {
            req.admin = decoded.username;
            next();
        }
    });
};

// Logout route
app.post('/logout', (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
});

// Create a new product
app.post('/products', verifyAdmin, async (req, res) => {
    const { name, description, price, category, imageUrl } = req.body;
    try {
        const newProduct = new Product({ name, description, price, category, imageUrl });
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// getting the product by id in single product
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// product edit route
app.put('/products/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { name, description, price, imageUrl, category },
            { new: true } // This ensures the updated document is returned
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete the product by admin 
app.delete('/products/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.post('/api/orders', verifyUser, async (req, res) => {
  try {
      const {
          firstName,
          lastName,
          email,
          phone,
          address,
          apartment,
          city,
          state,
          zipCode,
          items,
          paymentMethod,
          shippingMethod,
          subtotal,
          totalAmount
      } = req.body;

      const shippingCost = shippingMethod === 'express' ? 15 : 0;

      const newOrder = new Order({
          userId: req.userId, 
          user: {
              email,
              firstName,
              lastName,
              phone
          },
          shippingAddress: {
              address,
              apartment,
              city,
              state,
              zipCode
          },
          items,
          paymentMethod,
          shippingMethod,
          subtotal,
          shippingCost,
          totalAmount,
          status: 'pending' // Add default status
      });

      await newOrder.save();
      res.status(201).json({
          success: true,
          message: 'Order created successfully',
          orderId: newOrder._id
      });
  } catch (error) {
      res.status(400).json({
          success: false,
          message: 'Error creating order',
          error: error.message
      });
  }
});

// Get all orders for a specific user
app.get('/api/orders', verifyUser, async (req, res) => {
  try {
      const orders = await Order.find({
          $or: [
              { userId: req.userId }, 
              { 'user.email': req.email } 
          ]
      }).sort({ createdAt: -1 });

      res.json({
          success: true,
          orders
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Error fetching orders',
          error: error.message
      });
  }
});

// Get a specific order by ID
app.get('/api/orders/:orderId', verifyUser, async (req, res) => {
  try {
      const order = await Order.findOne({
          _id: req.params.orderId,
          $or: [
              { userId: req.userId },
              { 'user.email': req.email }
          ]
      });

      if (!order) {
          return res.status(404).json({
              success: false,
              message: 'Order not found or unauthorized access'
          });
      }

      res.json({
          success: true,
          order
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Error fetching order',
          error: error.message
      });
  }
});

// Admin route to get all orders (requires admin verification)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
});

// Admin route to update order status
app.patch('/api/admin/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Order status updated successfully', 
      order 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order status', 
      error: error.message 
    });
  }
});



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
