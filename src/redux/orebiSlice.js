import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  userInfo: null,
  cartItems: [],
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    // Add new actions for cart management
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    updateCartItemCount: (state, action) => {
      state.cartItems = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  setCartItems,
  updateCartItemCount,
  clearCart,
} = orebiSlice.actions;
export default orebiSlice.reducer;
