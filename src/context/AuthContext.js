import React, { createContext, useState, useEffect, useContext } from "react";

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

  // Giả lập kiểm tra token (có thể thay bằng gọi API /validate-token)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
  };

  if (loading) return null; // hoặc spinner

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
