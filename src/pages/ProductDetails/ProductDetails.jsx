import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Đảm bảo import đúng useNavigate và Link
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaArrowRight,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import ProductService from "../../service/ProductService";
import RatingService from "../../service/RatingService";
import CartService from "../../service/CartService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate(); // Khai báo navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1); // Quản lý số lượng
  const [reviewRating, setReviewRating] = useState(0); // state cho review stars
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [userRatings, setUserRatings] = useState([]);

  // Get current user info from localStorage
  const { user } = useAuth();
  const isLoggedIn = !!localStorage.getItem("token");

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

  useEffect(() => {
    const fetchUserRatings = async () => {
      if (user) {
        try {
          const ratings = await RatingService.getRatingByAccountId(user.userID);
          setUserRatings(ratings || []);
        } catch (error) {
          console.error("Error fetching user ratings:", error);
        }
      }
    };

    fetchUserRatings();
  }, [isLoggedIn, user.userId]);

  const userProductRating = userRatings.find(
    (rating) => rating.productID === parseInt(productId)
  );

  const handleAddRating = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (reviewRating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmittingRating(true);
    try {
      const ratingData = {
        accountID: user.userID,
        rate: reviewRating,
        productID: parseInt(productId),
      };
      console.log(ratingData);

      await RatingService.addRating(ratingData);
      toast.success("Đánh giá đã được thêm thành công!");

      // Reset form
      setReviewRating(0);

      // Refresh product data and user ratings
      const updatedProduct = await ProductService.getProductDetails(productId);
      setProduct(updatedProduct);

      const updatedUserRatings = await RatingService.getRatingByAccountId(
        user.userId
      );
      setUserRatings(updatedUserRatings || []);
    } catch (error) {
      console.error("Error adding rating:", error);
      toast.error("Có lỗi xảy ra khi thêm đánh giá");
    }
    setIsSubmittingRating(false);
  };

  // Handle updating rating
  const handleUpdateRating = async () => {
    if (!editingRating) return;

    setIsSubmittingRating(true);
    try {
      const ratingData = {
        ratingId: editingRating.ratingId,
        accountId: user.userId,
        rate: reviewRating,
        productId: parseInt(productId),
      };

      await RatingService.updateRating(ratingData);
      toast.success("Đánh giá đã được cập nhật thành công!");

      // Reset form
      setReviewRating(0);
      setEditingRating(null);

      // Refresh product data and user ratings
      const updatedProduct = await ProductService.getProductDetails(productId);
      setProduct(updatedProduct);

      const updatedUserRatings = await RatingService.getRatingByAccountId(
        user.userId
      );
      setUserRatings(updatedUserRatings || []);
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đánh giá");
    }
    setIsSubmittingRating(false);
  };

  // Handle deleting rating
  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

    try {
      await RatingService.deleteRating(ratingId);
      toast.success("Đánh giá đã được xóa thành công!");

      // Refresh product data and user ratings
      const updatedProduct = await ProductService.getProductDetails(productId);
      setProduct(updatedProduct);

      const updatedUserRatings = await RatingService.getRatingByAccountId(
        user.userId
      );
      setUserRatings(updatedUserRatings || []);
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Có lỗi xảy ra khi xóa đánh giá");
    }
  };

  // Handle starting edit mode
  const handleStartEdit = (rating) => {
    setEditingRating(rating);
    setReviewRating(rating.rate);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingRating(null);
    setReviewRating(0);
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!product)
    return <div className="p-8 text-center">Không tìm thấy sản phẩm</div>;

  const {
    productID,
    name: title,
    unitPrice: price,
    description,
    imageProducts,
    ratings,
  } = product;

  // Tính average rating từ ratings array
  const averageRating =
    ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.rate || 0), 0) / ratings.length
      : 0;

  const images = imageProducts?.map((img) => img.image) || [];
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

  // Interactive star rating component
  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange(i + 1)}
            className={`text-2xl ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-transform`}
          >
            {i < rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  // Xử lý tăng giảm số lượng
  const handleIncreaseQty = () => setQty((prevQty) => prevQty + 1);
  const handleDecreaseQty = () => setQty((prevQty) => Math.max(1, prevQty - 1));

  // Handle adding to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      const cartData = {
        accountId: user.userID,
        productId: parseInt(productId),
        quantity: qty
      };

      await CartService.addCart(cartData);
      toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
      
      // Reset quantity to 1 after adding
      setQty(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để mua hàng");
      return;
    }

    try {
      const cartData = {
        accountId: user.userID,
        productId: parseInt(productId),
        quantity: qty
      };

      await CartService.addCart(cartData);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

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
                className="w-full h-full aspect-square object-cover"
              />
            ) : (
              <div className="text-gray-500 p-8 text-center">No image</div>
            )}
          </div>

          {/* Info & Actions */}
          <div className="md:col-span-2 md:row-span-3 flex flex-col">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{title}</h2>
              <div className="flex items-center space-x-2 text-sm mb-4">
                <span className="text-xl font-semibold text-red-600">
                  {price?.toLocaleString()} VND
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center space-x-1">
                  {stars(Math.round(averageRating))}
                </span>
                <span className="text-gray-500">
                  | {ratings?.length || 0} đánh giá
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                {description || "Không có mô tả"}
              </p>
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
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-red-600 text-white px-6 rounded-lg hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="w-full h-12 bg-black text-white px-6 rounded-lg hover:bg-gray-800 transition"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Rating Form */}
        {isLoggedIn && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingRating
                ? "Chỉnh sửa đánh giá"
                : userProductRating
                ? "Bạn đã đánh giá sản phẩm này"
                : "Đánh giá sản phẩm"}
            </h3>

            {userProductRating && !editingRating ? (
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <StarRating rating={userProductRating.rate} readonly />
                    <span className="text-sm text-gray-600">
                      ({userProductRating.rate}/5)
                    </span>
                  </div>
                  {userProductRating.comment && (
                    <p className="text-gray-700">{userProductRating.comment}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartEdit(userProductRating)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteRating(userProductRating.ratingId)
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ) : (
              (!userProductRating || editingRating) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Đánh giá của bạn:
                    </label>
                    <StarRating
                      rating={reviewRating}
                      onRatingChange={setReviewRating}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={
                        editingRating ? handleUpdateRating : handleAddRating
                      }
                      disabled={isSubmittingRating || reviewRating === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {isSubmittingRating
                        ? "Đang xử lý..."
                        : editingRating
                        ? "Cập nhật đánh giá"
                        : "Gửi đánh giá"}
                    </button>

                    {editingRating && (
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Description | Reviews */}
        <div className="mt-10 mb-12">
          <h3 className="text-xl font-semibold mb-4">Description | Reviews</h3>
          <p className="mb-4 text-gray-700">
            {description || "Không có mô tả chi tiết"}
          </p>
          {ratings && ratings.length > 0 ? (
            ratings.map((review, idx) => (
              <div
                key={idx}
                className="mb-4 border border-gray-300 rounded-lg p-4 flex space-x-4"
              >
                <img
                  src={importAsset("orebiLogo.png")}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    {review.account?.fullName || "Người dùng"}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <StarRating rating={review.rate || 0} readonly />
                    <span className="text-sm text-gray-600">
                      ({review.rate}/5)
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mb-2">
                      {review.comment}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {review.ratingDate
                        ? new Date(review.ratingDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : ""}
                    </span>
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
                <div className="text-center text-gray-500">
                  Chưa có đánh giá nào
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
