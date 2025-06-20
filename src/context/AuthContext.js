import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Tạo Context
const AuthContext = createContext();

// Custom Hook để dễ sử dụng hơn
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null nếu chưa login
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  // Giả lập kiểm tra token (có thể thay bằng gọi API /validate-token)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };
  const value = {
    user,
    logout,
    isAuthenticated: !!user,
    token,
  };

  if (loading) return null; // hoặc spinner

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
