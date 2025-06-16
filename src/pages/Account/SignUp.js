import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  // ============= Initial State Start here =============
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  // ============= Error Msg Start here =================
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  // ============= Error Msg End here ===================

  const [successMsg, setSuccessMsg] = useState("");

  // ============= Event Handler Start here =============
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

  const handleSignUp = (e) => {
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
    } else if (password.length < 6) {
      setErrPassword("Password must be at least 6 characters!");
    }
    if (!address) {
      setErrAddress("Please input your address!");
    }

    if (
      clientName &&
      email &&
      EmailValidation(email) &&
      password &&
      password.length >= 6 &&
      address
    ) {
      setSuccessMsg(
        `Hello ${clientName}, welcome to OREBI! We have received your sign-up request. We are processing it now and will notify you soon at ${email}.`
      );
      setClientName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAddress("");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        {successMsg ? (
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
            <h1 className="text-3xl font-semibold text-center mb-6">Create Account</h1>
            
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
              {errClientName && <p className="text-red-500 text-sm">{errClientName}</p>}
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
              {errClientName && <p className="text-red-500 text-sm">{errClientName}</p>}
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
              {errPassword && <p className="text-red-500 text-sm">{errPassword}</p>}
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
              {errAddress && <p className="text-red-500 text-sm">{errAddress}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Create Account
            </button>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;