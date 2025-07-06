// src/pages/payment/Payment.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import CheckoutService from "../../service/CheckoutService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    detailAddress: "",
    province: "",
    provinceCode: "",
    ward: "",
    district: "",
    receiverName: "",
    phone: "",
  });

  // Get cart data from location state
  useEffect(() => {
    if (!location.state?.cartData) {
      toast.error("Không tìm thấy thông tin giỏ hàng");
      navigate("/cart");
      return;
    }
    setOrderData(location.state.cartData);
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      // Validate shipping details
      try {
        CheckoutService.validateShippingDetails(formData);
      } catch (error) {
        toast.error(error.message);
        return;
      }

      // Create order - response is VNPay URL
      const vnpayUrl = await CheckoutService.createOrder(
        user.userID,
        orderData.totalAmount,
        orderData.selectedVoucher?.userVoucherID || -1,
        formData
      );

      if (vnpayUrl) {
        // Store order info for later use
        sessionStorage.setItem("orderData", JSON.stringify(orderData));
        sessionStorage.setItem("formData", JSON.stringify(formData));
        
        // Redirect to VNPay payment page
        window.location.href = vnpayUrl;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };



  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl">
        <Breadcrumbs title="Payment gateway" />

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-4">
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
                    name="detailAddress"
                    value={formData.detailAddress}
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
                    name="province"
                    value={formData.province}
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
                    name="provinceCode"
                    value={formData.provinceCode}
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
                    name="receiverName"
                    value={formData.receiverName}
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

                {/* Order Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span>Tổng tiền hàng:</span>
                      <span>{orderData.totalAmount.toLocaleString()} VND</span>
                    </p>
                    {orderData.selectedVoucher && (
                      <p className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{orderData.discount.toLocaleString()} VND</span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span>Tổng cộng:</span>
                      <span>{(orderData.totalAmount - (orderData.discount || 0)).toLocaleString()} VND</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{orderData.shippingCharge.toLocaleString()} VND</span>
                    </p>
                    <p className="text-xs text-gray-500 ml-4">
                      (Trong TP.HCM: 30,000 VND - Ngoài TP.HCM: 50,000 VND)
                    </p>
                    <p className="flex justify-between font-bold pt-2 border-t">
                      <span>Tổng thanh toán:</span>
                      <span>{orderData.finalTotal.toLocaleString()} VND</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Đang xử lý..." : "Xác Nhận"}
                </button>
              </div>
        </div>
      </div>
    </div>
  );
}
