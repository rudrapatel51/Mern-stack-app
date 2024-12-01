import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import StudentModel from "../models/Student";
import verifyUser from "../middleware/authMiddleware"

const router = express.Router();

// Register route
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
        console.error("Error during registration:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await StudentModel.findOne({ email });
        if (!user) return res.status(401).json({ login: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ login: false, message: "Invalid credentials" });

        const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
        const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        res.json({ login: true, accessToken, refreshToken });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Token refresh route
router.post('/token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ valid: false, message: "No refresh token provided" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ valid: false, message: "Invalid or expired refresh token" });

        const accessToken = jwt.sign({ email: decoded.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
        res.json({ valid: true, accessToken });
    });
});

// User info route
router.get('/user', verifyUser, async (req, res) => {
    try {
        const user = await StudentModel.findOne({ email: req.email });
        if (!user) return res.status(404).json({ valid: false, message: "User not found" });

        res.json({ valid: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
