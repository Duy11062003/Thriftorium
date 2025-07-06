// src/pages/payment/PaymentSuccess.js
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-4">
        <div className="mb-6">
          <svg
            className="mx-auto w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Thanh toán thành công!
        </h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã hoàn tất thanh toán. Đơn hàng đã được ghi nhận.
        </p>
        <Link to="/profile/my-order">
          <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Xem đơn hàng
          </button>
        </Link>
      </div>
    </div>
  );
}
