// authService.js
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// eslint-disable-next-line react-hooks/rules-of-hooks
const API_URL = "https://localhost:7208/api/account";
const AuthService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    const user = {
      token: response.data.token,
      roles: response.data.roles,
    };

    localStorage.setItem("user", JSON.stringify(user));
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

  resendVerification: async (email) => {
    const response = await axios.post(`${API_URL}/resend-confirmation-email`, {
      email: email,
    });
    return response.data;
  },
};

export default AuthService;
