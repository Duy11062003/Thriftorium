// src/pages/payment/Payment.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VNPayBasicQR from "./VNPayBasicQR";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs"; // Import Breadcrumbs component

export default function Payment() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    ward: "",
    district: "",
    recipient: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleConfirm = () => {
    setStep("qr");
  };

  const handleQRDone = (status) => {
    if (status === "expired") {
      setStep("form");
    } else if (status === "paid") {
      navigate("/payment/success");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl">
        {/* Breadcrumbs component */}
        <Breadcrumbs prevLocation="Payment" title="Payment gateway" />

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-4">
          {step === "form" && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Xác Nhận Thanh Toán
              </h2>

              <div className="space-y-4">
                {/* Địa chỉ chi tiết */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Địa chỉ chi tiết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ví dụ: 123/45 Đường ABC"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Tỉnh/Thành Phố */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tỉnh/Thành Phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ví dụ: TP. Hồ Chí Minh"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Mã Tỉnh */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã Tỉnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Ví dụ: 700000"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Phường/Xã */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="Ví dụ: Phường Linh Trung"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Quận/Huyện */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Ví dụ: Quận Thủ Đức"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Tên người nhận */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Hai nút Hủy / Xác Nhận */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Xác Nhận
                </button>
              </div>
            </>
          )}

          {/* Nếu đã bấm “Xác Nhận” và step = "qr", thì show phần QR */}
          {step === "qr" && (
            <div className="mt-4">
              <VNPayBasicQR onDone={handleQRDone} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
