import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { confirmEmail, signup } from "./AuthService"; // Import hàm signup từ AuthService.js

const SignUp = () => {
  // ============= Initial State Start here =============
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errVerificationCode, setErrVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(true); // Track verification state

  // ============= Error Msg Start here =================
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  // ============= Error Msg End here ===================

  const [successMsg, setSuccessMsg] = useState("");

  // ============= Event Handler Start here =============
  const navigate = useNavigate();
  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
    setErrPhone("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setErrAddress("");
  };
  // ============= Event Handler End here ===============

  // ================= Email Validation start here =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  // ================= Email Validation End here ===============

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!clientName) {
      setErrClientName("Please input your username!");
    }
    if (!email) {
      setErrEmail("Please input your email!");
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a valid email address!");
    }
    if (!phone) {
      setErrPhone("Please input your phone number!");
    }
    if (!password) {
      setErrPassword("Please input your password!");
    } else if (password.length < 12) {
      setErrPassword("Password must be at least 12 characters!");
    }
    if (!address) {
      setErrAddress("Please input your address!");
    }

    if (
      clientName &&
      email &&
      EmailValidation(email) &&
      password &&
      password.length >= 12 &&
      address
    ) {
      const userData = {
        username: clientName,
        email: email,
        name: clientName,
        password: password,
        address: address,
        phone: phone,
      };

      try {
        // Gọi API đăng ký
        const data = await signup(userData);
        setSuccessMsg(
          `Hello ${clientName}, welcome to OREBI! We have received your sign-up request. We are processing it now and will notify you soon at ${email}.`
        );

        // Reset form fields
        setClientName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setAddress("");
      } catch (error) {
        setErrClientName(error.message); // Hiển thị lỗi nếu có
      }
    }
  };
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setErrVerificationCode("The verification code must be 6 digits.");
      return;
    }

    // Simulate sending the verification code to the backend (add API call here)
    try {
      // Example API call to verify the code (replace with your actual API endpoint)
      const response = await confirmEmail(email, verificationCode);

      if (response.data.success) {
        setIsVerified(true);
        setSuccessMsg("Email successfully verified!");
        navigate("/dashboard"); // Redirect to the dashboard or main page after verification
      } else {
        setErrVerificationCode("Invalid verification code!");
      }
    } catch (error) {
      setErrVerificationCode("Verification failed!");
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        {successMsg ? (
          <form onSubmit={handleVerificationSubmit}>
            <h1 className="text-3xl font-semibold text-center mb-6">
              Enter Verification Code
            </h1>
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
                onChange={(e) => {setVerificationCode(e.target.value)}}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your 6-digit code"
              />
              {errVerificationCode && (
                <p className="text-red-500 text-sm">{errVerificationCode}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Verify Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <h1 className="text-3xl font-semibold text-center mb-6">
              Create Account
            </h1>

            <div className="flex flex-col mb-4">
              <label htmlFor="clientName" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Username
              </label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={handleName}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your username"
              />
              {errClientName && (
                <p className="text-red-500 text-sm">{errClientName}</p>
              )}
            </div>

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
                placeholder="Enter your email"
              />
              {errEmail && <p className="text-red-500 text-sm">{errEmail}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Name
              </label>
              <input
                type="text"
                id="name"
                value={clientName}
                onChange={handleName}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
              {errClientName && (
                <p className="text-red-500 text-sm">{errClientName}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="phone" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Phone
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={handlePhone}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your phone number"
              />
              {errPhone && <p className="text-red-500 text-sm">{errPhone}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePassword}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Create your password"
              />
              {errPassword && (
                <p className="text-red-500 text-sm">{errPassword}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="address" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleAddress}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your address"
              />
              {errAddress && (
                <p className="text-red-500 text-sm">{errAddress}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Create Account
            </button>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
