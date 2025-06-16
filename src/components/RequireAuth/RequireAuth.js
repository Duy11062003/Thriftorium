import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export default function RequireAuth({ allowedRoles }) {
  const location = useLocation();
  const user = getCurrentUser();

  // Kiểm tra người dùng đã đăng nhập chưa
  if (!user?.token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền của người dùng
  if (
    allowedRoles &&
    Array.isArray(allowedRoles) &&
    !allowedRoles.some((role) => user.roles?.includes(role))
  ) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  // Nếu hợp lệ, cho phép truy cập
  return <Outlet />;
}