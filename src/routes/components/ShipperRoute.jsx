// ShipperRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ShipperRoute = ({ element, ...rest }) => {
  const { user } = useAuth();

  if (!user || user.role !== "Shipper") {
    return <Navigate to="/403" replace />;
  }

  return <Route {...rest} element={element} />;
};

export default ShipperRoute;
