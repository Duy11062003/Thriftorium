import React, { useState, useEffect } from "react";

const PayOSPremiumQR = () => {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
      // Auto redirect after 3 seconds when timer expires
      setTimeout(() => {
        window.history.back();
      }, 3000);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCancel = () => {
    window.history.back();
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-600";
    if (timeLeft <= 180) return "text-orange-600";
    return "text-green-600";
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            Payment Session Expired
          </h3>
          <p className="text-gray-600 mb-4">
            Your payment session has timed out. You will be redirected back to
            the payment selection page.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header với Logo */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Thirtorium</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bên trái - QR Code PayOS */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
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
                Dùng app PayOS hoặc app ngân hàng hỗ trợ QR để quét và hoàn tất
                thanh toán
              </p>
            </div>

            {/* QR Code Section */}
            <div className="text-center mb-8">
              {/* QR Code Container */}
              <div className="inline-block p-6 bg-white border-4 border-gray-100 rounded-3xl mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-56 h-56 bg-white relative">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Corner squares */}
                    <rect
                      x="10"
                      y="10"
                      width="50"
                      height="50"
                      fill="black"
                      rx="5"
                    />
                    <rect
                      x="18"
                      y="18"
                      width="34"
                      height="34"
                      fill="white"
                      rx="3"
                    />
                    <rect
                      x="26"
                      y="26"
                      width="18"
                      height="18"
                      fill="black"
                      rx="2"
                    />

                    <rect
                      x="140"
                      y="10"
                      width="50"
                      height="50"
                      fill="black"
                      rx="5"
                    />
                    <rect
                      x="148"
                      y="18"
                      width="34"
                      height="34"
                      fill="white"
                      rx="3"
                    />
                    <rect
                      x="156"
                      y="26"
                      width="18"
                      height="18"
                      fill="black"
                      rx="2"
                    />

                    <rect
                      x="10"
                      y="140"
                      width="50"
                      height="50"
                      fill="black"
                      rx="5"
                    />
                    <rect
                      x="18"
                      y="148"
                      width="34"
                      height="34"
                      fill="white"
                      rx="3"
                    />
                    <rect
                      x="26"
                      y="156"
                      width="18"
                      height="18"
                      fill="black"
                      rx="2"
                    />

                    {/* Timing patterns */}
                    {Array.from({ length: 13 }, (_, i) => (
                      <rect
                        key={`h${i}`}
                        x={70 + i * 6}
                        y="36"
                        width="4"
                        height="4"
                        fill={i % 2 === 0 ? "black" : "white"}
                      />
                    ))}
                    {Array.from({ length: 13 }, (_, i) => (
                      <rect
                        key={`v${i}`}
                        x="36"
                        y={70 + i * 6}
                        width="4"
                        height="4"
                        fill={i % 2 === 0 ? "black" : "white"}
                      />
                    ))}

                    {/* Data modules - more realistic pattern */}
                    {Array.from({ length: 400 }, (_, i) => {
                      const x = 70 + (i % 20) * 6;
                      const y = 70 + Math.floor(i / 20) * 6;
                      const show = Math.random() > 0.5;
                      if (x >= 85 && x <= 115 && y >= 85 && y <= 115)
                        return null; // Skip center area for logo
                      return show ? (
                        <rect
                          key={i}
                          x={x}
                          y={y}
                          width="4"
                          height="4"
                          fill="black"
                          rx="1"
                        />
                      ) : null;
                    })}

                    {/* VNPay logo area */}
                    <rect
                      x="85"
                      y="85"
                      width="30"
                      height="30"
                      fill="#E31837"
                      rx="8"
                    />
                    <text
                      x="100"
                      y="105"
                      textAnchor="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      V
                    </text>
                  </svg>
                </div>
              </div>

              {/* VNPay QR Branding */}
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <span className="font-bold text-sm">VNPAY QR</span>
                </div>
                <div className="text-blue-600 font-semibold">
                  <span className="text-sm">Scan to Pay</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                How to pay:
              </h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>Open your VNPay app or any banking app</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span>Select "Scan QR Code" or "Pay by QR"</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>Scan the QR code above</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    4
                  </span>
                  <span>Confirm payment details and complete</span>
                </li>
              </ol>
            </div>

            {/* Timer Display */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-5 h-5 mr-2 text-gray-600"
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
                  Time remaining
                </span>
              </div>
              <div className={`text-3xl font-bold ${getTimerColor()} mb-1`}>
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
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

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              Cancel Transaction
            </button>
          </div>

          {/* Right Side - Subscription Plans */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Choose your subscription plan
            </h3>

            <div className="space-y-4">
              {/* Basic Plan */}
              <div
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300"
                onClick={() => setSelectedPlan("basic")}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Basic Plan</h4>
                    <p className="text-sm text-gray-600">
                      Basic subscription plan for a shop
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Plan - Selected */}
              <div
                className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer"
                onClick={() => setSelectedPlan("premium")}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500 mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Premium subscription
                    </h4>
                    <p className="text-sm text-gray-600">
                      Premium plan with more exclusive features
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  $XX / Month
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>
                    Guaranteed to be safe & secure, ensuring that all
                    transactions are protected with the highest level of
                    security.
                  </span>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span>Personalise your shop with your own info</span>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <span>
                    Provide quality support in order & shipping management
                  </span>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                  <span>This plan has trial period for 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PayOSPremiumQR;
