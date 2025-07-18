// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "http://104.43.89.177/api/Rating";
const RatingService = {
  addRating: async (data) => {
    const response = await axios.post(`${API_URL}/addRating`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  updateRating: async (data) => {
    const response = await axios.put(`${API_URL}/updateRating`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  deleteRating: async (id) => {
    const response = await axios.delete(`${API_URL}/deleteRating?ratingId=${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
  getRatingByAccountId: async (accountId) => {
    const response = await axios.get(`${API_URL}/getRatingByAccountId?accountId=${accountId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
};

export default RatingService;
