import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Route,
  createRoutesFromElements,
  ScrollRestoration,
  Navigate,
} from "react-router-dom";

// layouts
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";

// public pages
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Offer from "./pages/Offer/Offer";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Payment from "./pages/payment/Payment";
import Subscription from "./pages/Subscription/subscription";
import VNPayBasic from "./pages/Subscription/vnpay-basic"; 
import VNPayPremium from "./pages/Subscription/vnpay-premium";
import VNPayBasicQR from "./pages/Subscription/vnpay-basicqr";
import VNPayPremiumQR from "./pages/Subscription/vnpay-premiumqr";
import SellerHome from "./pages/SellerDashboard/SellDashboard-Home";
import SettingMyShop from "./pages/SellerDashboard/Setting-MyShop";

// auth pages
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import ResetPassword from "./pages/Account/ResetPassword";
import NewPassword from "./pages/Account/NewPassword";

// profile pages
import AccountInformation from "./pages/Profile/AccountInformation";
import MyOrder from "./pages/Profile/MyOrder";
import Voucher from "./pages/Profile/Voucher";
import ChangePassword from "./pages/Profile/ChangePassword";

// error + middleware
import Forbidden from "./pages/Forbidden/Forbidden";
import RequireAuth from "./components/RequireAuth/RequireAuth";

// Layout chung cho public
const PublicLayout = () => (
  <div className="font-bodyFont">
    <Header />
    <HeaderBottom />
    <SpecialCase />
    <ScrollRestoration />
    <Outlet />
    <Footer />
    <FooterBottom />
  </div>
);

// Layout cho profile (có sidebar)
const ProfileLayout = () => (
  <div className="bg-gray-50 min-h-screen py-10">
    <div className="max-w-container mx-auto px-4">
      <Outlet />
    </div>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="blog" element={<Blog />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="offer" element={<Offer />} />
        <Route path="product/:_id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="paymentgateway" element={<Payment />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="vnpay-basic" element={<VNPayBasic />} />
        <Route path="vnpay-premium" element={<VNPayPremium />} />
        <Route path="vnpay-basicqr" element={<VNPayBasicQR />} />
        <Route path="vnpay-premiumqr" element={<VNPayPremiumQR />} />
      </Route>

      <Route path="sellerhome" element={<SellerHome />} />
      <Route path="myshop" element={<SettingMyShop />} />
      
      {/* Auth (không show header/footer) */}
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="new-password" element={<NewPassword />} />

      {/* 403 Forbidden */}
      <Route path="403" element={<Forbidden />} />

      {/* Profile: chỉ cho user đã login và có role phù hợp */}
      <Route element={<RequireAuth allowedRoles={["user", "admin", "seller"]} />}>
        <Route path="profile" element={<PublicLayout />}>
          <Route element={<ProfileLayout />}>
            <Route index element={<AccountInformation />} />
            <Route path="account-information" element={<AccountInformation />} />
            <Route path="my-order" element={<MyOrder />} />
            <Route path="voucher" element={<Voucher />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Route>

      {/* Không tìm thấy route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
