import axios from "axios";

const API_URL = "https://ticketo.store/api/Order/adminDashBoard";

const DashboardService = {
  // Get total amount and total products of week
  getTotalAmountAndProductsOfWeek: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/GetTotalAmountTotalProductsOfWeek`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get static orders (order statistics)
  getStaticOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/GetStaticOrders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get top products sold in month
  getTopProductsSoldInMonth: async () => {
    try {
      const response = await axios.get(`${API_URL}/GetTopProductsSoldInMonth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get store revenue by month
  getStoreRevenueByMonth: async () => {
    try {
      const response = await axios.get(`${API_URL}/GetStoreRevenueByMonth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get total orders and total orders amount
  getTotalOrdersAndAmount: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/GetTotalOrdersTotalOrdersAmount`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DashboardService;
