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
        setProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('adminToken');
    
            const response = await axios.post(
                'http://localhost:3001/products',
                product,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
    
            alert('Product added successfully!');
            setProduct({ name: '', description: '', price: 0, category: '', imageUrl: '' });
        } catch (error) {
            alert('Failed to add product.');
            console.error(error);
        }
    };
    

    return (
        <div className="grid gap-8">
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                </div>
                <div className="card">
                    <div className="card-content">
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="font-bold" htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={product.name}
                                        onChange={handleChange}
                                        placeholder="Product Name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="font-bold" htmlFor="price">Price</label>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={product.price}
                                        onChange={handleChange}
                                        placeholder="$0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="font-bold" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows={3}
                                    required
                                ></textarea>
                            </div>
                            <div className="grid gap-2">
                                <label className="font-bold" htmlFor="category">Category</label>
                                <input
                                    id="category"
                                    name="category"
                                    type="text"
                                    value={product.category}
                                    onChange={handleChange}
                                    placeholder="Product Category"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="font-bold" htmlFor="imageUrl">Product Image URL</label>
                                <input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="text"
                                    value={product.imageUrl}
                                    onChange={handleChange}
                                    placeholder="Product Image URL"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn bg-blue-500 w-50">
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AddProduct;
