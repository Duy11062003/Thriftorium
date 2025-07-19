import axios from "axios";

// Always use the full URL
const API_URL = "https://104.43.89.177/api/Subcription";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all subscriptions
export const getAllSubscriptions = async () => {
  try {
    const response = await apiClient.get('/get-all-Subscriptions');
    return response.data;
  } catch (error) {
    console.error("Error getting all subscriptions:", error);
    throw error;
  }
};

// Get subscription by account ID
export const getSubscriptionByAccountId = async (accountId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${API_URL}/get-all-Subcription-by-id/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting subscription by account ID:", error);
    if (error.response) {
      // Server responded with error status
      console.error("Response error:", error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error - no response received");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Get subscriptions by plan ID
export const getSubscriptionsByPlanId = async (planId) => {
  try {
    const response = await axios.get(`${API_URL}/get-subcription-by-plan/${planId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting subscriptions by plan ID:", error);
    throw error;
  }
};

// Update subscription status
export const updateSubscriptionStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/update-Subcription-status`, {
      Id: id,
      status: status
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
};

// Create subscription
export const createSubscription = async (accountId, planId) => {
  try {
    const response = await axios.post(`${API_URL}/createSubcription`, {
      accountId: accountId,
      planID: planId // Keep as planID to match your backend expectation
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // VNPay URL
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};