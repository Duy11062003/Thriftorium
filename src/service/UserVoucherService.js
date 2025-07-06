import axios from "axios";

const API_URL = "https://localhost:7208/api/UserVoucher";

const UserVoucherService = {
  getAllUserVouchers: async () => {
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

  getUserVoucherById: async (id) => {
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

  getUnusedVouchersByAccountId: async (accountId) => {
    try {
      const response = await axios.get(`${API_URL}/unused/${accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createUserVoucher: async (voucherData) => {
    try {
      const response = await axios.post(`${API_URL}`, {
        startedAt: voucherData.startedAt,
        expiredAt: voucherData.expiredAt,
        status: voucherData.status,
        voucherTemplateID: voucherData.voucherTemplateID,
        accountID: voucherData.accountID
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserVoucher: async (voucherData) => {
    try {
      const response = await axios.put(`${API_URL}`, {
        voucherCode: voucherData.voucherCode,
        startedAt: voucherData.startedAt,
        expiredAt: voucherData.expiredAt,
        status: voucherData.status,
        voucherTemplateID: voucherData.voucherTemplateID,
        accountID: voucherData.accountID
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUserVoucher: async (id) => {
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

export default UserVoucherService;
