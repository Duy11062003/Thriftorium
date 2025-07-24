// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://localhost:7208/api/accountApp";
const AccountAppService = {
  updateAccount: async (userId, data) => {
    const response = await axios.put(`${API_URL}/base/string/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },

  getAccountById: async (userId) => {
    const response = await axios.get(`${API_URL}/base/string/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
};

export default AccountAppService;
