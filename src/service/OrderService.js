import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://localhost:7208";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const OrderService = {
  // GET /api/Order/get-all-orders-by-id/{accountId}
  getOrdersByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Order/get-all-orders-by-id/${accountId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders by account ID:", error);
      throw error;
    }
  },

  // GET /api/Order/get-all-orders
  getAllOrders: async (searchParams = {}) => {
    try {
      const params = {};

      // Add optional query parameters
      if (searchParams.search) {
        params.search = searchParams.search;
      }
      if (searchParams.date) {
        params.date = searchParams.date;
      }
      if (searchParams.status !== undefined && searchParams.status !== null) {
        params.status = searchParams.status;
      }

      const response = await apiClient.get("/api/Order/get-all-orders", {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  },

  // PUT /api/Order/update-order-status
  updateOrderStatus: async (orderId, status) => {
    try {
      const params = {
        orderId,
        status,
      };

      const response = await apiClient.put(
        "/api/Order/update-order-status",
        null,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // PUT /api/Order/cancel-order
  cancelOrder: async (orderId) => {
    try {
      const params = { orderId };

      const response = await apiClient.put("/api/Order/cancel-order", null, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },

  // PUT /api/Order/complete-order
  completeOrder: async (orderId, status) => {
    try {
      const params = {
        orderId,
        status,
      };

      const response = await apiClient.put("/api/Order/complete-order", null, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error completing order:", error);
      throw error;
    }
  },

  // GET /api/Order/get-order-by-id/{orderId}
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(
        `/api/Order/get-order-by-id/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  },
};

export default OrderService;
