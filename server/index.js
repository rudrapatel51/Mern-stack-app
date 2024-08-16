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
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    StudentModel.create({ name, email, password })
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Login route for student
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    StudentModel.findOne({ email })
        .then(user => {
            if (user && user.password === password) {
                const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
                const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "2h" });

                // Send accessToken in response body instead of setting a cookie
                return res.json({
                    login: true,
                    accessToken, // Include accessToken in the response body
                    refreshToken // Optionally include refreshToken if needed
                });
            } else {
                return res.status(401).json({ login: false, message: "Invalid credentials" });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1]; // Extract the token part

    if (!accessToken) {
        return res.status(401).json({ valid: false, message: "No access token provided" });
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: "Invalid Token" });
        } else {
            req.email = decoded.email;
            next();
        }
    });
};


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
app.post('/products', async (req, res) => {
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
