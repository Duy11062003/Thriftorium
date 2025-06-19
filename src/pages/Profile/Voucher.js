// src/pages/Profile/Voucher.js
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaReceipt,
  FaTicketAlt,
  FaKey,
  FaSignOutAlt,
  FaGift,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const importAsset = (file) => {
  try {
    return require(`../../assets/images/${file}`);
  } catch {
    return "";
  }
};

const vouchers = [
  {
    title: "First Purchase",
    icon: <FaGift className="text-blue-600" />,
    description: "5% off for your next order",
    code: "FIRST123",
    expires: "Valid Until 15.05.2025",
  },
  {
    title: "Gift From Customer Care",
    icon: <FaGift className="text-blue-600" />,
    description: "15% off your next purchase",
    code: "CARE15",
    expires: "Valid Until 15.05.2025",
  },
];

export default function Voucher() {
  const { logout } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold">Voucher</h1>
        <p className="text-sm text-gray-600 mt-1 mb-8">/profile/voucher</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 space-y-8">
            <div className="flex items-center space-x-4">
              <img
                src={importAsset("orebiLogo.png")}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="font-semibold">Bùi Khánh Duy</div>
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/profile/account-information"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaUser className="mr-3" /> Account Information
              </NavLink>
              <NavLink
                to="/profile/my-order"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaReceipt className="mr-3" /> My Order
              </NavLink>
              <NavLink
                to="/profile/voucher"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaTicketAlt className="mr-3" /> Voucher
              </NavLink>
              <NavLink
                to="/profile/change-password"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaKey className="mr-3" /> Change Password
              </NavLink>
              <button
                onClick={() => logout()}
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt className="mr-3" /> Log Out
              </button>
            </nav>
          </div>

          {/* Voucher List */}
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="text-xl font-semibold">Best offers for you</h2>
            {vouchers.map((v, i) => (
              <div
                key={i}
                className="relative border border-gray-300 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                {/* Notch effect */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full border-t border-b border-gray-300"></div>
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full border-t border-b border-gray-300"></div>

                {/* Left: Voucher info */}
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{v.icon}</div>
                  <div>
                    <div className="font-semibold">{v.title}</div>
                    <p className="text-sm text-gray-600">{v.description}</p>
                  </div>
                </div>

                {/* Right: Expires & Button */}
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                  <span className="text-xs text-gray-500 mb-2">
                    {v.expires}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
