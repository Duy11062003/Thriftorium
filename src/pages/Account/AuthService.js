import axios from "axios";

const API_URL = "https://localhost:7208/api/account";

// Hàm đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Đăng nhập thất bại");
    } else if (error.request) {
      throw new Error("Không thể kết nối đến máy chủ");
    } else {
      throw new Error("Đã có lỗi xảy ra");
    }
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Đăng ký thất bại");
    } else if (error.request) {
      throw new Error("Không thể kết nối đến máy chủ");
    } else {
      throw new Error("Đã có lỗi xảy ra");
    }
  }
};
export const confirmEmail = async (email, code) => {
  try {
    const response = await axios.get(
      `${API_URL}/confirmation/${email}/${code}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Xác nhận email thất bại");
    } else if (error.request) {
      throw new Error("Không thể kết nối đến máy chủ");
    } else {
      throw new Error("Đã có lỗi xảy ra");
    }
  }
};
