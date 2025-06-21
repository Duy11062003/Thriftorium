// ManagementRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManagementRoute = ({ children, layout: Layout }) => {
  const { user } = useAuth();
  if (
    !user ||
    !user.roles ||
    (user.roles[0] !== "Admin" && user.roles[0] !== "Manager")
  ) {
    return <Navigate to="/403" replace />;
  }
  if (Layout) {
    return <Layout>{children}</Layout>;
  }
  return <>{children}</>;
};

export default ManagementRoute;
