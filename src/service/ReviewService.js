// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://localhost:7208/api/reviews";
const ReviewService = {
  getReviews: async () => {
    const response = await axios.get(`${API_URL}/get-all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getReviewById: async (reviewId) => {
    const response = await axios.get(`${API_URL}/get-by-id/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  createReview: async (data) => {
    const response = await axios.post(`${API_URL}/add`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  updateReview: async (reviewId, data) => {
    const response = await axios.put(`${API_URL}/update/${reviewId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getReviewByProductId: async (productId) => {
    const response = await axios.get(`${API_URL}/get-by-product/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },  
    });
    return response.data.data;
  },
  deleteReview: async (reviewId) => {
    const response = await axios.delete(`${API_URL}/delete/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
};
export default ReviewService;
