import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import StudentModel from '../models/Student.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

export const UserRegister = async (req,res,next) => {
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
  }

export const UserLogin = async (req,res,next) => {
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
        })}

export const UserDetails = (req,res,next) => {
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
}
























// // Admin Registration
// router.post('/register', async (req, res) => {
//     const { username, password, email, role } = req.body;
    
//     try {
//         // Check if admin already exists
//         const adminExists = await Admin.findOne({ 
//             $or: [
//                 { username }, 
//                 { email }
//             ]
//         });
        
//         if (adminExists) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Admin already exists with this username or email' 
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // Create new admin
//         const newAdmin = new Admin({ 
//             username, 
//             password: hashedPassword,
//             email,
//             role: role || 'staff' // Default role if not specified
//         });
        
//         await newAdmin.save();
        
//         res.status(201).json({ 
//             success: true, 
//             message: 'Admin registered successfully' 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Error registering admin', 
//             error: error.message 
//         });
//     }
// });

// // Admin Login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
    
//     try {
//         // Find admin
//         const admin = await Admin.findOne({ username });
        
//         if (!admin) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid admin credentials' 
//             });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, admin.password);
        
//         if (!isMatch) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid admin credentials' 
//             });
//         }

//         // Generate token
//         const adminToken = jwt.sign(
//             { 
//                 username: admin.username, 
//                 role: admin.role 
//             }, 
//             process.env.JWT_ADMIN_SECRET, 
//             { expiresIn: '2h' }
//         );

//         // Respond with token
//         res.json({ 
//             success: true, 
//             token: adminToken,
//             admin: {
//                 username: admin.username,
//                 email: admin.email,
//                 role: admin.role
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Login error', 
//             error: error.message 
//         });
//     }
// });

// // Get Admin Profile
// router.get('/profile', verifyAdmin, async (req, res) => {
//     try {
//         const admin = await Admin.findOne({ username: req.admin })
//             .select('-password');
        
//         if (!admin) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Admin not found' 
//             });
//         }

//         res.json({
//             success: true,
//             admin
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Error fetching admin profile', 
//             error: error.message 
//         });
//     }
// });

// // Dashboard Statistics
// router.get('/dashboard-stats', verifyAdmin, async (req, res) => {
//     try {
//         const [
//             totalProducts,
//             totalOrders,
//             totalUsers,
//             totalRevenue,
//             recentOrders
//         ] = await Promise.all([
//             Product.countDocuments(),
//             Order.countDocuments(),
//             StudentModel.countDocuments(),
//             Order.aggregate([
//                 { $group: { _id: null, total: { $sum: '$totalAmount' } } }
//             ]),
//             Order.find()
//                 .sort({ createdAt: -1 })
//                 .limit(5)
//                 .populate('userId', 'name email')
//         ]);

//         res.json({
//             success: true,
//             stats: {
//                 totalProducts,
//                 totalOrders,
//                 totalUsers,
//                 totalRevenue: totalRevenue[0]?.total || 0,
//                 recentOrders
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Error fetching dashboard stats', 
//             error: error.message 
//         });
//     }
// });

// // Manage Users (List/Search/Update/Delete)
// router.get('/users', verifyAdmin, async (req, res) => {
//     try {
//         const { 
//             page = 1, 
//             limit = 10, 
//             search = '', 
//             sortBy = 'createdAt', 
//             sortOrder = 'desc' 
//         } = req.query;

//         const query = search 
//             ? { 
//                 $or: [
//                     { name: { $regex: search, $options: 'i' } },
//                     { email: { $regex: search, $options: 'i' } }
//                 ]
//             } 
//             : {};

//         const users = await StudentModel.find(query)
//             .select('-password')
//             .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
//             .limit(Number(limit))
//             .skip((page - 1) * limit);

//         const total = await StudentModel.countDocuments(query);

//         res.json({
//             success: true,
//             users,
//             pagination: {
//                 currentPage: Number(page),
//                 totalPages: Math.ceil(total / limit),
//                 totalUsers: total
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Error fetching users', 
//             error: error.message 
//         });
//     }
// });

// // Update User Status
// router.patch('/users/:userId/status', verifyAdmin, async (req, res) => {
//     const { userId } = req.params;
//     const { status } = req.body;

//     try {
//         const user = await StudentModel.findByIdAndUpdate(
//             userId, 
//             { status }, 
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'User not found' 
//             });
//         }

//         res.json({
//             success: true,
//             message: 'User status updated successfully',
//             user
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Error updating user status', 
//             error: error.message 
//         });
//     }
// });

