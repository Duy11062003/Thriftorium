// src/pages/Profile/ChangePassword.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaReceipt,
  FaTicketAlt,
  FaKey,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const importAsset = (file) => {
  try {
    return require(`../../assets/images/${file}`);
  } catch {
    return "";
  }
};

export default function ChangePassword() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold">Change Password</h1>
        <p className="text-sm text-gray-600 mt-1 mb-8">
          /profile/change password
        </p>

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
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaKey className="mr-3" /> Change Password
              </NavLink>
              <button className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg">
                <FaSignOutAlt className="mr-3" /> Log Out
              </button>
            </nav>
          </div>

          {/* Change Password Form */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
            <div className="space-y-4">
              {/* Current */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <span
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute inset-y-0 right-3 top-9 flex items-center cursor-pointer text-gray-500"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {/* New */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <span
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute inset-y-0 right-3 top-9 flex items-center cursor-pointer text-gray-500"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {/* Confirm */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <span
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 top-9 flex items-center cursor-pointer text-gray-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-800 transition">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
