import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProduct from "./AddProduct"

const AdminDashboard = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await axios.get('/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage(response.data.message);
            } catch (error) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);

    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-20 sm:px-6">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            </header>
            <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
                <AddProduct />
                <p>{message}</p>
            </main>
        </div>
    );
};

export default AdminDashboard;
