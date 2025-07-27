import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage } from "react-icons/fa";
import BlogService from "../../../service/BlogService";
import BlogModal from "./components/BlogModal";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const BlogManager = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Luôn dùng getAllBlogs vì không có search
      const data = await BlogService.getAllBlogs();
      setBlogs(data || []);
      
      // Tính pagination manually cho getAllBlogs
      const totalItems = data?.length || 0;
      const totalPagesCalculated = Math.ceil(totalItems / pageSize);
      setTotalPages(totalPagesCalculated);
      
      // Apply pagination manually
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedBlogs = (data || []).slice(startIndex, endIndex);
      setBlogs(paginatedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách blog");
      setBlogs([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewBlog = (blog) => {
    setEditingBlog(blog);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDeleteBlog = async (blogID) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa blog này?")) return;

    try {
      await BlogService.deleteBlog(blogID);
      toast.success("Xóa blog thành công!");
      fetchBlogs(); // Refresh list
    } catch (error) {
      console.error("Error deleting blog:", error);
      if (error.response?.status === 401) {
        toast.error("Bạn không có quyền xóa blog này!");
      } else {
        toast.error("Có lỗi xảy ra khi xóa blog");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setModalMode("create");
  };

  const handleModalSave = () => {
    fetchBlogs(); // Refresh list after save
    handleModalClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Blog
          </h1>
          <p className="text-gray-600">
            Quản lý danh sách blog và bài viết
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex justify-end">
          {/* Create Button */}
          <button
            onClick={handleCreateBlog}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus />
            Tạo blog mới
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nội dung
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tác giả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hình ảnh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.length > 0 ? (
                      blogs.map((blog) => (
                        <tr key={blog.blogID} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {blog.blogID}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-xs">
                              {truncateText(blog.title, 50)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-sm">
                              {truncateText(blog.content, 80)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {blog.author || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FaImage className="text-gray-400 mr-1" />
                              <span className="text-xs">
                                {blog.imageBlogs?.length || 0} ảnh
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(blog.createAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                blog.status
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {blog.status ? "Hoạt động" : "Không hoạt động"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewBlog(blog)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded transition"
                                title="Xem chi tiết"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition"
                                title="Chỉnh sửa"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.blogID)}
                                className="text-red-600 hover:text-red-900 p-1 rounded transition"
                                title="Xóa"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">📝</div>
                            <div>Không có blog nào</div>
                            <div className="text-sm mt-1">
                              Hãy tạo blog đầu tiên của bạn
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Trang {currentPage} của {totalPages}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPages, currentPage + 2)
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm border rounded ${
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Blog Modal */}
      {isModalOpen && (
        <BlogModal
          mode={modalMode}
          blog={editingBlog}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default BlogManager;