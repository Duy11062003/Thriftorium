import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email) {
      setErrEmail("Please input your username!");
    }

    if (!password) {
      setErrPassword("Please input your password!");
    }

    if (email && password) {
      setSuccessMsg(`Hello, ${email}. We are processing your login.`);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        {successMsg ? (
          <div className="text-center">
            <p className="text-green-500">{successMsg}</p>
            <Link to="/signup">
              <button className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full">
                Register
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignIn}>
            <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>

            <div className="flex flex-col mb-6">
              <label htmlFor="email" className="font-semibold text-lg">
                <span className="text-red-500">*</span> UserName
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmail}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your UserName"
              />
              {errEmail && <p className="text-red-500 text-sm">{errEmail}</p>}
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePassword}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
              {errPassword && <p className="text-red-500 text-sm">{errPassword}</p>}
              
              {/* Forgot password link */}
              <div className="text-right mt-4">
                <Link to="/reset-password" className="text-blue-600 text-sm">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Login
            </button>

            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600">Register here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
