// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://104.43.89.177/api/Cart";
const CartService = {
  addCart: async (data) => {
    const response = await axios.post(`${API_URL}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  deleteCart: async (accountId, productId) => {
    const response = await axios.delete(`${API_URL}/${accountId}?productId=${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getCartByAccountId: async (accountId) => {
    const response = await axios.get(`${API_URL}/${accountId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  deleteUserCart: async (accountId) => {
    const response = await axios.delete(`${API_URL}/${accountId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  updateCart: async (accountId, productId, newQuantity) => {
    const response = await axios.put(
      `${API_URL}/${accountId}?productId=${productId}&newQuantity=${newQuantity}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  },
};

export default CartService;
