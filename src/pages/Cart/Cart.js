// src/pages/Cart/Cart.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images";
import ItemCard from "./ItemCard";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);

  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  // Tính subtotal
  useEffect(() => {
    let sum = 0;
    products.forEach((item) => {
      sum += item.price * item.quantity;
    });
    setTotalAmt(sum);
  }, [products]);

  // Tính shipping
  useEffect(() => {
    if (totalAmt <= 200) setShippingCharge(30);
    else if (totalAmt <= 400) setShippingCharge(25);
    else setShippingCharge(20);
  }, [totalAmt]);

  // Ví dụ hàm apply coupon
  const handleApplyCoupon = () => {
    // TODO: thay bằng logic check couponCode
    if (couponCode === "SAVE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  const finalTotal = totalAmt + shippingCharge - discount;

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />

      {products.length > 0 ? (
        <div className="pb-20">
          {/* Header bảng */}
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="mt-5">
            {products.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Nút Reset */}
          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset Cart
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
                Apply Coupon
              </button>
            </div>
            <p className="text-lg font-semibold cursor-pointer">Update Cart</p>
          </div>

          {/* Cart totals */}
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold">${totalAmt}</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold">${shippingCharge}</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Discount
                  <span className="font-semibold">-${discount}</span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-bold">
                  Total
                  <span className="font-bold">${finalTotal}</span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/paymentgateway">
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
                    Proceed to Checkout
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
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
