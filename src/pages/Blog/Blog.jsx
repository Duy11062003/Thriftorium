// src/pages/Blog/Blog.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import BlogService from "../../service/BlogService";
import { toast } from "react-toastify";

export default function Blog() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    if (location.state && location.state.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await BlogService.getAllBlogs();
      
      if (data && data.length > 0) {
        // Lấy blog đầu tiên làm featured blog
        setFeaturedBlog(data[0]);
        // Lấy 5 blogs gần đây nhất (trừ featured blog)
        setBlogs(data.slice(1, 6));
      } else {
        setBlogs([]);
        setFeaturedBlog(null);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách blog");
      setBlogs([]);
      setFeaturedBlog(null);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long", 
      year: "numeric"
    });
  };

  const truncateContent = (content, maxLength = 300) => {
    if (!content) return "Nội dung blog...";
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  const handleBlogClick = (blogID) => {
    // Navigate to blog detail page (you can implement this later)
    navigate(`/blog/${blogID}`);
  };

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-10">
        <Breadcrumbs title="Blog" prevLocation={prevLocation} />
        <div className="mt-6 flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách blog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 py-10">
      {/* Breadcrumb + Title */}
      <Breadcrumbs title="Blog" prevLocation={prevLocation} />

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: featured blog */}
        <div className="md:col-span-2 space-y-6">
          {featuredBlog ? (
            <>
              {/* Featured Blog Image */}
              {featuredBlog.imageBlogs && featuredBlog.imageBlogs.length > 0 ? (
                <img
                  src={featuredBlog.imageBlogs[0].image}
                  alt={featuredBlog.title}
                  className="w-full h-64 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src = "/assets/images/thriftorium-logo.png";
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg border flex items-center justify-center">
                  <span className="text-gray-500">Không có hình ảnh</span>
                </div>
              )}

              {/* Featured Blog Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold uppercase text-gray-900">
                  {featuredBlog.title}
                </h2>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>Tác giả: {featuredBlog.author}</span>
                  <span>•</span>
                  <span>Ngày đăng: {formatDate(featuredBlog.createAt)}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    featuredBlog.status 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {featuredBlog.status ? "Đang hoạt động" : "Không hoạt động"}
                  </span>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {truncateContent(featuredBlog.content)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleBlogClick(featuredBlog.blogID)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Đọc thêm
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigate("/blogs")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Xem tất cả bài viết
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có blog nào
              </h2>
              <p className="text-gray-600">
                Hiện tại chưa có bài viết blog nào được đăng tải.
              </p>
            </div>
          )}
        </div>

        {/* Right column: recent posts */}
        <aside className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Bài viết gần đây</h3>
          
          {blogs.length > 0 ? (
            <ul className="space-y-4">
              {blogs.map((blog) => (
                <li key={blog.blogID} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div onClick={() => handleBlogClick(blog.blogID)}>
                    <h4 className="text-gray-800 font-medium hover:text-blue-600 transition line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {truncateContent(blog.content, 100)}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Ngày đăng: {formatDate(blog.createAt)}</span>
                      <span>Bởi: {blog.author}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 border border-gray-200 rounded-lg">
              <div className="text-gray-400 mb-2">📰</div>
              <p className="text-gray-500 text-sm">
                Chưa có bài viết gần đây
              </p>
            </div>
          )}

          {/* View All Blogs Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/blogs")}
              className="w-full px-4 py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
            >
              Xem tất cả bài viết
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
