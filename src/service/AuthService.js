// authService.js
import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://ticketo.store/api/account";
const AuthService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  signup: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  confirmEmail: async (email, code) => {
    const response = await axios.post(
      `${API_URL}/confirmation/${email}/${code}`
    );
    return response.data;
  },
  changePassword: async (data) => {
    const response = await axios.post(`${API_URL}/Change-Password`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
  getResetPasswordToken: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, {
      email: email,
    });
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await axios.post(
      `${API_URL}/reset-password-with-code`,
      data
    );
    return response.data;
  },
  resendVerification: async (email) => {
    const response = await axios.post(`${API_URL}/resend-confirmation-email`, {
      email: email,
    });
    return response.data;
  },
};

export default AuthService;
