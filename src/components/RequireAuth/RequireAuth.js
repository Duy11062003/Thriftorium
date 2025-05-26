import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Ví dụ lấy thông tin user từ localStorage.
// Bạn có thể thay bằng useSelector để lấy từ Redux store nếu đã lưu auth ở đó.
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

  // Chưa đăng nhập
  if (!user?.token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng không có role phù hợp
  if (
    allowedRoles &&
    Array.isArray(allowedRoles) &&
    !allowedRoles.some((role) => user.roles?.includes(role))
  ) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  // Hợp lệ
  return <Outlet />;
}
