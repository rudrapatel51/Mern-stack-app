import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                <p>Items: {order.items.length}</p>
                <p>Total: ${order.totalAmount}</p>
                <p>Status: {order.status || 'Pending'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
