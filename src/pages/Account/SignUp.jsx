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
      setErrEmail("Hãy nhập email!");
      return false;
    } else if (
      !String(email)
        .toLowerCase()
        .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
    ) {
      setErrEmail("Hãy nhập email chính xác!");
      return false;
    }
    setErrEmail("");
    return true;
  };
  // ================= Email Validation End here ===============
  const validatePassword = (password) => {
    if (!password) {
      setErrPassword("Hãy nhập mật khẩu!");
      return false;
    }

    if (password.length < 12) {
      setErrPassword("Mật khảu phải ít nhất 12 ký tự.");
      return false;
    }

    if (!/[^\w\s]/.test(password)) {
      setErrPassword(
        "Mật khẩu phải có ký tự chữ và số."
      );
      return false;
    }

    if (!/\d/.test(password)) {
      setErrPassword("Mật khẩu phải có ít nhất 1 số ('0'-'9').");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setErrPassword("Mật khẩu phải có 1 ký tự in hoa ('A'-'Z').");
      return false;
    }

    // If everything is valid
    setErrPassword(""); // clear error if needed
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!clientName) {
      setErrClientName("Hãy nhập username !");
    }
    validateEmail(email);
    if (!phone) {
      setErrPhone("Hãy nhập số đth!");
    }
    validatePassword(password);
    if (!address) {
      setErrAddress("Hãy nhập địa chỉ!");
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
          `Xin chào ${clientName}, chào mừng tới Thriftorium! Chúng tôi đã nhận được yêu cầu đăng ký của bạn. Chúng tôi đang xử lý ngay bây giờ và sẽ thông báo cho bạn sớm tại ${email}. Đăng nhập để xác minh tài khoản của bạn.`
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
                Đăng nhập
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
            <h1 className="text-3xl font-semibold text-center mb-6">
              Tạo tài khoản
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
                placeholder="Nhập username"
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
                placeholder="Nhập email"
              />
              {errEmail && <p className="text-red-500 text-sm">{errEmail}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Tên
              </label>
              <input
                type="text"
                id="name"
                value={clientName}
                onChange={handleName}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Nhập tên"
              />
              {errClientName && (
                <p className="text-red-500 text-sm">{errClientName}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="phone" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Số điện thoại
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={handlePhone}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Nhập số điện thoại"
              />
              {errPhone && <p className="text-red-500 text-sm">{errPhone}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePassword}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Nhập mật khẩu"
              />
              {errPassword && (
                <p className="text-red-500 text-sm">{errPassword}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="address" className="font-semibold text-lg">
                <span className="text-red-500">*</span> Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleAddress}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Nhập địa chỉ"
              />
              {errAddress && (
                <p className="text-red-500 text-sm">{errAddress}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Tạo tài khoản
            </button>

            <p className="text-center mt-4">
              Đã có tài khoản?{" "}
              <Link to="/signin" className="text-blue-600">
                Đăng nhập
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
