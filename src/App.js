import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
  ScrollRestoration,
  Outlet,
  createRoutesFromElements
} from "react-router-dom"; // Thêm các import cần thiết

// Import các trang và Layouts
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";

// Các trang public
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Offer from "./pages/Offer/Offer";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";

// Các trang thanh toán
import Payment from "./pages/payment/Payment";
import VNPayBasicQR from "./pages/payment/VNPayBasicQR";
import PaymentSuccess from "./pages/payment/PaymentSuccess";

// Trang subscription (nếu có)
import Subscription from "./pages/Subscription/subscription";
import VNPayBasic from "./pages/Subscription/vnpay-basic";
import VNPayPremium from "./pages/Subscription/vnpay-premium";
import VNPayPremiumQR from "./pages/Subscription/vnpay-premiumqr";

// Trang Dashboard cho seller
import SellerHome from "./pages/SellerDashboard/SellDashboard-Home";
import SettingMyShop from "./pages/SellerDashboard/Setting-MyShop";
import CatalogProducts from "./pages/SellerDashboard/Catalog-Products";
import SettingsPlan from "./pages/SellerDashboard/Setting-Plan";

// Auth pages
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import ResetPassword from "./pages/Account/ResetPassword";
import NewPassword from "./pages/Account/NewPassword";

// Profile pages
import AccountInformation from "./pages/Profile/AccountInformation";
import MyOrder from "./pages/Profile/MyOrder";
import Voucher from "./pages/Profile/Voucher";
import ChangePassword from "./pages/Profile/ChangePassword";

// Error + middleware
import Forbidden from "./pages/Forbidden/Forbidden";
import RequireAuth from "./components/RequireAuth/RequireAuth";

// Import ShopDetails
import ShopDetails from "./pages/ProductDetails/ShopDetails"; // Import trang ShopDetails

// Layout chung cho các trang public (có Header + Footer)
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

// Layout riêng cho phần Profile (có khung background và padding)
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
      {/* ========= Các route công khai (Public) ========= */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:_id" element={<ProductDetails />} />
        <Route path="shop/:shopSlug" element={<ShopDetails />} /> {/* Route cho ShopDetails */}

        {/* Các route khác */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Route cho Seller */}
      <Route element={<RequireAuth allowedRoles={["seller"]} />}>
        <Route path="sellerhome" element={<SellerHome />} />
        <Route path="myshop" element={<SettingMyShop />} />
        <Route path="productscatalog" element={<CatalogProducts />} />
        <Route path="plan" element={<SettingsPlan />} />
      </Route>

      {/* Auth (không show header/footer) */}
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="new-password" element={<NewPassword />} />

      {/* ========= 403 Forbidden ========= */}
      <Route path="403" element={<Forbidden />} />

      {/* ========= Các route cho profile (yêu cầu login + role) ========= */}
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

      {/* Shop details page route */}
      <Route path="shop/:shopSlug" element={<ShopDetails />} /> {/* Đường dẫn cho Shop Lí Lắc */}

      {/* ========= Nếu không có route nào khớp, chuyển về trang chủ ========= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
