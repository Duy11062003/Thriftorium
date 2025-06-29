import React, { useState, useEffect } from "react";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTag, FaCalendarAlt } from "react-icons/fa";
import AccountService from "../../../../service/AccountService";
import { toast } from "react-toastify";

const UserModal = ({ isOpen, onClose, mode, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "Customer",
    status: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && (mode === "view" || mode === "edit")) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "Customer",
        status: user.status !== undefined ? user.status : true
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "Customer",
        status: true
      });
    }
    setErrors({});
  }, [user, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        await AccountService.createAccount(formData);
        toast.success("Tạo người dùng mới thành công!");
        onSuccess();
      } else if (mode === "edit") {
        await AccountService.updateAccount(user.userID, formData);
        toast.success("Cập nhật thông tin người dùng thành công!");
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving user:", error);
      if (error.response?.status === 400) {
        toast.error("Dữ liệu không hợp lệ");
      } else if (error.response?.status === 409) {
        toast.error("Email đã tồn tại trong hệ thống");
      } else {
        toast.error("Có lỗi xảy ra khi lưu thông tin người dùng");
      }
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRoleInfo = (role) => {
    const roleConfig = {
      "Admin": { color: "text-red-600", bg: "bg-red-50", label: "Quản trị viên" },
      "Customer": { color: "text-blue-600", bg: "bg-blue-50", label: "Khách hàng" },
      "Staff": { color: "text-green-600", bg: "bg-green-50", label: "Nhân viên" },
      "Manager": { color: "text-yellow-600", bg: "bg-yellow-50", label: "Quản lý" }
    };
    return roleConfig[role] || { color: "text-gray-600", bg: "bg-gray-50", label: role };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className="inline-block w-full max-w-2xl px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaUser className="mr-2" />
              {mode === "view" && "Chi tiết người dùng"}
              {mode === "edit" && "Chỉnh sửa người dùng"}
              {mode === "create" && "Thêm người dùng mới"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          {mode === "view" ? (
            /* View Mode */
            <div className="space-y-6">
              {/* User ID & Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">ID người dùng:</span>
                  <div className="text-lg font-semibold text-gray-900">#{user?.userID}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <div>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      user?.status 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user?.status ? "Hoạt động" : "Vô hiệu hóa"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="mr-2" />
                      Họ và tên
                    </label>
                    <div className="text-gray-900">{user?.name || "N/A"}</div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="mr-2" />
                      Email
                    </label>
                    <div className="text-gray-900">{user?.email || "N/A"}</div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="mr-2" />
                      Số điện thoại
                    </label>
                    <div className="text-gray-900">{user?.phone || "N/A"}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaUserTag className="mr-2" />
                      Vai trò
                    </label>
                    <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRoleInfo(user?.role).bg} ${getRoleInfo(user?.role).color}`}>
                      {getRoleInfo(user?.role).label}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      Ngày tạo
                    </label>
                    <div className="text-gray-900">{formatDate(user?.createDate)}</div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      Cập nhật lần cuối
                    </label>
                    <div className="text-gray-900">{formatDate(user?.updateDate)}</div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  Địa chỉ
                </label>
                <div className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {user?.address || "Chưa cập nhật địa chỉ"}
                </div>
              </div>
            </div>
          ) : (
            /* Edit/Create Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="mr-2" />
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập họ và tên"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={mode === "edit"} // Usually email shouldn't be changed
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } ${mode === "edit" ? "bg-gray-100" : ""}`}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                {mode === "edit" && <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="mr-2" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaUserTag className="mr-2" />
                  Vai trò
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Customer">Khách hàng</option>
                  <option value="Staff">Nhân viên</option>
                  <option value="Manager">Quản lý</option>
                  <option value="Admin">Quản trị viên</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Tài khoản hoạt động
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                >
                  {loading 
                    ? "Đang xử lý..." 
                    : mode === "create" 
                      ? "Tạo người dùng" 
                      : "Cập nhật"
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal; 