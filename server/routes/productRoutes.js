import Product from "../models/Product.js";

export const createProduct = async (req,res) => {
    const { name, description, price, category, imageUrl } = req.body;
    try {
        const newProduct = new Product({ name, description, price, category, imageUrl });
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getProduct = async (req,res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProductById = async (req,res) => {
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
}

export const deleteProduct = async (req,res) => {
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
    }

export const editProduct = async (req,res) => {
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
    }