import axios from "axios";

const API_URL = "https://ticketo.store/api/VoucherUsage";

const VoucherUsageService = {
  getAllVoucherUsages: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getVoucherUsageById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createVoucherUsage: async (usageData) => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        {
          accountID: usageData.accountID,
          userVoucherID: usageData.userVoucherID,
          giftID: usageData.giftID,
          orderID: usageData.orderID,
          isUsed: usageData.isUsed,
          usedAt: usageData.usedAt,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateVoucherUsage: async (usageData) => {
    try {
      const response = await axios.put(
        `${API_URL}`,
        {
          voucherUsageID: usageData.voucherUsageID,
          accountID: usageData.accountID,
          userVoucherID: usageData.userVoucherID,
          giftID: usageData.giftID,
          orderID: usageData.orderID,
          isUsed: usageData.isUsed,
          usedAt: usageData.usedAt,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteVoucherUsage: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default VoucherUsageService;
