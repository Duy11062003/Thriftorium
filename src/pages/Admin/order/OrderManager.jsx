import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import OrderService from "../../../service/OrderService";
import { toast } from "react-toastify";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Order status mapping
  const getStatusText = (status) => {
    const statusMap = {
      0: "Chờ thanh toán",
      1: "Chờ xác nhận",
      2: "Chờ giao hàng",
      3: "Đang giao hàng",
      4: "Hoàn thành",
      5: "Đã hủy",
      6: "Hoàn trả",
      7: "Yêu cầu trả hàng",
    };
    return statusMap[status] || "Không xác định";
  };

  const getStatusBadgeClass = (status) => {
    const badgeMap = {
      0: "bg-orange-100 text-orange-800",
      1: "bg-yellow-100 text-yellow-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-purple-100 text-purple-800",
      4: "bg-green-100 text-green-800",
      5: "bg-red-100 text-red-800",
      6: "bg-indigo-100 text-indigo-800",
      7: "bg-pink-100 text-pink-800",
    };
    return badgeMap[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodText = (method) => {
    const methodMap = {
      0: "Tiền mặt",
      1: "PayOS",
      2: "Momo",
    };
    return methodMap[method] || "Không xác định";
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const searchParams = {};

      if (searchTerm) searchParams.search = searchTerm;
      if (statusFilter !== "") searchParams.status = parseInt(statusFilter);
      if (dateFilter) searchParams.date = dateFilter;

      const response = await OrderService.getAllOrders(searchParams);
      setOrders(response || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchOrders();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
    setTimeout(() => fetchOrders(), 100);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm("Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?"))
      return;

    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      toast.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  // Handle view order details
  const handleViewOrder = async (orderId) => {
    try {
      const response = await OrderService.getOrderById(orderId);
      setSelectedOrder(response);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600">
          Quản lý và theo dõi tất cả đơn hàng trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo ID đơn hàng, tên khách hàng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="0">Chờ thanh toán</option>
              <option value="1">Chờ xác nhận</option>
              <option value="2">Chờ giao hàng</option>
              <option value="3">Đang giao hàng</option>
              <option value="4">Hoàn thành</option>
              <option value="5">Đã hủy</option>
              <option value="6">Hoàn trả</option>
              <option value="7">Yêu cầu trả hàng</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đặt hàng
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSearch /> Tìm kiếm
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <FaFilter /> Xóa bộ lọc
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <FaDownload /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderID}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.shippingInfo?.receiverName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingInfo?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total?.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPaymentMethodText(order.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewOrder(order.orderID)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              order.orderID,
                              parseInt(e.target.value)
                            )
                          }
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          title="Cập nhật trạng thái"
                        >
                          <option value={0}>Chờ thanh toán</option>
                          <option value={1}>Chờ xác nhận</option>
                          <option value={2}>Chờ giao hàng</option>
                          <option value={3}>Đang giao hàng</option>
                          <option value={4}>Hoàn thành</option>
                          <option value={5}>Đã hủy</option>
                          <option value={6}>Hoàn trả</option>
                          <option value={7}>Yêu cầu trả hàng</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy đơn hàng nào
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.orderID}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Thông tin đơn hàng
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <strong>Ngày đặt:</strong>{" "}
                      {new Date(selectedOrder.orderDate).toLocaleString(
                        "vi-VN"
                      )}
                    </div>
                    <div>
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div>
                      <strong>Thanh toán:</strong>{" "}
                      {getPaymentMethodText(selectedOrder.paymentMethod)}
                    </div>
                    <div>
                      <strong>Tổng tiền:</strong>{" "}
                      {selectedOrder.total?.toLocaleString()} VND
                    </div>
                  </div>
                </div>

                {selectedOrder.shippingInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thông tin giao hàng
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <strong>Người nhận:</strong>{" "}
                        {selectedOrder.shippingInfo.receiverName}
                      </div>
                      <div>
                        <strong>SĐT:</strong> {selectedOrder.shippingInfo.phone}
                      </div>
                      <div>
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.shippingInfo.detailAddress}
                      </div>
                      <div>
                        <strong>Phường/Xã:</strong>{" "}
                        {selectedOrder.shippingInfo.ward}
                      </div>
                      <div>
                        <strong>Quận/Huyện:</strong>{" "}
                        {selectedOrder.shippingInfo.district}
                      </div>
                      <div>
                        <strong>Tỉnh/TP:</strong>{" "}
                        {selectedOrder.shippingInfo.province}
                      </div>
                      <div>
                        <strong>Phí ship:</strong>{" "}
                        {selectedOrder.shippingInfo.shippingCost?.toLocaleString()}{" "}
                        VND
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              {selectedOrder.orderDetails &&
                selectedOrder.orderDetails.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Chi tiết sản phẩm
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Sản phẩm
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Số lượng
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Đơn giá
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.orderDetails.map((detail, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">
                                <div className="flex items-center">
                                  <img
                                    src={
                                      detail.product?.imageProducts?.[0]
                                        ?.image || "/placeholder.png"
                                    }
                                    alt={detail.product?.name}
                                    className="w-10 h-10 rounded object-cover mr-3"
                                  />
                                  <div className="text-sm font-medium text-gray-900">
                                    {detail.product?.name || "Unknown Product"}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {detail.quantity}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {detail.purchasePrice?.toLocaleString()} VND
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {detail.totalAmount?.toLocaleString()} VND
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Modal Actions */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
