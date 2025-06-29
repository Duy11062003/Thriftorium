// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://localhost:7208/api/Blog";
const BlogService = {
  getAllBlogs: async () => {
    const response = await axios.get(`${API_URL}/GetAllBlogs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getBlogById: async (blogId) => {
    const response = await axios.get(`${API_URL}/BlogDetails/${blogId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  createBlog: async (data) => {
    const response = await axios.post(`${API_URL}/CreateBlog`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  },
  deleteBlog: async (blogId) => {
    const response = await axios.delete(`${API_URL}/${blogId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  updateBlog: async (blogId, data) => {
    const response = await axios.put(
      `${API_URL}/UpdateBlog?id=${blogId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  },
  getBlogSearch: async (search, pageIndex, pageSize) => {
    const response = await axios.get(
      `${API_URL}/base/search?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  },
};
export default BlogService;
