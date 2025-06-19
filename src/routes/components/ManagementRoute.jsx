// ManagementRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManagementRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !["Admin", "Manager"].includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default ManagementRoute;
