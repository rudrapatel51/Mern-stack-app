import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../axios/axios';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        setLoading(false);
        return;
      }

      try {
        // Configure axios defaults
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        const userResponse = await api.get("/user");
        if (!userResponse.data.valid) {
          throw new Error('User not authenticated');
        }
        setUser(userResponse.data.user);
          
        // Fetch orders with the new response structure
        const ordersResponse = await api.get("/api/orders");
        if (!ordersResponse.data.success) {
          throw new Error(ordersResponse.data.message || 'Failed to fetch orders');
        }
        setOrders(ordersResponse.data.orders);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Error fetching data';
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('accessToken');
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/logout', {}, { withCredentials: true });
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className='text-2xl font-semibold text-gray-800 mb-4'>{error}</p>
          <div className='font-medium space-y-4'>
            <div>
              <a 
                href='/login' 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </a>
            </div>
            <div>
              <a 
                href='/register' 
                className="inline-block text-blue-600 hover:underline"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {user && (
        <div className="space-y-8">
          {/* User Profile Section */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className="flex justify-between items-start">
              <div>
                <h1 className='text-3xl font-bold mb-6'>Welcome, {user.name}!</h1>
                <div className='space-y-2'>
                  <p className='text-gray-600'><span className="font-medium">Email:</span> {user.email}</p>
                  <p className='text-gray-600'><span className="font-medium">Member since:</span> {formatDate(user.createdAt)}</p>
                </div>
              </div>
              <button 
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors' 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold mb-6'>My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <a 
                  href="/products" 
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                        <p className="text-sm text-gray-500">Placed on: {formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusStyles[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mt-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 border-b last:border-b-0 pb-4 last:pb-0">
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-600">
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping ({order.shippingMethod}):</span>
                        <span>{formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Shipping Address</h4>
                          <p className="text-gray-600">
                            {order.shippingAddress.address}
                            {order.shippingAddress.apartment && <><br />{order.shippingAddress.apartment}</>}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment Details</h4>
                          <p className="text-gray-600">
                            Method: <span className="capitalize">{order.paymentMethod}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;