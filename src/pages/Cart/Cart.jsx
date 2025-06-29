// src/pages/Cart/Cart.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images";
import ItemCard from "./ItemCard";
import CartService from "../../service/CartService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const { user } = useAuth();
  const isLoggedIn = !!localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

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
  // Hàm format VND (nhân amount lên 1000, sau đó chèn dấu chấm hàng ngàn, thêm " VND")
  const formatVND = (amount) => {
    const realValue = amount * 1000;
    return realValue.toLocaleString("vi-VN") + " VND";
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

  // Tính subtotal - sử dụng cartItems từ API thay vì Redux products
  useEffect(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += (item.product?.unitPrice || 0) * item.quantity;
    });
    setTotalAmt(sum);
  }, [cartItems]);

  // Tính phí vận chuyển
  useEffect(() => {
    if (totalAmt <= 200) setShippingCharge(30);
    else if (totalAmt <= 400) setShippingCharge(25);
    else setShippingCharge(20);
  }, [totalAmt]);

  // Ví dụ hàm apply coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(10); // 10 = 10.000 VND
    } else {
      setDiscount(0);
    }
  };

  // Tổng cuối = subtotal + shipping - discount
  const finalTotal = totalAmt + shippingCharge - discount;

  if (loading) {
    return <div className="max-w-container mx-auto px-4 py-20 text-center">Đang tải giỏ hàng...</div>;
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
                placeholder="Coupon Code"
              />
              <button
                onClick={handleApplyCoupon}
                className="text-sm mdl:text-base font-semibold text-primeColor hover:underline"
              >
                Áp dụng
              </button>
            </div>
            <p className="text-lg font-semibold cursor-pointer">Cập nhật giỏ</p>
          </div>

          {/* Cart totals */}
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold">{totalAmt}đ</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Phí vận chuyển
                  <span className="font-semibold">{shippingCharge}đ</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Giảm giá
                  <span className="font-semibold">-{discount}đ</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-bold">
                  Tổng cộng
                  <span className="font-bold">{finalTotal}đ</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 items-center"> 
                {/* Nút Tiến hành thanh toán */}
                <Link to="/paymentgateway" className="w-full">
                  <button className="w-full h-10 bg-primeColor text-white hover:bg-black duration-300">
                    Tiến hành thanh toán
                  </button>
                </Link>
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
