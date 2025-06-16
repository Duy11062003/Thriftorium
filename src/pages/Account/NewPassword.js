import React, { useState } from "react";
import { Link } from "react-router-dom";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#a8edea] via-[#fed6e3] to-[#a8edea]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-6">Enter New Password</h1>
        
        <form>
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
            <Link to="/signin" className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm w-full text-center">
              Next →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;