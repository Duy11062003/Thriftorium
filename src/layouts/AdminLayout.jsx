import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaList,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBlog,
  FaCreditCard,
  FaFlag,
  FaGift,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: FaHome },
    { path: "/admin/product-manager", name: "Quản lý sản phẩm", icon: FaBox },
    { path: "/admin/category-manager", name: "Quản lý danh mục", icon: FaList },
    { path: "/admin/user-manager", name: "Quản lý người dùng", icon: FaUsers },
    { path: "/admin/blog-manager", name: "Quản lý blog", icon: FaBlog },
    { path: "/admin/subscription-manager", name: "Quản lý gói đăng ký", icon: FaCreditCard },
    { path: "/admin/report-manager", name: "Quản lý báo cáo", icon: FaFlag },
    { path: "/admin/order-manager", name: "Quản lý đơn hàng", icon: FaBox },
    { path: "/admin/voucher-manager", name: "Quản lý voucher", icon: FaGift },
  ];
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="px-4 mt-6 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FaBars />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Chào mừng đến với dashboard của Thriftorium</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
