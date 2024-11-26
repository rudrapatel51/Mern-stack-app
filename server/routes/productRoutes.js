import express from 'express';
import Product from '../models/Product.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyAdmin, async (req, res) => {
    const { name, description, price, category, imageUrl } = req.body;
    try {
        const newProduct = new Product({ name, description, price, category, imageUrl });
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
