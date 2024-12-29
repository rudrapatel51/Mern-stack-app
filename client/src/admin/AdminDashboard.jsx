import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProduct from "./AddProduct";
import AdminOrder from './AdminOrder';
import EditProduct from "./EditProduct"
import api from '../axios/axios';

const AdminDashboard = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // updating the product by id
    const handleUpdateProduct = (updatedProduct) => {
        setProducts(products.map(product => 
            product._id === updatedProduct._id ? updatedProduct : product
        ));
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                // Fetch dashboard stats
                const dashboardResponse = await axios.get('/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage(dashboardResponse.data.message);
                setStats({
                    totalOrders: 150,
                    totalProducts: 75,
                    totalRevenue: 25000,
                    pendingOrders: 12
                });

                // Fetch products
                const productsResponse = await api.get('/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(productsResponse.data);
            } catch (error) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);


    

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('adminToken');
        try {
            await api.delete(`/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove the deleted product from the state
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };
    

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <div
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-3 cursor-pointer ${activeTab === 'dashboard' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                    >
                        Dashboard
                    </div>
                    <div
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-3 cursor-pointer ${activeTab === 'products' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                    >
                        Products
                    </div>
                    <div
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 cursor-pointer ${activeTab === 'orders' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                    >
                        Orders
                    </div>
                </nav>
                <div className="absolute bottom-0 w-full p-6">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 min-h-screen">
                {/* Top Bar */}
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-6">
                    {activeTab === 'dashboard' && (
                        <div>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                </div>
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                                </div>
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                                    <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p>
                                </div>
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                                    <AdminOrder limit={5} />
                                </div>
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-4">Product Management</h3>
                                    <AddProduct />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="border rounded-lg p-4 shadow-sm">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            className="w-full h-48 object-cover rounded-t-lg mb-4"
                                        />
                                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                        <p className="text-gray-600 mb-2">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                            <button 
                                            onClick={() => setSelectedProduct(product)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <AddProduct />
                            {selectedProduct && (
                        <EditProduct
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            onUpdate={handleUpdateProduct}
                        />
                    )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <AdminOrder />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;