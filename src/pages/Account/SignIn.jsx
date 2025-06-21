import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService"; // Importing the login function from AuthService

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [errVerificationCode, setErrVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrEmail("Please input your username!");
    }

    if (!password) {
      setErrPassword("Please input your password!");
    }

    if (email && password) {
      try {
        // Call the login function from AuthService.js
        await AuthService.login(email, password);

        navigate("/"); // Redirect to profile or main page
        setEmail("");
        setPassword("");
      } catch (error) {
        // Handle error
        if (
          error.response &&
          error.response.data === "You need to confirm email before login"
        )
          setIsEmailConfirmed(false);
        else setErrEmail(error.message || "Login failed!");
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
      const response = await AuthService.confirmEmail(email, verificationCode);

      if (response) {
        setSuccessMsg("Email successfully verified!");
        navigate("/");
      } else {
        setErrVerificationCode("Invalid verification code!");
      }
    } catch (error) {
      setErrVerificationCode("Verification failed!");
    }
  };
  const handleResendVerificationCode = async () => {
    try {
      await AuthService.resendVerification(email);
      setIsEmailConfirmed(true);
      setErrVerificationCode("");
    } catch (error) {
      setErrVerificationCode("Failed to resend verification code.");
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
                placeholder="Enter your 6-digit code"
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
                    Go to login
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Verify Code
            </button>

            {/* Resend Verification Code Button */}
            <button
              type="button"
              onClick={handleResendVerificationCode}
              className="w-full mt-4 bg-gray-500 text-white p-2 rounded-lg"
            >
              Resend Verification Code
            </button>
          </form>
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
              {errPassword && (
                <p className="text-red-500 text-sm">{errPassword}</p>
              )}

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
              <Link to="/signup" className="text-blue-600">
                Register here
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
