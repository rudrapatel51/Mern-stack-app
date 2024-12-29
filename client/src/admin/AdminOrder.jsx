import React, { useEffect, useState } from "react";
import api from "../axios/axios";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState();

  const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Configure headers for admin token
      api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("adminToken")}`;
      
      const response = await api.get("/api/admin/orders");
      setOrders(response.data);
    } catch (error) {
      setError("Error fetching orders");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(
        `/api/admin/orders/${orderId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        );
        setSuccessMessage("Order status updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating order status");
      console.error("Error:", error);
      setTimeout(() => setError(null), 3000);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      setSelectedOrder(response.data.order);
      setIsDetailModalOpen(true);
    } catch (error) {
      setError("Error fetching order details");
      console.error("Error:", error);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                  <span className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Customer
                    </p>
                    <p>
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-sm">{order.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p>${order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={order.status || "pending"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option
                          key={status}
                          value={status.toLowerCase()}
                          className={`${
                            order.status === status.toLowerCase()
                              ? "font-medium"
                              : ""
                          }`}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => viewOrderDetails(order._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.apartment}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <p>Subtotal: ${selectedOrder.subtotal}</p>
                    <p>Shipping: ${selectedOrder.shippingCost}</p>
                    <p className="font-medium">
                      Total: ${selectedOrder.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-lg text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-gray-500">Quantity: 1</p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-lg font-semibold text-gray-900">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
