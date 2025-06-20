import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import { toast } from "react-toastify";

const NewPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !token || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      await AuthService.resetPassword({
        username,
        email,
        password,
        confirmPassword,
        token,
      });
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (error) {
      if(error.response.data[0].code == "InvalidToken"){
        toast.error("Mã xác nhận không hợp lệ. Vui lòng nhập lại hoặc quay lại để nhận mã mới.");
      }
      else{
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-6">Enter New Password</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-6">
            <label htmlFor="email" className="font-semibold text-lg">
              <span className="text-red-500">*</span> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="username" className="font-semibold text-lg">
              <span className="text-red-500">*</span> Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="token" className="font-semibold text-lg">
              <span className="text-red-500">*</span> Verification Code
            </label>
            <input
              type="text"
              id="token"
              placeholder="Enter verification code"
              value={token}
              onChange={e => setToken(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="font-semibold text-lg">
              <span className="text-red-500">*</span> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col mb-6">
            <label htmlFor="confirmPassword" className="font-semibold text-lg">
              <span className="text-red-500">*</span> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Centering buttons and making them the same size */}
          <div className="flex justify-center space-x-4 mt-6">
            <Link to="/reset-password" className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm w-full text-center">
              ← Back
            </Link>
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm w-full text-center">
              Đặt lại mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;