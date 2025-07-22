// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://ticketo.store/api/Product";
const ProductService = {
  getAllProductManager: async () => {
    const response = await axios.get(`${API_URL}/GetForManagement`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getProductDetails: async (id) => {
    const response = await axios.get(`${API_URL}/productDetails/${id}`);
    return response.data.data;
  },
  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
  updateProduct: async (product) => {
    const response = await axios.put(`${API_URL}/UpdateForManagement?id=${product.productID}`, product, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  addProduct: async (product) => {
    const response = await axios.post(`${API_URL}/AddForManagement`, product, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  getProductsBase: async (params) => {
    const {
      name,
      search,
      lowPrice,
      highPrice,
      category,
      sortBy,
      pageIndex,
      pageSize,
    } = params || {};
    const query = [];
    if (name) query.push(`name=${encodeURIComponent(name)}`);
    if (search) query.push(`search=${encodeURIComponent(search)}`);
    if (lowPrice !== undefined) query.push(`lowPrice=${lowPrice}`);
    if (highPrice !== undefined) query.push(`highPrice=${highPrice}`);
    if (category) query.push(`category=${encodeURIComponent(category)}`);
    if (sortBy) query.push(`sortBy=${encodeURIComponent(sortBy)}`);
    if (pageIndex !== undefined) query.push(`pageIndex=${pageIndex}`);
    if (pageSize !== undefined) query.push(`pageSize=${pageSize}`);
    const queryString = query.length ? `?${query.join("&")}` : "";
    const response = await axios.get(`${API_URL}/base/getProducts${queryString}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getTopProductInMonth: async (top) => {
    const response = await axios.get(`${API_URL}/base/GetTopProductInMonth?top=${top}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
};

export default ProductService;
