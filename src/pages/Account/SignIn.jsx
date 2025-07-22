import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService"; // Importing the login function from AuthService
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Added email state for verification
  const [errUsername, setErrUsername] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errEmail, setErrEmail] = useState(""); // Added email error state
  const [successMsg, setSuccessMsg] = useState("");
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [errVerificationCode, setErrVerificationCode] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
    setErrUsername("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!username) {
      setErrUsername("Hãy nhập username!");
    }

    if (!password) {
      setErrPassword("Hãy nhập mật khẩu");
    }

    if (username && password) {
      try {
        // Call the login function from AuthService.js
        await AuthService.login(username, password);

        navigate("/"); // Redirect to profile or main page
        setUsername("");
        setPassword("");
        login();
      } catch (error) {
        // Handle error
        if (
          error.response &&
          error.response.data === "You need to confirm email before login"
        ) {
          setIsEmailConfirmed(false);
        } else {
          setErrUsername(error.message || "Đăng nhập thất bại!");
        }
      }
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrEmail("Hãy nhập email!");
      return;
    }

    if (verificationCode.length !== 6) {
      setErrVerificationCode("Mã xác nhận phải có 6 ký tự");
      return;
    }

    // Send verification code with email instead of username
    try {
      const response = await AuthService.confirmEmail(email, verificationCode);

      if (response) {
        setSuccessMsg("Xác nhận email thành công!");
        navigate("/");
      } else {
        setErrVerificationCode("Mã xác nhận sai!");
      }
    } catch (error) {
      setErrVerificationCode("Xác nhận thất bại!");
    }
  };

  const handleResendVerificationCode = async () => {
    if (!email) {
      setErrEmail("Hãy nhập email để nhận lại mã xác nhận!");
      return;
    }

    try {
      await AuthService.resendVerification(email); // Use email instead of username
      setSuccessMsg("Mã đã được gửi tới email!");
      setErrVerificationCode("");
    } catch (error) {
      setErrVerificationCode("Gửi mã thất bại.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        {!isEmailConfirmed ? (
          <form onSubmit={handleVerificationSubmit}>
            <h1 className="text-3xl font-semibold text-center mb-6">
              Enter Verification Code
            </h1>
            
            {/* Email input field for verification */}
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmail}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Nhập email"
              />
              {errEmail && (
                <p className="text-red-500 text-sm">{errEmail}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label
                htmlFor="verificationCode"
                className="font-semibold text-lg"
              >
                <span className="text-red-500">*</span> Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Nhập mã xác nhận 6 số"
              />
              {errVerificationCode && (
                <p className="text-red-500 text-sm">{errVerificationCode}</p>
              )}
              {successMsg && (
                <div className="flex flex-row">
                  <p className="text-green-500 text-sm">{successMsg}</p>
                  <button
                    onClick={() => setSuccessMsg("")}
                    className="text-blue-500 border-none bg-transparent"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Xác nhận
            </button>

            {/* Resend Verification Code Button */}
            <button
              type="button"
              onClick={handleResendVerificationCode}
              className="w-full mt-4 bg-gray-500 text-white p-2 rounded-lg"
            >
              Gửi lại mã xác nhận
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn}>
            <h1 className="text-3xl font-semibold text-center mb-6">Đăng nhập</h1>

            <div className="flex flex-col mb-6">
              <label htmlFor="username" className="font-semibold text-lg">
                <span className="text-red-500">*</span> UserName
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsername}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your UserName"
              />
              {errUsername && <p className="text-red-500 text-sm">{errUsername}</p>}
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePassword}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
              {errPassword && (
                <p className="text-red-500 text-sm">{errPassword}</p>
              )}

              {/* Forgot password link */}
              <div className="text-right mt-4">
                <Link to="/reset-password" className="text-blue-600 text-sm">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Đăng nhập
            </button>

            <p className="text-center mt-4">
              Không có tài khoản?{" "}
              <Link to="/signup" className="text-blue-600">
                Đăng ký
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;