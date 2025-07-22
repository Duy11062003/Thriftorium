import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../service/AuthService";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendToken = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }
    try {
      await AuthService.getResetPasswordToken(email);
      toast.success("Đã gửi mã xác nhận đến email!");
    } catch (error) {
      toast.error("Gửi mã thất bại. Vui lòng kiểm tra lại email.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-6">Reset Password</h1>
        
        <form onSubmit={handleSendToken}>
          <div className="flex flex-col mb-6">
            <label htmlFor="email" className="font-semibold text-lg">
              <span className="text-red-500">*</span> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={handleEmailChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Centering buttons and making them the same size */}
          <div className="flex justify-center space-x-4 mt-6">
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm w-full text-center">
              Gửi mã xác nhận
            </button>
            <Link to="/new-password" className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm w-full text-center">
              Next →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;