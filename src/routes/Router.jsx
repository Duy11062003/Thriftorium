import React from "react";
import { Route, Navigate, Routes } from "react-router-dom"; // Thêm các import cần thiết

// Các trang public
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ShopDetails from "../pages/ProductDetails/ShopDetails"; // Import trang ShopDetails

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
import AdminProductManager from "../pages/Admin/products/ProductManager";
import CategoryManager from "../pages/Admin/category/CategoryManager";
import AdminLayout from "../layouts/AdminLayout";
import Cart from "../pages/Cart/Cart";
import About from "../pages/About/About";
import Blog from "../pages/Blog/Blog";
import Dashboard from "../pages/Admin/dashboard/Dashboard";
import BlogManager from "../pages/Admin/blog/BlogManager";
import BlogDetail from "../pages/Blog/BlogDetail";
import BlogList from "../pages/Blog/BlogList";
import UserManager from "../pages/Admin/user/UserManager";
import Subscription from "../pages/Subscription/Subscription";
import SubscriptionManager from "../pages/Admin/subscription/SubscriptionManager";

const publicRoutes = [
  { path: "", element: <Home />, layout: PublicLayout },
  { path: "shop", element: <Shop />, layout: PublicLayout },
  {
    path: "product/:productId",
    element: <ProductDetails />,
    layout: PublicLayout,
  },
  { path: "shop/:shopSlug", element: <ShopDetails />, layout: PublicLayout },
  { path: "*", element: <Navigate to="/" replace />, layout: PublicLayout },
  { path: "signin", element: <SignIn />, layout: PublicLayout },
  { path: "signup", element: <SignUp />, layout: PublicLayout },
  { path: "reset-password", element: <ResetPassword />, layout: PublicLayout },
  { path: "new-password", element: <NewPassword />, layout: PublicLayout },
  { path: "cart", element: <Cart />, layout: PublicLayout },
  { path: "about", element: <About />, layout: PublicLayout },
  { path: "blog", element: <Blog />, layout: PublicLayout },
  { path: "blogs", element: <BlogList />, layout: PublicLayout },
  { path: "blog/:blogID", element: <BlogDetail />, layout: PublicLayout },
  { path: "subscription", element: <Subscription />, layout: PublicLayout },
];

const adminRoutes = [
  {
    path: "product-manager",
    element: <AdminProductManager />,
    layout: AdminLayout,
  },
  {
    path: "category-manager",
    element: <CategoryManager />,
    layout: AdminLayout,
  },
  { path: "dashboard", element: <Dashboard />, layout: AdminLayout },
  { path: "blog-manager", element: <BlogManager />, layout: AdminLayout },
  { path: "user-manager", element: <UserManager />, layout: AdminLayout },
  { path: "subscription-manager", element: <SubscriptionManager />, layout: AdminLayout },
];


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
      <Route path="/admin">
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ManagementRoute layout={route.layout}>
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
