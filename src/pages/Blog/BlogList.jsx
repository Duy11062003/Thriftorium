import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaUser, FaEye, FaFilter } from "react-icons/fa";
import BlogService from "../../service/BlogService";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { toast } from "react-toastify";

const BlogList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [pageSize] = useState(9); // 9 blogs per page
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");

  // Input states
  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, sortBy, statusFilter]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (statusFilter !== "all") params.set("status", statusFilter);
    
    setSearchParams(params);
  }, [searchTerm, currentPage, sortBy, statusFilter, setSearchParams]);

  const fetchBlogs = async () => {
    setLoading(true);
    
    try {
      let data = [];
      
      if (searchTerm.trim()) {
        // Use search API with server-side pagination
        const searchResult = await BlogService.getBlogSearch(searchTerm, currentPage, pageSize);
        
        if (searchResult) {
          data = searchResult.items || searchResult.data || searchResult;
          setTotalPages(searchResult.totalPages || Math.ceil((searchResult.total || data.length) / pageSize));
          setTotalBlogs(searchResult.total || data.length);
        }
      } else {
        // Use getAllBlogs and handle client-side pagination/filtering
        const allBlogs = await BlogService.getAllBlogs();
        
        if (allBlogs && allBlogs.length > 0) {
          let filteredBlogs = [...allBlogs];
          
          // Apply status filter
          if (statusFilter !== "all") {
            const isActive = statusFilter === "active";
            filteredBlogs = filteredBlogs.filter(blog => blog.status === isActive);
          }
          
          // Apply sorting
          filteredBlogs.sort((a, b) => {
            switch (sortBy) {
              case "oldest":
                return new Date(a.createAt) - new Date(b.createAt);
              case "title":
                return a.title.localeCompare(b.title);
              case "author":
                return a.author.localeCompare(b.author);
              case "newest":
              default:
                return new Date(b.createAt) - new Date(a.createAt);
            }
          });
          
          // Client-side pagination
          const startIndex = (currentPage - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          data = filteredBlogs.slice(startIndex, endIndex);
          
          setTotalBlogs(filteredBlogs.length);
          setTotalPages(Math.ceil(filteredBlogs.length / pageSize));
        }
      }
      
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách blog");
      setBlogs([]);
      setTotalPages(1);
      setTotalBlogs(0);
    }
    
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return "Nội dung blog...";
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  const handleBlogClick = (blogID) => {
    navigate(`/blog/${blogID}`);
  };

  // Pagination component
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
          onClick={() => handlePageChange(currentPage - 1)}
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
          onClick={() => handlePageChange(i)}
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
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-50 transition"
        >
          ›
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-1">
        {pages}
      </div>
    );
  };

  return (
    <div className="max-w-container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Breadcrumbs title="Tất cả bài viết" prevLocation="Blog" />

      {/* Header */}
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả bài viết</h1>
        <p className="text-gray-600">
          Khám phá tất cả các bài viết về thế giới tái sử dụng và bảo vệ môi trường
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Search bar */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="title">Theo tiêu đề</option>
              <option value="author">Theo tác giả</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div> */}
        </div>

        {/* Search results info */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-600">
            {searchTerm ? (
              <span>
                Tìm thấy <strong>{totalBlogs}</strong> kết quả cho "{searchTerm}"
              </span>
            ) : (
              <span>
                Hiển thị <strong>{totalBlogs}</strong> bài viết
                {statusFilter !== "all" && (
                  <span> - Trạng thái: <strong>
                    {statusFilter === "active" ? "Đang hoạt động" : "Không hoạt động"}
                  </strong></span>
                )}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách blog...</p>
          </div>
        </div>
      )}

      {/* Blog grid */}
      {!loading && (
        <>
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <article
                    key={blog.blogID}
                    onClick={() => handleBlogClick(blog.blogID)}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                  >
                    {/* Blog image */}
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      {blog.imageBlogs && blog.imageBlogs.length > 0 ? (
                        <img
                          src={blog.imageBlogs[0].image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.src = "/assets/images/thriftorium-logo.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Blog content */}
                    <div className="p-6">
                      {/* Status badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            blog.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {blog.status ? "Hoạt động" : "Không hoạt động"}
                        </span>
                        
                        {blog.imageBlogs && blog.imageBlogs.length > 1 && (
                          <span className="text-xs text-gray-500">
                            +{blog.imageBlogs.length - 1} ảnh
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                        {blog.title}
                      </h3>

                      {/* Content preview */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {truncateContent(blog.content)}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <FaUser className="mr-1" />
                            {blog.author}
                          </span>
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {formatDate(blog.createAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-blue-600 group-hover:text-blue-800">
                          <FaEye className="mr-1" />
                          <span>Xem chi tiết</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}

              {/* Pagination info */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Trang {currentPage} / {totalPages} - Tổng {totalBlogs} bài viết
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy kết quả" : "Chưa có bài viết nào"}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `Không có bài viết nào phù hợp với "${searchTerm}"`
                  : "Hiện tại chưa có bài viết blog nào được đăng tải."}
              </p>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Quick navigation */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
        >
          ← Quay lại trang Blog chính
        </button>
      </div>
    </div>
  );
};

export default BlogList; 