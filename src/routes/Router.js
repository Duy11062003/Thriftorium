import React from "react";
import { Route, Navigate, Outlet, Routes } from "react-router-dom"; // Thêm các import cần thiết

// Các trang public
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ShopDetails from "../pages/ProductDetails/ShopDetails"; // Import trang ShopDetails

// Trang Dashboard cho seller
import SellerHome from "../pages/SellerDashboard/SellDashboard-Home";
import SettingMyShop from "../pages/SellerDashboard/Setting-MyShop";
import CatalogProducts from "../pages/SellerDashboard/Catalog-Products";
import SettingsPlan from "../pages/SellerDashboard/Setting-Plan";

// Auth pages
import SignIn from "../pages/Account/SignIn";
import SignUp from "../pages/Account/SignUp";
import ResetPassword from "../pages/Account/ResetPassword";
import NewPassword from "../pages/Account/NewPassword";

// Profile pages
import AccountInformation from "../pages/Profile/AccountInformation";
import MyOrder from "../pages/Profile/MyOrder";
import Voucher from "../pages/Profile/Voucher";
import ChangePassword from "../pages/Profile/ChangePassword";

// Error + middleware
import Forbidden from "../pages/Forbidden/Forbidden";

// Import các route phân quyền
import PublicRoute from "./components/PublicRoute";
import ManagementRoute from "./components/ManagementRoute";
// import ShipperRoute from "./components/components/ShipperRoute";
import PrivateRoute from "./components/PrivateRoute";
import PublicLayout from "../layouts/PublicLayout";
import ProfileLayout from "../layouts/ProfileLayout";

const publicRoutes = [
  { path: "", element: <Home />, layout: PublicLayout },
  { path: "shop", element: <Shop /> },
  { path: "product/:_id", element: <ProductDetails />, layout: PublicLayout },
  { path: "shop/:shopSlug", element: <ShopDetails />, layout: PublicLayout },
  { path: "*", element: <Navigate to="/" replace />, layout: PublicLayout },
  { path: "signin", element: <SignIn />, layout: PublicLayout },
  { path: "signup", element: <SignUp />, layout: PublicLayout },
  { path: "reset-password", element: <ResetPassword />, layout: PublicLayout },
  { path: "new-password", element: <NewPassword />, layout: PublicLayout },
];

const sellerRoutes = [
  { path: "sellerhome", element: <SellerHome /> },
  { path: "myshop", element: <SettingMyShop /> },
  { path: "productscatalog", element: <CatalogProducts /> },
  { path: "plan", element: <SettingsPlan /> },
];

// const shipperRoutes = [
//   { path: "shipper-dashboard", element: <ShipperDashboard /> },
//   // Các route khác cho shipper
// ];

const privateRoutes = [
  {
    path: "account-information",
    element: <AccountInformation />,
    layout: ProfileLayout,
  },
  { path: "my-order", element: <MyOrder />, layout: ProfileLayout },
  { path: "voucher", element: <Voucher />, layout: ProfileLayout },
  {
    path: "change-password",
    element: <ChangePassword />,
    layout: ProfileLayout,
  },
];

const Routers = () => {
  return (
    <Routes>
      <Route path="/">
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicRoute layout={route.layout}>{route.element}</PublicRoute>
            }
          />
        ))}
      </Route>
      <Route path="/seller">
        {sellerRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ManagementRoute layout={route.layout ?? null}>
                {route.element}
              </ManagementRoute>
            }
          />
        ))}
      </Route>
      <Route path="/profile">
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute layout={route.layout}>{route.element}</PrivateRoute>
            }
          />
        ))}
      </Route>
      <Route path="403" element={<Forbidden />} />

      {/* 
      {shipperRoutes.map((route) => (
        <ShipperRoute
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))} */}
    </Routes>
  );
};
export default Routers;
