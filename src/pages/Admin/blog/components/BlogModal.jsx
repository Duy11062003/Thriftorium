import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaEdit, FaPlus, FaTrash, FaImage } from "react-icons/fa";
import BlogService from "../../../../service/BlogService";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";

const BlogModal = ({ mode, blog, onClose, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    status: true,
    imageBlogs: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (blog && (mode === "edit" || mode === "view")) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        author: blog.author || blog.authorName || user?.name || "",
        status: blog.status !== undefined ? blog.status : true,
        imageBlogs: blog.imageBlogs || [],
      });
    } else {
      // Create mode
      setFormData({
        title: "",
        content: "",
        author: user?.name || "",
        status: true,
        imageBlogs: [],
      });
    }
  }, [blog, mode, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.length > 200) {
      newErrors.title = "Tiêu đề không được vượt quá 200 ký tự";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung là bắt buộc";
    } else if (formData.content.length > 10000) {
      newErrors.content = "Nội dung không được vượt quá 10000 ký tự";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Tên tác giả là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin form");
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        accountID: user?.userID || user?.id || "",
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        status: formData.status,
        imageBlogs: formData.imageBlogs.map(img => ({
          image: typeof img === 'string' ? img : img.image
        })),
      };

      if (mode === "create") {
        await BlogService.createBlog(blogData);
        toast.success("Tạo blog thành công!");
      } else if (mode === "edit") {
        await BlogService.updateBlog(blog.blogID, blogData);
        toast.success("Cập nhật blog thành công!");
      }

      onSave();
    } catch (error) {
      console.error("Error saving blog:", error);
      
      if (error.response?.status === 401) {
        toast.error("Bạn không có quyền thực hiện thao tác này!");
      } else if (error.response?.status === 400) {
        toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
      } else {
        toast.error(
          mode === "create" 
            ? "Có lỗi xảy ra khi tạo blog" 
            : "Có lỗi xảy ra khi cập nhật blog"
        );
      }
    }

    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        imageBlogs: [...prev.imageBlogs, { image: newImageUrl.trim() }]
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageBlogs: prev.imageBlogs.filter((_, i) => i !== index)
    }));
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Tạo blog mới";
      case "edit":
        return "Chỉnh sửa blog";
      case "view":
        return "Xem chi tiết blog";
      default:
        return "Blog";
    }
  };

  const isReadOnly = mode === "view";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {getModalTitle()}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="bg-white">
            <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isReadOnly || loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tiêu đề blog..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tác giả *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  disabled={isReadOnly || loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.author ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên tác giả..."
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600">{errors.author}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  disabled={isReadOnly || loading}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập nội dung blog..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.content.length}/10000 ký tự
                </p>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh blog
                </label>
                
                {/* Add new image */}
                {!isReadOnly && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Nhập URL hình ảnh..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      disabled={!newImageUrl.trim() || loading}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <FaPlus />
                      Thêm
                    </button>
                  </div>
                )}

                {/* Images list */}
                {formData.imageBlogs.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {formData.imageBlogs.map((img, index) => (
                      <div key={index} className="relative border border-gray-200 rounded-lg p-2">
                        <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
                          <img
                            src={typeof img === 'string' ? img : img.image}
                            alt={`Blog image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden items-center justify-center text-gray-400">
                            <FaImage className="text-2xl" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 break-all">
                          {typeof img === 'string' ? img : img.image}
                        </p>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                            disabled={loading}
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
                    <p className="text-gray-500 text-sm">Chưa có hình ảnh nào</p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.checked)}
                    disabled={isReadOnly || loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Blog đang hoạt động
                  </span>
                </label>
              </div>

              {/* Blog Info (for view/edit mode) */}
              {blog && (mode === "edit" || mode === "view") && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Thông tin blog
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">ID:</span> {blog.blogID}
                    </div>
                    <div>
                      <span className="font-medium">Account ID:</span> {blog.accountID}
                    </div>
                    <div>
                      <span className="font-medium">Ngày tạo:</span>{" "}
                      {blog.createAt
                        ? new Date(blog.createAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Cập nhật:</span>{" "}
                      {blog.updateAt
                        ? new Date(blog.updateAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isReadOnly && (
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      {mode === "create" ? <FaSave /> : <FaEdit />}
                      {mode === "create" ? "Tạo blog" : "Cập nhật"}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* View mode footer */}
            {isReadOnly && (
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Đóng
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogModal; 