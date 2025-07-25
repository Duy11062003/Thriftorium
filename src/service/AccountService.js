// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://ticketo.store/api/account";
const AccountService = {
  updateAccount: async (userId, data) => {
    const response = await axios.put(`${API_URL}/Update-Account?userId=${userId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  updateAccountStatus: async (userEmail, data) => {
    const response = await axios.put(`${API_URL}/Update-Account-Status?userEmail=${userEmail}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
  getAllAccount: async () => {
    const response = await axios.get(`${API_URL}/Get-all-accounts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  getAccountById: async (userId) => {
    const response = await axios.get(`https://ticketo.store/api/AccountApp/base/string/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  },
};

export default AccountService;
