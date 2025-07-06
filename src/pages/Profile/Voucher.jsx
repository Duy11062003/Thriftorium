// src/pages/Profile/Voucher.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaReceipt,
  FaTicketAlt,
  FaKey,
  FaSignOutAlt,
  FaGift,
  FaCopy,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import UserVoucherService from "../../service/UserVoucherService";
import { toast } from "react-toastify";

const importAsset = (file) => {
  try {
    return require(`../../assets/images/${file}`);
  } catch {
    return "";
  }
};

export default function Voucher() {
  const { logout, user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch vouchers from API
  useEffect(() => {
    const fetchVouchers = async () => {
      if (!user?.userID) {
        setLoading(false);
        return;
      }

      try {
        const response = await UserVoucherService.getUnusedVouchersByAccountId(user.userID);
        setVouchers(response || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        toast.error("Không thể tải danh sách voucher");
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user?.userID]);

  // Handle copy voucher code
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Đã sao chép mã voucher!");
    } catch (error) {
      console.error("Error copying code:", error);
      toast.error("Không thể sao chép mã voucher");
    }
  };

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
              <div className="font-semibold">{user?.fullName || user?.userName || "Người dùng"}</div>
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
            <h2 className="text-xl font-semibold">Voucher của bạn ({vouchers.length})</h2>
            
            {/* Loading state */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Đang tải voucher...</p>
              </div>
            )}

            {/* Voucher list */}
            {!loading && vouchers.length > 0 && vouchers.map((voucher, i) => (
              <div
                key={voucher.voucherCode || i}
                className="relative border border-gray-300 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                {/* Notch effect */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full border-t border-b border-gray-300"></div>
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full border-t border-b border-gray-300"></div>

                {/* Left: Voucher info */}
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    <FaGift className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {voucher.voucherTemplate?.name || "Voucher giảm giá"}
                    </div>
                    <p className="text-sm text-gray-600">
                      Giảm {voucher.voucherTemplate?.discountPercentage || 0}% cho đơn hàng của bạn
                    </p>
                    {voucher.voucherTemplate?.milestoneAmount && (
                      <p className="text-xs text-gray-500">
                        Đơn tối thiểu: {voucher.voucherTemplate.milestoneAmount.toLocaleString()} VND
                      </p>
                    )}
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      Mã: {voucher.voucherCode}
                    </p>
                  </div>
                </div>

                {/* Right: Expires & Button */}
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                  <span className="text-xs text-gray-500 mb-2">
                    Hết hạn: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyCode(voucher.voucherCode)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaCopy className="text-sm" />
                      Sao chép mã
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {!loading && vouchers.length === 0 && (
              <div className="text-center py-12">
                <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có voucher nào</h3>
                <p className="text-gray-500">Bạn chưa có voucher nào có thể sử dụng. Hãy tiếp tục mua sắm để nhận voucher mới!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
