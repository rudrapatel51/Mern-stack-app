import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProduct from "./AddProduct";
import AdminOrder from './AdminOrder';

const AdminDashboard = () => {
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('adminToken');
            console.log(token)
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await axios.get('/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage(response.data.message);
                setStats({
                    totalOrders: 150,
                    totalProducts: 75,
                    totalRevenue: 25000,
                    pendingOrders: 12
                });
            } catch (error) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);

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
                            <AddProduct />
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