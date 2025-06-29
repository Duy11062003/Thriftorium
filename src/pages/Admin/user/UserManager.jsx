import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaEdit, 
  FaEye, 
  FaUserCheck, 
  FaUserTimes, 
  FaFilter,
  FaUserPlus 
} from "react-icons/fa";
import AccountService from "../../../service/AccountService";
import UserModal from "./components/UserModal";
import { toast } from "react-toastify";

const UserManager = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("userID");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // "view", "edit", "create"
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, statusFilter, roleFilter, sortField, sortDirection]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AccountService.getAllAccount();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách người dùng");
      setUsers([]);
    }
    setLoading(false);
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.userID?.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(user => user.status === isActive);
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (typeof aValue === "string") {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusUpdate = async (userEmail, newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${newStatus ? "kích hoạt" : "vô hiệu hóa"} tài khoản này?`)) {
      return;
    }

    try {
      await AccountService.updateAccountStatus(userEmail, { status: newStatus });
      toast.success(`${newStatus ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công!`);
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái tài khoản");
    }
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setModalMode("view");
  };

  const handleModalSuccess = () => {
    fetchUsers();
    closeModal();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      "Admin": { bg: "bg-red-100", text: "text-red-800", label: "Quản trị viên" },
      "Customer": { bg: "bg-blue-100", text: "text-blue-800", label: "Khách hàng" },
      "Staff": { bg: "bg-green-100", text: "text-green-800", label: "Nhân viên" },
      "Manager": { bg: "bg-yellow-100", text: "text-yellow-800", label: "Quản lý" }
    };

    const config = roleConfig[role] || { bg: "bg-gray-100", text: "text-gray-800", label: role };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50 transition"
        >
          ‹
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 border-t border-b border-gray-300 transition ${
            i === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-50 transition"
        >
          ›
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        {pages}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
        <p className="text-gray-600">Quản lý tài khoản người dùng trong hệ thống</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Vô hiệu hóa</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Admin">Quản trị viên</option>
            <option value="Manager">Quản lý</option>
            <option value="Customer">Khách hàng</option>
            <option value="Staff">Nhân viên</option>
          </select>

          {/* Create User Button */}
          <button
            onClick={() => openModal("create")}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaUserPlus className="mr-2" />
            Thêm người dùng
          </button>
        </div>

        {/* Results info */}
        <div className="mt-4 text-sm text-gray-600">
          Hiển thị {currentUsers.length} / {filteredUsers.length} người dùng
          {searchTerm && (
            <span> - Tìm kiếm: "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
            </div>
          </div>
        ) : currentUsers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("userID")}
                    >
                      ID {sortField === "userID" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      Tên {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("email")}
                    >
                      Email {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("role")}
                    >
                      Vai trò {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      Trạng thái {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createDate")}
                    >
                      Ngày tạo {sortField === "createDate" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user.userID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{user.userID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.roles[0])}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.status ? "Hoạt động" : "Vô hiệu hóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.createDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal("view", user)}
                            className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openModal("edit", user)}
                            className="text-yellow-600 hover:bg-yellow-50 p-1 rounded transition"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(user.email, !user.status)}
                            className={`p-1 rounded transition ${
                              user.status 
                                ? "text-red-600 hover:bg-red-50" 
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={user.status ? "Vô hiệu hóa" : "Kích hoạt"}
                          >
                            {user.status ? <FaUserTimes /> : <FaUserCheck />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {renderPagination()}
            
            {/* Pagination info */}
            <div className="px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-600">
              Trang {currentPage} / {totalPages} - Tổng {filteredUsers.length} người dùng
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                ? "Không tìm thấy người dùng phù hợp" 
                : "Chưa có người dùng nào"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                ? "Thử thay đổi bộ lọc để xem thêm kết quả"
                : "Hệ thống chưa có người dùng nào được đăng ký"}
            </p>
            {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setRoleFilter("all");
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaFilter className="mr-2" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Modal */}
      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={closeModal}
          mode={modalMode}
          user={selectedUser}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default UserManager; 