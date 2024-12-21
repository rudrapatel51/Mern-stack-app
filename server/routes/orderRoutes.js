import Order from "../models/Order.js";

export const userOrder = async (req,res) => {
      try {
          const {
              firstName,
              lastName,
              email,
              phone,
              address,
              apartment,
              city,
              state,
              zipCode,
              items,
              paymentMethod,
              shippingMethod,
              subtotal,
              totalAmount
          } = req.body;
    
          const shippingCost = shippingMethod === 'express' ? 15 : 0;
    
          const newOrder = new Order({
              userId: req.userId, 
              user: {
                  email,
                  firstName,
                  lastName,
                  phone
              },
              shippingAddress: {
                  address,
                  apartment,
                  city,
                  state,
                  zipCode
              },
              items,
              paymentMethod,
              shippingMethod,
              subtotal,
              shippingCost,
              totalAmount,
              status: 'pending' 
          });
    
          await newOrder.save();
          res.status(201).json({
              success: true,
              message: 'Order created successfully',
              orderId: newOrder._id
          });
      } catch (error) {
          res.status(400).json({
              success: false,
              message: 'Error creating order',
              error: error.message
          });
      }
}

export const getUserOrder = async (req,res) => {
      try {
          const orders = await Order.find({
              $or: [
                  { userId: req.userId }, 
                  { 'user.email': req.email } 
              ]
          }).sort({ createdAt: -1 });
    
          res.json({
              success: true,
              orders
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Error fetching orders',
              error: error.message
          });
      }
}

export const adminUserOrder = async (req,res) => {
      try {
        const order = await Order.findById(req.params.orderId)
        .populate('user', 'firstName lastName email') 
        .lean();
    
          if (!order) {
              return res.status(404).json({
                  success: false,
                  message: 'Order not found or unauthorized access'
              });
          }
    
          res.json({
              success: true,
              order
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Error fetching order',
              error: error.message
          });
      }
}

export const getOrderadmin = async (req,res) => {
      try {
        const orders = await Order.find()
          .sort({ createdAt: -1 });
        res.json(orders);
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: 'Error fetching orders', 
          error: error.message 
        });
      }

}

export const updateStatusOrder = async (req,res) => {
        try {
          const { status } = req.body;
          const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { 
              status,
              updatedAt: Date.now()
            },
            { new: true }
          );
      
          if (!order) {
            return res.status(404).json({ 
              success: false, 
              message: 'Order not found' 
            });
          }
          
          res.json({ 
            success: true, 
            message: 'Order status updated successfully', 
            order 
          });
        } catch (error) {
          res.status(500).json({ 
            success: false, 
            message: 'Error updating order status', 
            error: error.message 
          });
        }
      
}