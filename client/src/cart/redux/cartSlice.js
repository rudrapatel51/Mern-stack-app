import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

// saving all cart in localstorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : {
      cartItems: [],
      totalAmount: 0,
      totalQuantity: 0,
    };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {
      cartItems: [],
      totalAmount: 0,
      totalQuantity: 0,
    };
  }
};

const calculateTotals = (items) => {
  return items.reduce(
    (totals, item) => ({
      totalQuantity: totals.totalQuantity + item.quantity,
      totalAmount: totals.totalAmount + item.price * item.quantity,
    }),
    { totalQuantity: 0, totalAmount: 0 }
  );
};

const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState : loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        item => item._id === action.payload._id
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1
        });
      }

      // Recalculate totals
      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;

      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item._id !== action.payload.id
      );
      
      // Recalculate totals
      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;

      saveCartToStorage(state);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item._id === id);

      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => item._id !== id);
        } else {
          item.quantity = quantity;
        }
        
        const totals = calculateTotals(state.cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;

        saveCartToStorage(state);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      
      // Clear localStorage
      localStorage.removeItem('cart');
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;