// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "http://104.43.89.177/api/category";
const CategoryService = {
  getAllCategory: async () => {
    const response = await axios.get(`${API_URL}/GetAllCategory`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getCategoryById: async (id) => {
    const response = await axios.get(`${API_URL}/GetCategory/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
  createCategory: async (category) => {
    const response = await axios.post(`${API_URL}/CreateCategory`, category, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  updateCategory: async (id, category) => {
    const response = await axios.put(`${API_URL}/UpdateCategory?id=${id}`, category, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/DeleteCategory/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
};

export default CategoryService;
