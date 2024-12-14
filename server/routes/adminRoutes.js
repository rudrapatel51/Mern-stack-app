import express from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';


export const AdminRegister = async (req, res,next) => {
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
};

export const AdminLogin = async (req,res,next) =>{
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
}