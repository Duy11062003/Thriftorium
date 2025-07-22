import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Đảm bảo import đúng useNavigate và Link
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import ProductService from "../../service/ProductService";
import RatingService from "../../service/RatingService";
import CartService from "../../service/CartService";
import ReviewService from "../../service/ReviewService";
import AccountAppService from "../../service/AccountAppService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate(); // Khai báo navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1); // Quản lý số lượng
  // Separate states for Rating (stars) and Review (text)
  const [rating, setRating] = useState(0); // state cho rating stars
  const [reviewContent, setReviewContent] = useState(""); // state cho review content
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewUsers, setReviewUsers] = useState({});

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
  }, [isLoggedIn, user?.userID]);



  // Fetch reviews từ ReviewService
  useEffect(() => {
    const fetchReviews = async () => {
      if (productId) {
        setLoadingReviews(true);
        try {
          const reviewsData = await ReviewService.getReviewByProductId(
            productId
          );
          console.log(reviewsData);
          setReviews(reviewsData || []);

          // Fetch user info for each review
          const userPromises = reviewsData.map(async (review) => {
            try {
              const userData = await AccountAppService.getAccountById(review.accountID);
              return { userId: review.accountID, userData };
            } catch (error) {
              console.error(`Error fetching user data for ID ${review.accountID}:`, error);
              return { userId: review.accountID, userData: null };
            }
          });

          const users = await Promise.all(userPromises);
          const userMap = {};
          users.forEach(({ userId, userData }) => {
            userMap[userId] = userData;
          });
          setReviewUsers(userMap);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
        }
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const userProductRating = userRatings.find(
    (rating) => rating.productID === parseInt(productId)
  );

  // Kiểm tra user đã review chưa
  const userReview = reviews.find(
    (review) => review.accountID === user?.userID
  );

  const handleAddRating = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmittingRating(true);
    try {
      const ratingData = {
        accountID: user.userID,
        rate: rating,
        productID: parseInt(productId),
      };
      console.log(ratingData);

      await RatingService.addRating(ratingData);
      toast.success("Đánh giá đã được thêm thành công!");

      // Reset form
      setRating(0);

      // Refresh product data and user ratings
      const updatedProduct = await ProductService.getProductDetails(productId);
      setProduct(updatedProduct);

      const updatedUserRatings = await RatingService.getRatingByAccountId(
        user.userID
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
        accountID: user.userID,
        rate: rating,
        productId: parseInt(productId),
      };

      await RatingService.updateRating(ratingData);
      toast.success("Đánh giá đã được cập nhật thành công!");

      // Reset form
      setRating(0);
      setEditingRating(null);

      // Refresh product data and user ratings
      const updatedProduct = await ProductService.getProductDetails(productId);
      setProduct(updatedProduct);

      const updatedUserRatings = await RatingService.getRatingByAccountId(
        user.userID
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
        user.userID
      );
      setUserRatings(updatedUserRatings || []);
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Có lỗi xảy ra khi xóa đánh giá");
    }
  };

  // ===== REVIEW FUNCTIONS =====

  // Handle adding review
  const handleAddReview = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để viết đánh giá");
      return;
    }

    if (!reviewContent.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        accountID: user.userID,
        productID: parseInt(productId),
        content: reviewContent.trim(),
      };

      await ReviewService.createReview(reviewData);
      toast.success("Đánh giá đã được thêm thành công!");

      // Reset form
      setReviewContent("");

      // Refresh reviews
      const updatedReviews = await ReviewService.getReviewByProductId(
        productId
      );
      setReviews(updatedReviews || []);
    } catch (error) {
      console.error("Error adding review:", error);
      if (error.response?.status === 400) {
        toast.error("Bạn đã đánh giá sản phẩm này rồi!");
      } else {
        toast.error("Có lỗi xảy ra khi thêm đánh giá");
      }
    }
    setIsSubmittingReview(false);
  };

  // Handle updating review
  const handleUpdateReview = async () => {
    if (!editingReview) return;

    if (!reviewContent.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        reviewID: editingReview.reviewID,
        content: reviewContent.trim(),
      };

      await ReviewService.updateReview(editingReview.reviewID, reviewData);
      toast.success("Đánh giá đã được cập nhật thành công!");

      // Reset form
      setReviewContent("");
      setEditingReview(null);

      // Refresh reviews
      const updatedReviews = await ReviewService.getReviewByProductId(
        productId
      );
      setReviews(updatedReviews || []);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đánh giá");
    }
    setIsSubmittingReview(false);
  };

  // Handle deleting review
  const handleDeleteReview = async (reviewID) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

    try {
      await ReviewService.deleteReview(reviewID);
      toast.success("Đánh giá đã được xóa thành công!");

      // Refresh reviews
      const updatedReviews = await ReviewService.getReviewByProductId(
        productId
      );
      setReviews(updatedReviews || []);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Có lỗi xảy ra khi xóa đánh giá");
    }
  };

  // Handle starting edit review mode
  const handleStartEditReview = (review) => {
    setEditingReview(review);
    setReviewContent(review.content);
  };

  // Handle canceling edit review
  const handleCancelEditReview = () => {
    setEditingReview(null);
    setReviewContent("");
  };



  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!product)
    return <div className="p-8 text-center">Không tìm thấy sản phẩm</div>;

  const {
    productID,
    name: title,
    purchasePrice: price,
    description,
    imageProducts,
    ratings,
  } = product;

  // Tính average rating từ ratings của product
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
        accountID: user.userID,
        productId: parseInt(productId),
        quantity: qty,
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
        accountID: user.userID,
        productId: parseInt(productId),
        quantity: qty,
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

        {/* Rating Section */}
        {isLoggedIn && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {userProductRating ? "Cập nhật đánh giá sao" : "Đánh giá sao"}
            </h3>

            {userProductRating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <span className="text-sm text-gray-600">Đánh giá hiện tại của bạn:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {stars(userProductRating.rate)}
                      <span className="text-sm text-gray-600">({userProductRating.rate} sao)</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingRating(userProductRating);
                        setRating(userProductRating.rate);
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteRating(userProductRating.ratingId)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {editingRating && (
                  <div className="space-y-4 p-4 bg-white rounded-lg border">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Đánh giá mới:
                      </label>
                      <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateRating}
                        disabled={isSubmittingRating || rating === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        {isSubmittingRating ? "Đang cập nhật..." : "Cập nhật đánh giá"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingRating(null);
                          setRating(0);
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Đánh giá sao của bạn:
                  </label>
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                  />
                </div>
                <button
                  onClick={handleAddRating}
                  disabled={isSubmittingRating || rating === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {isSubmittingRating ? "Đang gửi..." : "Gửi đánh giá sao"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Review Section */}
        {isLoggedIn && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingReview
                ? "Chỉnh sửa nhận xét"
                : userReview
                ? "Nhận xét của bạn"
                : "Viết nhận xét"}
            </h3>

            {userReview && !editingReview ? (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Nhận xét của bạn:</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartEditReview(userReview)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteReview(userReview.reviewID)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{userReview.content}</p>
                </div>
              </div>
            ) : (
              (!userReview || editingReview) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nội dung nhận xét:
                    </label>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      disabled={isSubmittingReview}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={
                        editingReview ? handleUpdateReview : handleAddReview
                      }
                      disabled={
                        isSubmittingReview ||
                        !reviewContent?.trim()
                      }
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {isSubmittingReview
                        ? "Đang xử lý..."
                        : editingReview
                        ? "Cập nhật nhận xét"
                        : "Gửi nhận xét"}
                    </button>

                    {editingReview && (
                      <button
                        onClick={handleCancelEditReview}
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
          {loadingReviews ? (
            <div className="text-center py-4">Đang tải đánh giá...</div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <div
                key={review.reviewID || idx}
                className="mb-4 border border-gray-300 rounded-lg p-4 flex space-x-4"
              >
                <img
                  src={importAsset("orebiLogo.png")}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    {reviewUsers[review.accountID]?.name || "Người dùng"}
                  </div>
                  {review.content && (
                    <p className="text-sm text-gray-700 mb-2">
                      {review.content}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {review.createdAt || review.reviewDate
                        ? new Date(
                            review.createdAt || review.reviewDate
                          ).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                    <div className="flex items-center space-x-4">
                      {/* Hiển thị nút edit/delete chỉ cho review của user hiện tại */}
                      {review.accountID === user?.userID && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartEditReview(review)}
                            className="text-blue-600 hover:bg-blue-50 p-1 rounded text-sm transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.reviewID)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded text-sm transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mb-4 border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-500 py-8">
                <div className="text-lg mb-2">📝</div>
                <div>Chưa có đánh giá nào cho sản phẩm này</div>
                <div className="text-sm mt-1">
                  Hãy là người đầu tiên đánh giá!
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
