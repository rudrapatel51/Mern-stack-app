import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import StudentModel from '../models/Student.js';
import Admin from '../models/Admin.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student Registration
router.post('/register', async (req, res) => {
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
        res.status(500).json({ error: error.message });
    }
});

// Student Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await StudentModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ login: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ login: false, message: "Invalid credentials" });
        }

        const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
        const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        return res.json({ login: true, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Info
router.get('/user', verifyUser, async (req, res) => {
    try {
        const user = await StudentModel.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ valid: false, message: "User not found" });
        }
        return res.json({ valid: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
});

// Token Refresh
router.post('/token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ valid: false, message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { email: decoded.email }, 
            process.env.JWT_ACCESS_SECRET, 
            { expiresIn: "2h" }
        );
        return res.json({ valid: true, accessToken });
    } catch (error) {
        return res.status(403).json({ valid: false, message: "Invalid or expired refresh token" });
    }
});

export default router;