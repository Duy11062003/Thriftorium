// src/pages/Profile/MyOrder.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaReceipt,
  FaTicketAlt,
  FaKey,
  FaSignOutAlt,
  FaFlag,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import OrderService from "../../service/OrderService";
import ReportService from "../../service/ReportService";
import { toast } from "react-toastify";

const importAsset = (file) => {
  try {
    return require(`../../assets/images/${file}`);
  } catch {
    return "";
  }
};

const importProductImg = (file) => {
  try {
    return require(`../../assets/images/products/bestSeller/${file}`);
  } catch {
    return "";
  }
};

export default function MyOrder() {
  const { logout, user } = useAuth();

  const tabs = [
    "All",
    "Chờ thanh toán",
    "Chờ xác nhận",
    "Chờ giao hàng",
    "Đang giao hàng",
    "Hoàn thành",
    "Đã hủy",
    "Hoàn trả",
    "Yêu cầu trả hàng",
  ];
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportOrderId, setReportOrderId] = useState(null);
  const [reportProductId, setReportProductId] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reportImage, setReportImage] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);

  // Map status from API to UI
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ thanh toán"; // ToPay
      case 1:
        return "Chờ xác nhận"; // ToConfirm
      case 2:
        return "Chờ giao hàng"; // ToShip
      case 3:
        return "Đang giao hàng"; // ToReceive
      case 4:
        return "Hoàn thành"; // Completed
      case 5:
        return "Đã hủy"; // Cancelled
      case 6:
        return "Hoàn trả"; // ReturnRefund
      case 7:
        return "Yêu cầu trả hàng"; // RequestReturn
      default:
        return "Không xác định";
    }
  };

  // Map payment method from API to UI
  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case 0:
        return "Tiền mặt";
      case 1:
        return "VNPay";
      case 2:
        return "Momo";
      default:
        return "Không xác định";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 0:
        return "bg-orange-100 text-orange-800"; // Chờ thanh toán
      case 1:
        return "bg-yellow-100 text-yellow-800"; // Chờ xác nhận
      case 2:
        return "bg-blue-100 text-blue-800"; // Chờ giao hàng
      case 3:
        return "bg-purple-100 text-purple-800"; // Đang giao hàng
      case 4:
        return "bg-green-100 text-green-800"; // Hoàn thành
      case 5:
        return "bg-red-100 text-red-800"; // Đã hủy
      case 6:
        return "bg-indigo-100 text-indigo-800"; // Hoàn trả
      case 7:
        return "bg-pink-100 text-pink-800"; // Yêu cầu trả hàng
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.userID) {
        setLoading(false);
        return;
      }

      try {
        const response = await OrderService.getOrdersByAccountId(user.userID);
        setOrders(response || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải danh sách đơn hàng");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userID]);

  // Handle order actions
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      await OrderService.cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công");

      // Refresh orders
      const response = await OrderService.getOrdersByAccountId(user.userID);
      setOrders(response || []);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng");
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      await OrderService.completeOrder(orderId, 4); // Status 4 = Completed
      toast.success("Đã xác nhận nhận hàng thành công");

      // Refresh orders
      const response = await OrderService.getOrdersByAccountId(user.userID);
      setOrders(response || []);
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Không thể xác nhận nhận hàng");
    }
  };

  // Handle request return
  const handleRequestReturn = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn yêu cầu trả hàng?")) return;

    try {
      await OrderService.updateOrderStatus(orderId, 7); // Status 7 = RequestReturn
      toast.success("Đã gửi yêu cầu trả hàng");

      // Refresh orders
      const response = await OrderService.getOrdersByAccountId(user.userID);
      setOrders(response || []);
    } catch (error) {
      console.error("Error requesting return:", error);
      toast.error("Không thể gửi yêu cầu trả hàng");
    }
  };

  // Handle report functions
  const openReportModal = (orderId, productId) => {
    setReportOrderId(orderId);
    setReportProductId(productId);
    setShowReportModal(true);
    setReportText("");
    setReportImage(null);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportOrderId(null);
    setReportProductId(null);
    setReportText("");
    setReportImage(null);
  };

  const handleReportImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      setReportImage(file);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportText.trim()) {
      toast.error("Vui lòng nhập nội dung báo cáo");
      return;
    }

    if (!reportProductId) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    setSubmittingReport(true);
    try {
      const formData = new FormData();
      formData.append("ReportText", reportText.trim());
      formData.append("ResponseText", reportText.trim());
      formData.append("OrderID", reportOrderId);
      formData.append("ProductID", reportProductId);
      formData.append("AccountID", user.userID);

      if (reportImage) {
        formData.append("ImageFile", reportImage);
      }

      await ReportService.createReport(formData);
      toast.success("Đã gửi báo cáo thành công");
      closeReportModal();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    } finally {
      setSubmittingReport(false);
    }
  };

  // Filter orders based on active tab
  const filtered =
    activeTab === "All"
      ? orders
      : orders?.filter((order) => getStatusText(order.status) === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-container mx-auto px-4">
        {/* Title */}
        <h1 className="text-4xl font-bold">My Order</h1>
        <p className="text-sm text-gray-600 mt-1 mb-8">/profile/my order</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 space-y-8">
            <div className="flex items-center space-x-4">
              <img
                src={importAsset("orebiLogo.png")}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="font-semibold">
                {user?.fullName || user?.userName || "Người dùng"}
              </div>
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/profile/account-information"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaUser className="mr-3" /> Account Information
              </NavLink>
              <NavLink
                to="/profile/my-order"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaReceipt className="mr-3" /> My Order
              </NavLink>
              <NavLink
                to="/profile/voucher"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaTicketAlt className="mr-3" /> Voucher
              </NavLink>
              <NavLink
                to="/profile/change-password"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaKey className="mr-3" /> Change Password
              </NavLink>
              <button
                onClick={() => logout()}
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt className="mr-3" /> Log Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6 border border-gray-200">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((t) => {
                  const count =
                    t === "All"
                      ? orders?.length
                      : orders?.filter(
                          (order) => getStatusText(order.status) === t
                        ).length;

                  return (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex-shrink-0 ${
                        activeTab === t
                          ? "bg-green-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t} {!loading && `(${count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Đang tải đơn hàng...</p>
              </div>
            )}

            {/* Orders */}
            {!loading &&
              filtered.map((order) => (
                <div
                  key={order.orderID}
                  className="mb-6 border border-gray-300 rounded-lg p-4"
                >
                  {/* Order header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg">
                        #{order.orderID}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {/* Order items */}
                  {order.orderDetails && order.orderDetails.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {order.orderDetails.map((detail, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img
                            src={
                              detail.product?.imageProducts?.[0]?.image ||
                              importProductImg("bestSellerOne.webp")
                            }
                            alt={detail.product?.name || "Product"}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.src =
                                importProductImg("bestSellerOne.webp");
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-lg">
                              {detail.product?.name || "Unknown Product"}
                            </div>
                            <div className="text-sm text-gray-600">
                              Số lượng: {detail.quantity} x{" "}
                              {detail.unitPrice?.toLocaleString()} VND
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              Thành tiền: {detail.totalAmount?.toLocaleString()}{" "}
                              VND
                            </div>
                            <button
                              onClick={() => openReportModal(order.orderID, detail.product?.productID)}
                              className="mt-2 px-3 py-1 text-xs border border-red-500 text-red-500 bg-white hover:bg-red-50 rounded flex items-center gap-1"
                            >
                              <FaFlag size={10} />
                              Báo cáo sản phẩm
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order details info */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Payment info */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Thông tin thanh toán:
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>
                            <strong>Phương thức:</strong>{" "}
                            {getPaymentMethodText(order.paymentMethod)}
                          </div>
                        </div>
                      </div>

                      {/* Shipping info */}
                      {order.shippingInfo && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Thông tin giao hàng:
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>
                              <strong>Người nhận:</strong>{" "}
                              {order.shippingInfo.receiverName}
                            </div>
                            <div>
                              <strong>SĐT:</strong> {order.shippingInfo.phone}
                            </div>
                            <div>
                              <strong>Địa chỉ:</strong>{" "}
                              {order.shippingInfo.detailAddress},{" "}
                              {order.shippingInfo.ward},{" "}
                              {order.shippingInfo.district},{" "}
                              {order.shippingInfo.province}
                            </div>
                            <div>
                              <strong>Phí vận chuyển:</strong>{" "}
                              {order.shippingInfo.shippingCost?.toLocaleString()}{" "}
                              VND
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total & actions */}
                  <div className="flex justify-between items-center mt-6">
                    {/* Total on left */}
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Tổng thanh toán:</span>{" "}
                      {order.total?.toLocaleString()} VND
                    </div>
                    {/* Buttons on right */}
                    <div className="flex gap-2">
                      {/* Chờ thanh toán */}
                      {order.status === 0 && (
                        <button
                          onClick={() => handleCancelOrder(order.orderID)}
                          className="px-4 py-2 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-50 rounded"
                        >
                          Hủy đơn hàng
                        </button>
                      )}

                      {/* Chờ xác nhận */}
                      {order.status === 1 && (
                        <button
                          onClick={() => handleCancelOrder(order.orderID)}
                          className="px-4 py-2 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-50 rounded"
                        >
                          Hủy đơn hàng
                        </button>
                      )}

                      {/* Đang giao hàng */}
                      {order.status === 3 && (
                        <button
                          onClick={() => handleConfirmDelivery(order.orderID)}
                          className="px-4 py-2 text-sm border border-green-500 text-green-500 bg-white hover:bg-green-50 rounded"
                        >
                          Xác nhận đã nhận
                        </button>
                      )}

                      {/* Hoàn thành */}
                      {order.status === 4 && (
                        <button
                          onClick={() => handleRequestReturn(order.orderID)}
                          className="px-4 py-2 text-sm border border-orange-500 text-orange-500 bg-white hover:bg-orange-50 rounded"
                        >
                          Yêu cầu trả hàng
                        </button>
                      )}

                      {/* Hoàn trả */}
                      {order.status === 6 && null}

                      <button className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {!loading && filtered.length === 0 && (
              <p className="text-center text-gray-500">
                Không tìm thấy đơn hàng nào.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Báo cáo sản phẩm trong đơn hàng #{reportOrderId}
              </h3>
              <button
                onClick={closeReportModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Report Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung báo cáo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Mô tả vấn đề bạn gặp phải với đơn hàng này..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                  disabled={submittingReport}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh minh chứng (tùy chọn)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReportImageChange}
                    className="hidden"
                    id="report-image-upload"
                    disabled={submittingReport}
                  />
                  <label
                    htmlFor="report-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaUpload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-600">
                      {reportImage ? reportImage.name : "Chọn ảnh để tải lên"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      JPG, PNG, GIF (tối đa 5MB)
                    </span>
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Báo cáo của bạn sẽ được xem xét và
                  phản hồi trong vòng 24-48 giờ.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeReportModal}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
                disabled={submittingReport}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={submittingReport || !reportText.trim()}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submittingReport ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
