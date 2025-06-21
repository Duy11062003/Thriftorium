import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Đảm bảo import đúng useNavigate và Link
import { FaStar, FaRegStar, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import ProductService from "../../service/ProductService";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate(); // Khai báo navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1); // Quản lý số lượng
  const [reviewRating, setReviewRating] = useState(0); // state cho review stars

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Giả sử slug là productId, hoặc có thể extract ID từ slug
        const data = await ProductService.getProductDetails(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      }
      setLoading(false);
    };
    
    if (productId) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [productId]);

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!product) return <div className="p-8 text-center">Không tìm thấy sản phẩm</div>;

  const {
    productID,
    name: title,
    unitPrice: price,
    description,
    imageProducts,
    ratings
  } = product;
  
  // Tính average rating từ ratings array
  const averageRating = ratings && ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + (r.rate || 0), 0) / ratings.length 
    : 0;

  const images = imageProducts?.map(img => img.image) || [];
  const [mainImage, ...thumbs] = images;

  // Hàm import hình ảnh sản phẩm
  const importImg = (file) => {
    try {
      return require(`../../assets/images/products/bestSeller/${file}`);
    } catch {
      return file; // Trả về URL trực tiếp nếu không phải local file
    }
  };

  // Hàm import asset chung (logo, avatar…)
  const importAsset = (file) => {
    try {
      return require(`../../assets/images/${file}`);
    } catch {
      return "";
    }
  };

  // Tạo các sao cho review
  const stars = (count) =>
    Array.from({ length: 5 }, (_, i) =>
      i < count ? (
        <FaStar key={i} className="inline text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="inline text-gray-300" />
      )
    );

  const sampleReviews = [
    {
      name: "Kara",
      avatar: importAsset("logoLight.png"),
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis malesuada dui, id fringilla lectus. In auctor mauris in turpis convallis, non blandit augue sollicitudin. Integer consectetur, turpis eget scelerisque lacinia.",
      rating: 5,
    },
    {
      name: "Kim",
      avatar: importAsset("orebiLogo.png"),
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis malesuada dui, id fringilla lectus. In auctor mauris in turpis convallis, non blandit augue sollicitudin. Integer consectetur, turpis eget scelerisque lacinia.",
      rating: 5,
    },
  ];

  // Xử lý tăng giảm số lượng
  const handleIncreaseQty = () => setQty((prevQty) => prevQty + 1);
  const handleDecreaseQty = () => setQty((prevQty) => Math.max(1, prevQty - 1));

  return (
    <div className="bg-white">
      <div className="max-w-container mx-auto px-4 pt-6">
        {/* Header */}
        <h1 className="text-4xl italic font-bold">Product</h1>
        <p className="text-sm text-gray-600 mt-1 mb-2">
          /product listing/{title}
        </p>

        {/* Gallery + Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-6">
          {/* Thumbnails */}
          <div className="hidden md:grid md:col-span-1 md:row-span-3 grid grid-rows-3 gap-4 h-full">
            {thumbs.slice(0, 3).map((f, i) => (
              <img
                key={i}
                src={importImg(f)}
                alt={`thumb-${i}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Main image */}
          <div className="md:col-span-3 md:row-span-3 bg-gray-100 rounded-lg overflow-hidden">
            {mainImage ? (
              <img
                src={importImg(mainImage)}
                alt="main"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 p-8 text-center">No image</div>
            )}
          </div>

          {/* Info & Actions */}
          <div className="md:col-span-2 md:row-span-3 flex flex-col">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {title}
              </h2>
              <div className="flex items-center space-x-2 text-sm mb-4">
                <span className="text-xl font-semibold text-red-600">
                  {price?.toLocaleString()} VND
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center space-x-1">
                  {stars(Math.round(averageRating))}
                </span>
                <span className="text-gray-500">| {ratings?.length || 0} đánh giá</span>
              </div>
              <p className="text-gray-700 mb-4">{description || "Không có mô tả"}</p>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="inline-flex items-center h-12 bg-black text-white rounded-lg">
                <button onClick={handleDecreaseQty} className="px-5">
                  –
                </button>
                <span className="px-6">{qty}</span>
                <button onClick={handleIncreaseQty} className="px-5">
                  +
                </button>
              </div>
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 h-12 bg-red-600 text-white px-6 rounded-lg hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={() => navigate("/cart")}
              className="w-full h-12 bg-black text-white px-6 rounded-lg hover:bg-gray-800 transition"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Shop Info Block */}
        {/* <div className="mt-8 flex items-center justify-between p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <img
              src={importAsset("logoLight.png")}
              alt="Shop Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="text-lg font-semibold">Shop Lí Lắc</div>
              <div className="flex items-center space-x-2 text-sm">
                {stars(5)}
                <span className="text-gray-600">138</span>
                <span className="flex items-center space-x-1 text-green-600 font-medium">
                  <FaCheckCircle /> Verified account
                </span>
              </div>
              <div className="text-sm text-gray-600">0 Followers | 191 Following</div>
            </div>
          </div>
          <Link to={`/shop/shop-li-lac`}>
            <button className="h-10 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Visit Shop
            </button>
          </Link>
        </div> */}

        {/* Description | Reviews */}
        <div className="mt-10 mb-12">
          <h3 className="text-xl font-semibold mb-4">Description | Reviews</h3>
          <p className="mb-4 text-gray-700">
            {description || "Không có mô tả chi tiết"}
          </p>
          {ratings && ratings.length > 0 ? (
            ratings.map((review, idx) => (
              <div key={idx} className="mb-4 border border-gray-300 rounded-lg p-4 flex space-x-4">
                <img
                  src={importAsset("orebiLogo.png")}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold mb-1">Người dùng</div>
                  <p className="text-sm text-gray-700 mb-2">Đánh giá {review.rate}/5 sao</p>
                  <div className="flex justify-between items-center">
                    <div className="space-x-1">{stars(review.rate || 0)}</div>
                    <div className="space-x-4 text-sm text-gray-500">
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mb-4 border border-gray-300 rounded-lg p-4 flex space-x-4">
              <img
                src={importAsset("orebiLogo.png")}
                alt="No reviews"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="text-center text-gray-500">Chưa có đánh giá nào</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
