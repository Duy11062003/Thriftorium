import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaShare } from "react-icons/fa";
import BlogService from "../../service/BlogService";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { blogID } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (blogID) {
      fetchBlogDetail();
      fetchRelatedBlogs();
    }
  }, [blogID]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    setNotFound(false);
    
    try {
      const data = await BlogService.getBlogById(blogID);
      
      if (data) {
        setBlog(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Có lỗi xảy ra khi tải chi tiết blog");
      }
    }
    
    setLoading(false);
  };

  const fetchRelatedBlogs = async () => {
    try {
      const allBlogs = await BlogService.getAllBlogs();
      
      if (allBlogs && allBlogs.length > 0) {
        // Lấy 3 blogs khác (không bao gồm blog hiện tại)
        const filtered = allBlogs
          .filter(b => b.blogID !== parseInt(blogID))
          .slice(0, 3);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
      setRelatedBlogs([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: `Đọc bài viết: ${blog.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link bài viết!");
    }
  };

  const handleRelatedBlogClick = (relatedBlogID) => {
    navigate(`/blog/${relatedBlogID}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-10">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải chi tiết blog...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="max-w-container mx-auto px-4 py-10">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-6">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại danh sách blog
          </button>
        </div>
      </div>
    );
  }

  // Blog detail content
  return (
    <div className="max-w-container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Breadcrumbs title={blog?.title || "Chi tiết blog"} prevLocation="Blog" />

      {/* Back button */}
      <div className="mt-6 mb-8">
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại danh sách blog
        </button>
      </div>

      {blog && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <article className="lg:col-span-2">
            {/* Blog header */}
            <header className="mb-8">
              {/* Status badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    blog.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {blog.status ? "Đang hoạt động" : "Không hoạt động"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>Tác giả: {blog.author}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(blog.createAt)}</span>
                </div>
                {blog.updateAt && blog.updateAt !== blog.createAt && (
                  <div className="flex items-center">
                    <FaTag className="mr-2" />
                    <span>Cập nhật: {formatDate(blog.updateAt)}</span>
                  </div>
                )}
              </div>

              {/* Share button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
                >
                  <FaShare className="mr-2" />
                  Chia sẻ
                </button>
              </div>
            </header>

            {/* Blog images */}
            {blog.imageBlogs && blog.imageBlogs.length > 0 && (
              <div className="mb-8">
                {blog.imageBlogs.length === 1 ? (
                  <img
                    src={blog.imageBlogs[0].image}
                    alt={blog.title}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blog.imageBlogs.map((img, index) => (
                      <img
                        key={index}
                        src={img.image}
                        alt={`${blog.title} - Hình ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {/* Blog footer */}
            <footer className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  ID Blog: {blog.blogID}
                  {blog.accountID && (
                    <span className="ml-4">Account ID: {blog.accountID}</span>
                  )}
                </div>
                <button
                  onClick={handleShare}
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  Chia sẻ bài viết này
                </button>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Author info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Về tác giả</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {blog.author?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{blog.author}</h4>
                  <p className="text-sm text-gray-600">Tác giả</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Các bài viết được chia sẻ trên Thriftorium nhằm mang đến thông tin hữu ích 
                về thế giới tái sử dụng và bảo vệ môi trường.
              </p>
            </div>

            {/* Related blogs */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <div
                      key={relatedBlog.blogID}
                      onClick={() => handleRelatedBlogClick(relatedBlog.blogID)}
                      className="cursor-pointer group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(relatedBlog.createAt)}
                      </p>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {relatedBlog.content?.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/blog")}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    Xem tất cả bài viết →
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default BlogDetail; 