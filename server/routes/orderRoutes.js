import express from 'express';
import Order from '../models/Order.js';
import { verifyUser, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new order
router.post('/', verifyUser, async (req, res) => {
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
            status: 'pending' 
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

// Get user's orders
router.get('/', verifyUser, async (req, res) => {
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

// Get a specific order
router.get('/:orderId', verifyUser, async (req, res) => {
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

// Admin routes
router.get('/admin/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
});

router.patch('/admin/:orderId/status', async (req, res) => {
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

export default router;