// src/pages/Blog/Blog.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const recentPosts = [
  { title: "Lý Do Bạn Nên Tham Gia Nền Tảng Thriftorium", date: "20 tháng 3, 2025" },
  { title: "5 Lý Do Mua Hàng Cũ Là Sự Lựa Chọn Thông Minh", date: "18 tháng 3, 2025" },
  { title: "Các Mẹo Để Tìm Kiếm Sản Phẩm Cũ Chất Lượng Trên Thriftorium", date: "15 tháng 3, 2025" },
  { title: "Những Câu Chuyện Thành Công Từ Người Dùng Thriftorium", date: "12 tháng 3, 2025" },
  { title: "Vì Sao Thriftorium Là Nền Tảng An Toàn Cho Mua Bán Hàng Cũ", date: "10 tháng 3, 2025" },
];

export default function Blog() {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    if (location.state && location.state.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4 py-10">
      {/* Breadcrumb + Title */}
      <Breadcrumbs title="Blog" prevLocation={prevLocation} />

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: image + article */}
        <div className="md:col-span-2 space-y-6">
          <img
            src="/assets/images/thriftorium-logo.png" 
            // thay đường dẫn ảnh cho đúng với bạn
            alt="Thriftorium Logo"
            className="w-full object-cover rounded-lg border"
          />

          <h2 className="text-2xl font-bold uppercase">
            THRIFTORIUM REPORT – NỀN TẢNG TRAO ĐỔI VÀ MUA BÁN HÀNG CŨ
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Chào mừng bạn đến với Thriftorium Report! Đây là nơi bạn có thể 
            đăng tìm kiếm, trao đổi và mua bán các sản phẩm đã qua sử dụng với giá rẻ mà vẫn tiết kiệm chi phí và bảo vệ môi trường thông qua việc tái sử dụng hàng hóa.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Cách chúng tôi tạo nên sự khác biệt:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Tiết Kiệm Chi Phí: Các sản phẩm cũ trên nền tảng giúp bạn tiết kiệm đáng kể so với giá mới.</li>
            <li>Bảo Vệ Môi Trường: Tham gia vào việc tái sử dụng và trao đổi đồ đạc đã qua sử dụng giúp giảm lượng rác thải.</li>
            <li>Chất lượng đảm bảo: Mỗi món đồ đều được kiểm tra kỹ càng trước khi đăng bán.</li>
            <li>Giao Dịch An Toàn: Mọi giao dịch trên nền tảng đều được bảo vệ và giám sát.</li>
          </ul>
        </div>

        {/* Right column: recent posts */}
        <aside className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Bài viết gần đây</h3>
          <ul className="space-y-4">
            {recentPosts.map((post, i) => (
              <li key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow">
                <Link
                  to="#"
                  className="block text-gray-800 font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <span className="block text-sm text-gray-500 mt-1">
                  Ngày đăng: {post.date}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
