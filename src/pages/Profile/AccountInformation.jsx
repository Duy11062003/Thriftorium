// src/pages/Profile/AccountInformation.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaReceipt,
  FaTicketAlt,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import AccountAppService from "../../service/AccountAppService";
import { toast } from "react-toastify";

const importAsset = (file) => {
  try {
    return require(`../../assets/images/${file}`);
  } catch {
    return "";
  }
};

export default function AccountInformation() {
  const { user, logout } = useAuth();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user data khi component mount
  useEffect(() => {
    if (user) {
      setname(user.name || user.userName || "");
      setEmail(user.email || "");
      setPhone(user.phone || user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleUpdateAccount = async () => {
    if (!user?.userID) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    // Validation
    if (!name.trim()) {
      toast.error("Vui lòng nhập họ tên!");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

      await AccountAppService.updateAccount(user.userID, updateData);
      
      // Cập nhật thông tin user trong localStorage (optional)
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Cập nhật thông tin tài khoản thành công!");
      
    } catch (error) {
      console.error("Error updating account:", error);
      
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        logout();
      } else if (error.response?.status === 400) {
        toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại!");
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy tài khoản!");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold">Thông tin tài khoản</h1>
        <p className="text-sm text-gray-600 mt-1 mb-8">
          /profile/account information
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left nav */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 space-y-8">
            <div className="flex items-center space-x-4">
              <img
                src={importAsset("orebiLogo.png")}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="font-semibold">{user?.name || user?.userName || "User"}</div>
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
                <FaUser className="mr-3" /> Thông tin tài khoản
              </NavLink>
              <NavLink
                to="/profile/my-order"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaReceipt className="mr-3" /> Đơn hàng
              </NavLink>
              <NavLink
                to="/profile/voucher"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaTicketAlt className="mr-3" /> Voucher
              </NavLink>
              <NavLink
                to="/profile/change-password"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaKey className="mr-3" /> Đổi mật khẩu
              </NavLink>
              <button
                onClick={() => logout()}
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt className="mr-3" /> Đăng xuất
              </button>
            </nav>
          </div>

          {/* Right form */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full name */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Tên *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập họ tên"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập email"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {/* Address */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleUpdateAccount}
                disabled={isUpdating}
                className={`px-8 py-2 rounded-lg transition ${
                  isUpdating 
                    ? "bg-gray-400 cursor-not-allowed text-white" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isUpdating ? "Đang cập nhật..." : "Update Information"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
