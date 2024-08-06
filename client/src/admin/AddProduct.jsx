import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/products', product);
            alert('Product added successfully!');
            setProduct({ name: '', description: '', price: 0, category: '', imageUrl: '' });
        } catch (error) {
            alert('Failed to add product.');
        }
    };

    return (
        <div>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description" value={product.description} onChange={handleChange} required></textarea>
                </label>
                <label>
                    Category:
                    <textarea name="category" value={product.category} onChange={handleChange} required></textarea>
                </label>
                <label>
                    ImageUrl:
                    <textarea name="imageUrl" value={product.imageUrl} onChange={handleChange} required></textarea>
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" name="price" value={product.price} onChange={handleChange} required />
                </label>
                <br />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
