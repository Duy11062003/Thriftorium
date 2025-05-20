// src/App.js
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Route,
  createRoutesFromElements,
  ScrollRestoration,
} from "react-router-dom";

// global layout
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";

// pages
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Payment from "./pages/payment/Payment";

// auth
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import ResetPassword from "./pages/Account/ResetPassword";
import NewPassword from "./pages/Account/NewPassword";

// profile
import AccountInformation from "./pages/Profile/AccountInformation";
import MyOrder from "./pages/Profile/MyOrder";
import Voucher from "./pages/Profile/Voucher";
import ChangePassword from "./pages/Profile/ChangePassword";


// Layout chung cho các trang public
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

// Layout riêng cho Profile (có sidebar)
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
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="journal" element={<Journal />} />
        <Route path="offer" element={<Offer />} />
        <Route path="product/:_id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="paymentgateway" element={<Payment />} />
      </Route>

      {/* Auth (không cần sidebar) */}
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="new-password" element={<NewPassword />} />

      {/* Profile routes */}
      <Route path="profile" element={<PublicLayout />}>
        {/* đầu tiên vẫn show header/footer */}
        <Route element={<ProfileLayout />}>
          <Route
            index
            element={<AccountInformation />}
          />
          <Route
            path="account-information"
            element={<AccountInformation />}
          />
          <Route path="my-order" element={<MyOrder />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
