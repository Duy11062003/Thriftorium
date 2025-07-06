// src/pages/Cart/Cart.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images";
import ItemCard from "./ItemCard";
import CartService from "../../service/CartService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import UserVoucherService from "../../service/UserVoucherService";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const { user } = useAuth();
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      if (isLoggedIn && user?.userID) {
        try {
          const data = await CartService.getCartByAccountId(user.userID);
          setCartItems(data.cartItem || []);
        } catch (error) {
          console.error("Error fetching cart data:", error);
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    fetchCartData();
  }, [isLoggedIn, user?.userID]);

  // Fetch available vouchers
  useEffect(() => {
    const fetchAvailableVouchers = async () => {
      if (!isLoggedIn || !user?.userID) return;

      try {
        setLoadingVouchers(true);
        const vouchers = await UserVoucherService.getUnusedVouchersByAccountId(
          user.userID
        );
        setAvailableVouchers(vouchers);
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        toast.error("Không thể tải danh sách voucher");
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchAvailableVouchers();
  }, [isLoggedIn, user?.userID]);

  // Tính subtotal - sử dụng cartItems từ API thay vì Redux products
  useEffect(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += (item.product?.purchasePrice || 0) * item.quantity;
    });
    setTotalAmt(sum);
  }, [cartItems]);

  // Tính phí vận chuyển (đơn vị nghìn đồng)
  useEffect(() => {
    if (totalAmt <= 200000) {
      setShippingCharge(30000);
    } else if (totalAmt <= 400000) {
      setShippingCharge(25000);
    } else if (totalAmt <= 800000) {
      setShippingCharge(20000);
    } else {
      setShippingCharge(0); // Miễn phí vận chuyển cho đơn hàng > 800k
    }
  }, [totalAmt]);

  // Handle update cart quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    try {
      await CartService.updateCart(user.userID, productId, newQuantity);
      
      // Refresh from API to ensure data consistency
      await refreshCartData();
      
      toast.success("Đã cập nhật số lượng sản phẩm");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Có lỗi xảy ra khi cập nhật giỏ hàng");
    }
  };

  // Handle remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      await CartService.deleteCart(user.userID, productId);
      
      // Refresh from API to ensure data consistency
      await refreshCartData();
      
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;
    
    try {
      await CartService.deleteUserCart(user.userID);
      setCartItems([]);
      toast.success("Đã xóa toàn bộ giỏ hàng");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Có lỗi xảy ra khi xóa giỏ hàng");
    }
  };

  // Refresh cart data from API
  const refreshCartData = async () => {
    try {
      const data = await CartService.getCartByAccountId(user.userID);
      setCartItems(data.cartItem || []);
    } catch (error) {
      console.error("Error refreshing cart data:", error);
    }
  };

  // Handle apply voucher
  const handleApplyVoucher = async () => {
    if (!couponCode) {
      toast.warning("Vui lòng nhập mã voucher");
      return;
    }

    const voucher = availableVouchers.find((v) => v.voucherCode === couponCode);
    if (!voucher) {
      toast.error("Mã voucher không hợp lệ hoặc đã được sử dụng");
      setDiscount(0);
      setSelectedVoucher(null);
      return;
    }

    // Check if voucher is expired
    const now = new Date();
    const expireDate = new Date(voucher.expiredAt);
    if (now > expireDate) {
      toast.error("Voucher đã hết hạn");
      return;
    }

    // Check minimum order amount if applicable
    if (
      voucher.voucherTemplate?.milestoneAmount &&
      totalAmt < voucher.voucherTemplate.milestoneAmount
    ) {
      toast.error(
        `Đơn hàng tối thiểu ${voucher.voucherTemplate.milestoneAmount.toLocaleString()} VND để sử dụng voucher này`
      );
      return;
    }

    // Apply discount
    const discountAmount = voucher.voucherTemplate?.discountPercentage
      ? (totalAmt * voucher.voucherTemplate.discountPercentage) / 100
      : 0;

    setDiscount(discountAmount);
    setSelectedVoucher(voucher);
    toast.success("Áp dụng voucher thành công");
  };

  // Tổng cuối = subtotal + shipping - discount
  const finalTotal = Math.max(0, totalAmt + shippingCharge - discount);

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center">
        Đang tải giỏ hàng...
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />

      {!isLoggedIn ? (
        // Not logged in state
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Vui lòng đăng nhập
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Bạn cần đăng nhập để xem giỏ hàng của mình.
            </p>
            <Link to="/signin">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Đăng nhập
              </button>
            </Link>
          </div>
        </motion.div>
      ) : cartItems.length > 0 ? (
        <div className="pb-20">
          {/* Header bảng */}
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Giá</h2>
            <h2>Số lượng</h2>
            <h2>Thành tiền</h2>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="mt-5">
            {cartItems.map((item) => (
              <ItemCard
                key={item.cartID}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* Nút Reset */}
          <button
            onClick={handleClearCart}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Xóa toàn bộ giỏ hàng
          </button>

          {/* Coupon */}
          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Nhập mã voucher"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={loadingVouchers}
                className="text-sm mdl:text-base font-semibold text-primeColor hover:underline"
              >
                {loadingVouchers ? "Đang tải..." : "Áp dụng"}
              </button>
            </div>
            {availableVouchers.length > 0 && (
              <select
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full mdl:w-auto px-4 py-2 border border-gray-400 rounded"
              >
                <option value="">Chọn voucher có sẵn</option>
                {availableVouchers.map((voucher) => (
                  <option key={voucher.voucherCode} value={voucher.voucherCode}>
                    {voucher.voucherTemplate?.name} - Giảm{" "}
                    {voucher.voucherTemplate?.discountPercentage}%
                  </option>
                ))}
              </select>
            )}
            <p className="text-lg font-semibold cursor-pointer">Cập nhật giỏ</p>
          </div>

          {/* Cart totals */}
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold">{totalAmt.toLocaleString()} VND</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Giảm giá
                  <span className="font-semibold">
                    {discount > 0 ? `-${discount.toLocaleString()} VND` : "0 VND"}
                    {selectedVoucher && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({selectedVoucher.voucherTemplate?.discountPercentage}%)
                      </span>
                    )}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Tổng cộng
                  <span className="font-semibold">{(totalAmt - discount).toLocaleString()} VND</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Phí vận chuyển
                  <span className="font-semibold">
                    {shippingCharge === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingCharge.toLocaleString()} VND`
                    )}
                  </span>
                </p>
                <p className="text-xs text-gray-500 px-4 -mt-1 mb-1">
                  (Trong TP.HCM: 30,000 VND - Ngoài TP.HCM: 50,000 VND)
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-bold">
                  Tổng thanh toán
                  <span className="font-bold">{finalTotal.toLocaleString()} VND</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 items-center"> 
                {/* Nút Tiến hành thanh toán */}
                <button 
                  onClick={() => {
                    if (cartItems.length === 0) {
                      toast.error("Giỏ hàng của bạn đang trống");
                      return;
                    }
                    navigate("/payment", {
                      state: {
                        cartData: {
                          cartItems,
                          totalAmount: totalAmt,
                          shippingCharge,
                          discount,
                          finalTotal,
                          selectedVoucher
                        }
                      }
                    });
                  }}
                  className="w-full h-10 bg-primeColor text-white hover:bg-black duration-300"
                >
                    Tiến hành thanh toán
                  </button>
                {/* --- Thêm nút Tiếp tục mua sắm bên dưới --- */}
                <Link to="/shop" className="w-full">
                  <button className="w-full h-10 bg-gray-800 text-white hover:bg-gray-600 duration-300">
                    Tiếp tục mua sắm
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Khi giỏ rỗng
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Giỏ hàng của bạn còn trống. Hãy thêm sách, đồ điện tử, v.v… để làm
              đầy và mang lại niềm vui cho giỏ hàng.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
