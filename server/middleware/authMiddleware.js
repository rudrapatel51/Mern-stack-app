import jwt from 'jsonwebtoken';
import StudentModel from '../models/Student.js';

export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ valid: false, message: "No access token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        // Find the user and attach their ID to the request
        const user = await StudentModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ valid: false, message: "User not found" });
        }

        req.userId = user._id;
        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(403).json({ valid: false, message: "Invalid or expired token" });
    }
};

export const verifyAdmin = (req, res, next) => {
    const adminToken = req.cookies.adminToken || req.headers['authorization']?.split(' ')[1];
    
    if (!adminToken) {
        return res.status(401).json({ valid: false, message: "No admin token provided" });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET);
        req.admin = decoded.username;
        next();
    } catch (error) {
        return res.status(401).json({ valid: false, message: "Invalid admin token" });
    }
};

export const renewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return false;
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { email: decoded.email }, 
            process.env.JWT_ACCESS_SECRET, 
            { expiresIn: "2h" }
        );
        res.cookie("accessToken", accessToken, { maxAge: 2 * 60 * 60 * 1000 });
        return true;
    } catch (error) {
        res.clearCookie("refreshToken");
        res.status(401).json({ valid: false, message: "Invalid Refresh Token" });
        return false;
    }
};