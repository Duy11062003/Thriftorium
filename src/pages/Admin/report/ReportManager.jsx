import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import ReportService from "../../../service/ReportService";
import AccountService from "../../../service/AccountService";
import ProductService from "../../../service/ProductService";
import { toast } from "react-toastify";

const ReportManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      let response;

      if (search.trim()) {
        response = await ReportService.searchReports(
          search,
          currentPage - 1,
          pageSize
        );
      } else {
        response = await ReportService.getAllReports();
        response = {
          items: response,
          totalCount: response?.length || 0,
        };
      }

      setReports(response.items || []);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchReports();
      },
      search ? 500 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [currentPage, search]);

  // Handle report deletion
  const handleDelete = async (reportId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) return;

    try {
      await ReportService.deleteReport(reportId);
      toast.success("Đã xóa báo cáo thành công");
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Không thể xóa báo cáo");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Fetch user info when viewing report
  const handleViewReport = async (report) => {
    setSelectedReport(report);
    setShowViewModal(true);

    try {
      const [userInfoData, productInfoData] = await Promise.all([
        AccountService.getAccountById(report.accountID),
        ProductService.getProductDetails(report.productID),
      ]);
      setUserInfo(userInfoData);
      setProductInfo(productInfoData);
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast.error("Không thể tải thông tin chi tiết");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Quản lý báo cáo</h1>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có báo cáo nào
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.reportID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{report.reportID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{report.orderID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{report.productID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(report.createAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="text-blue-600 hover:text-blue-900 mx-2"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(report.reportID)}
                      className="text-red-600 hover:text-red-900 mx-2"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Chi tiết báo cáo #{selectedReport.reportID}
              </h2>
              <div className="space-y-4">
                {/* User Info */}
                {userInfo && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Thông tin người báo cáo:
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tên người dùng:</span>
                        <span className="ml-2">{userInfo.userName}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{userInfo.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Số điện thoại:</span>
                        <span className="ml-2">{userInfo.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Info */}
                {productInfo && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Thông tin sản phẩm:
                    </h3>
                    <div className="flex gap-4">
                      {productInfo.imageProducts?.[0]?.image && (
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={productInfo.imageProducts[0].image}
                            alt={productInfo.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div>
                          <span className="font-medium">Tên sản phẩm:</span>
                          <span className="ml-2">{productInfo.name}</span>
                        </div>
                        <div>
                          <span className="font-medium">Mã sản phẩm:</span>
                          <span className="ml-2">#{productInfo.productID}</span>
                        </div>
                        <div>
                          <span className="font-medium">Danh mục:</span>
                          <span className="ml-2">
                            {productInfo.category?.name || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Giá:</span>
                          <span className="ml-2">
                            {productInfo.price?.toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report Content */}
                <div>
                  <h3 className="font-medium text-gray-700">
                    Nội dung báo cáo:
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {selectedReport.reportText}
                  </p>
                </div>

                {/* Report Image */}
                {selectedReport.imageUrl && (
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Hình ảnh báo cáo:
                    </h3>
                    <img
                      src={selectedReport.imageUrl}
                      alt="Report"
                      className="mt-2 max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setUserInfo(null);
                      setProductInfo(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManager;
