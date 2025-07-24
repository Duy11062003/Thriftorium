// src/pages/payment/PayOSBasicQR.js
import React, { useState, useEffect } from "react";

// Chúng ta sẽ tách riêng phần QR vào 1 component để dễ dùng lại
export default function PayOSBasicQR({ onDone }) {
  const [timeLeft, setTimeLeft] = useState(600);
  const [isExpired, setIsExpired] = useState(false);

  // Đếm ngược 10 phút
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
      // hết thời gian → tự động gọi back sau 3s
      setTimeout(() => {
        onDone && onDone("expired");
      }, 3000);
    }
  }, [timeLeft, onDone]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-600";
    if (timeLeft <= 180) return "text-orange-600";
    return "text-green-600";
  };

  // Nếu đã hết hạn
  if (isExpired) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Phiên thanh toán đã hết hạn
          </h3>
          <p className="text-gray-600 mb-4">
            Bạn sẽ được chuyển về trang trước để thử lại.
          </p>
          <button
            onClick={() => onDone && onDone("expired")}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Quay lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-green-700 font-medium text-sm">
            Đang chờ thanh toán
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quét QR Code để thanh toán
        </h2>
        <p className="text-gray-600">
          Dùng app PayOS hoặc app ngân hàng hỗ trợ QR để quét mã.
        </p>
      </div>

      {/* QR Code SVG (bạn giữ nguyên đoạn SVG từ code trước) */}
      <div className="text-center mb-6">
        <div className="inline-block p-4 bg-white border-4 border-gray-100 rounded-3xl mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-48 h-48 bg-white relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Chèn lại đoạn mã SVG sinh QR như trước */}
              {/* Ví dụ: */}
              <rect x="10" y="10" width="50" height="50" fill="black" rx="5" />
              <rect x="18" y="18" width="34" height="34" fill="white" rx="3" />
              <rect x="26" y="26" width="18" height="18" fill="black" rx="2" />
              {/* (Một phần mã QR ví dụ ngẫu nhiên, bạn có thể copy y nguyên đoạn đầy đủ) */}
            </svg>
          </div>
        </div>

        {/* Logo PayOS QR */}
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" r="8" />
            </svg>
            <span className="font-bold text-sm">PayOS QR</span>
          </div>
          <span className="text-green-600 font-semibold text-sm">
            Scan to Pay
          </span>
        </div>
      </div>

      {/* Hướng dẫn ngắn */}
      <div className="bg-green-50 rounded-xl p-4 mb-6 text-sm text-gray-700">
        <ol className="list-decimal list-inside space-y-2">
          <li>Mở app PayOS hoặc app ngân hàng hỗ trợ QR</li>
          <li>Chọn “Quét QR Code”</li>
          <li>Quét mã trên màn hình</li>
          <li>Xác nhận thông tin thanh toán</li>
        </ol>
      </div>

      {/* Đồng hồ đếm ngược */}
      <div className="bg-gray-100 rounded-xl p-3 mb-4 text-center">
        <div className="flex items-center justify-center mb-1">
          <svg
            className="w-4 h-4 mr-1 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-600">
            Thời gian còn:
          </span>
        </div>
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="w-full bg-gray-300 rounded-full h-1 mt-2">
          <div
            className={`h-1 rounded-full ${
              timeLeft <= 60
                ? "bg-red-500"
                : timeLeft <= 180
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
            style={{ width: `${(timeLeft / 600) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Nút “Xác nhận đã thanh toán” */}
      <button
        onClick={() => onDone && onDone("paid")}
        className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Xác nhận đã thanh toán
      </button>
    </div>
  );
}
