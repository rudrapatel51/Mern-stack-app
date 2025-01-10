import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
import logger from "./config/logger.js";
import { requestLogger } from "./middleware/loggerMiddleware.js";
import  {UserRegister, UserLogin, UserDetails, logoutUser } from "./routes/userRoutes.js"
import { verifyUser ,verifyAdmin} from "./middleware/authMiddleware.js";
import { AdminLogin, AdminRegister } from "./routes/adminRoutes.js";
import { createProduct, deleteProduct, editProduct, getProduct, getProductById } from "./routes/productRoutes.js";
import { adminUserOrder, getOrderadmin, getUserOrder, updateStatusOrder, userOrder } from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(requestLogger); 

app.use('/register',UserRegister)
app.use('/login',UserLogin)

const logLevel = process.env.LOG_LEVEL || 'info';
if (logLevel === 'debug') {
    console.debug('Debugging information');
} else {
    console.log(`Log level set to ${logLevel}`);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/user',verifyUser,UserDetails)

app.use('/logout',logoutUser)


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


app.use('/admin/register',AdminRegister)

app.use('/admin/login',AdminLogin)

//crete a product using admin panel
app.post('/products',verifyAdmin,createProduct)

// Get all products
app.get('/products',getProduct)


// getting the product by id in single product
app.get('/products/:id',getProductById)

// product edit route
app.put('/products/:id',verifyAdmin,editProduct)

// delete the product using admin
app.delete('/products/:id',verifyAdmin,deleteProduct)


// user order of specific user order
app.post('/api/orders',verifyUser,userOrder)

// Get all orders for a specific user
app.get('/api/orders',verifyUser,getUserOrder)


// Get a specific order by ID
app.get('/api/orders/:orderId',verifyAdmin,adminUserOrder)


// Admin route to get all orders (requires admin verification)
app.get('/api/admin/orders',verifyAdmin,getOrderadmin)

// Admin route to update order status
app.patch('/api/admin/orders/:orderId/status', verifyAdmin,updateStatusOrder)

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
