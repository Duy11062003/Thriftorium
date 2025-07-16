import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import CartService from "../../service/CartService";
import { setCartItems } from "../../redux/orebiSlice";
import { useAuth } from "../../context/AuthContext";

const SpecialCase = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.orebiReducer.cartItems);
  const { user } = useAuth();

  // Fetch cart items and update Redux store
  const fetchCartItems = async () => {
    if (user?.userID) {
      try {
        const response = await CartService.getCartByAccountId(user.userID);
        const items = response?.cartItem || [];
        dispatch(setCartItems(items));
      } catch (error) {
        console.error("Error fetching cart items:", error);
        dispatch(setCartItems([]));
      }
    } else {
      dispatch(setCartItems([]));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCartItems();
  }, [user?.userID, dispatch]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (!user?.userID) return;

    const interval = setInterval(fetchCartItems, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user?.userID]);

  return (
    <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
      <Link to="/profile/account-information">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
          <div className="flex justify-center items-center">
            <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
            <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Profile</p>
        </div>
      </Link>
      <Link to="/cart">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
          <div className="flex justify-center items-center">
            <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
            <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Buy Now</p>
          {cartItems.length > 0 && (
            <p className="absolute top-1 right-2 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
              {cartItems.length}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SpecialCase;
