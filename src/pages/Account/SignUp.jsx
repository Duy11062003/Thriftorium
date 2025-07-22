import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService"; // Import hàm signup từ AuthService.js

const SignUp = () => {
  // ============= Initial State Start here =============
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errVerificationCode, setErrVerificationCode] = useState("");

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
  const validateEmail = (email) => {
    if (!email) {
      setErrEmail("Please input your email!");
      return false;
    } else if (
      !String(email)
        .toLowerCase()
        .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
    ) {
      setErrEmail("Enter a valid email address!");
      return false;
    }
    setErrEmail("");
    return true;
  };
  // ================= Email Validation End here ===============
  const validatePassword = (password) => {
    if (!password) {
      setErrPassword("Please input your password!");
      return false;
    }

    if (password.length < 12) {
      setErrPassword("Passwords must be at least 12 characters.");
      return false;
    }

    if (!/[^\w\s]/.test(password)) {
      setErrPassword(
        "Passwords must have at least one non alphanumeric character."
      );
      return false;
    }

    if (!/\d/.test(password)) {
      setErrPassword("Passwords must have at least one digit ('0'-'9').");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setErrPassword("Passwords must have at least one uppercase ('A'-'Z').");
      return false;
    }

    // If everything is valid
    setErrPassword(""); // clear error if needed
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!clientName) {
      setErrClientName("Please input your username!");
    }
    validateEmail(email);
    if (!phone) {
      setErrPhone("Please input your phone number!");
    }
    validatePassword(password);
    if (!address) {
      setErrAddress("Please input your address!");
    }

    if (
      clientName &&
      email &&
      validateEmail(email) &&
      validatePassword(password) &&
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
        await AuthService.signup(userData);
        setSuccessMsg(
          `Hello ${clientName}, welcome to OREBI! We have received your sign-up request. We are processing it now and will notify you soon at ${email}. Log in to verify your account.`
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
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        {successMsg ? (
          // <form onSubmit={handleVerificationSubmit}>
          //   <h1 className="text-3xl font-semibold text-center mb-6">
          //     Enter Verification Code
          //   </h1>
          //   <div className="flex flex-col mb-4">
          //     <label
          //       htmlFor="verificationCode"
          //       className="font-semibold text-lg"
          //     >
          //       <span className="text-red-500">*</span> Verification Code
          //     </label>
          //     <input
          //       type="text"
          //       id="verificationCode"
          //       value={verificationCode}
          //       onChange={(e) => {setVerificationCode(e.target.value)}}
          //       className="p-2 border border-gray-300 rounded-md"
          //       placeholder="Enter your 6-digit code"
          //     />
          //     {errVerificationCode && (
          //       <p className="text-red-500 text-sm">{errVerificationCode}</p>
          //     )}
          //   </div>
          //   <button
          //     type="submit"
          //     className="w-full bg-blue-500 text-white p-2 rounded-lg"
          //   >
          //     Verify Code
          //   </button>
          // </form>
          <div className="text-center">
            <p className="text-green-500">{successMsg}</p>
            <Link to="/signin">
              <button className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full">
                Log in
              </button>
            </Link>
          </div>
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
