// src/components/home/Header/HeaderBottom.js
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CategoryService from "../../../service/CategoryService";
import ProductService from "../../../service/ProductService";
import CartService from "../../../service/CartService";
import { useAuth } from "../../../context/AuthContext";
import { setCartItems } from "../../../redux/orebiSlice";

const HeaderBottom = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.orebiReducer.cartItems);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const { user } = useAuth();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref?.current?.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

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

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoryData = await CategoryService.getAllCategory();
        setCategories(categoryData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to static categories if API fails
        setCategories([
          { categoryID: 1, name: "Accessories" },
          { categoryID: 2, name: "Furniture" },
          { categoryID: 3, name: "Electronics" },
          { categoryID: 4, name: "Clothes" },
          { categoryID: 5, name: "Bags" },
          { categoryID: 6, name: "Home appliances" },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim() === "") {
        setFilteredProducts([]);
        return;
      }

      try {
        setSearchLoading(true);
        const searchResults = await ProductService.getProductsBase({
          search: searchQuery,
          pageSize: 10, // Limit search results to 10 items
        });
        setFilteredProducts(searchResults || []);
      } catch (error) {
        console.error("Error searching products:", error);
        setFilteredProducts([]);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Category */}
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Category</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-primeColor w-auto text-[#767676] p-4 pb-6"
              >
                {loadingCategories ? (
                  <li className="text-gray-400 px-4 py-1 border-b border-gray-400">
                    Loading categories...
                  </li>
                ) : (
                  categories.map((cat) => (
                    <li
                      key={cat.categoryID}
                      className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300 cursor-pointer"
                      onClick={() => {
                        // Navigate to shop page with category filter
                        navigate(`/shop?category=${cat.categoryID}`);
                        setShow(false);
                      }}
                    >
                      {cat.name}
                    </li>
                  ))
                )}
              </motion.ul>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleSearchSubmit}
              placeholder="Search your products here"
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
            />
            <FaSearch
              className="w-5 h-5 cursor-pointer hover:text-black transition-colors"
              onClick={handleSearchIconClick}
            />
            {searchQuery && (
              <div className="absolute top-16 left-0 w-full max-h-96 bg-white overflow-y-auto shadow-2xl scrollbar-hide z-50 cursor-pointer">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <div
                      key={item.productId}
                      onClick={() => {
                        navigate(`/product/${item.productId}`);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 bg-gray-100 mb-3 p-3 max-w-[600px] h-28 hover:bg-gray-200 transition-colors"
                    >
                      <img
                        className="w-24 h-20 object-cover"
                        src={
                          item.imageProducts?.[0]?.image ||
                          "/placeholder-image.jpg"
                        }
                        alt="productImg"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-xs line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-sm">
                          Price:{" "}
                          <span className="text-primeColor font-semibold">
                            ${item.purchasePrice}
                          </span>
                        </p>
                        {item.category && (
                          <p className="text-xs text-gray-500">
                            Category: {item.category.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User & Cart */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-1 text-primeColor"
            >
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 right-0 z-50 bg-primeColor w-44 text-[#767676] p-4 pb-6"
              >
                {!user && (
                  <>
                    <Link to="/signin" onClick={() => setShowUser(false)}>
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300">
                        Login
                      </li>
                    </Link>
                    <Link to="/signup" onClick={() => setShowUser(false)}>
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300">
                        Sign Up
                      </li>
                    </Link>
                  </>
                )}

                {/* Profile now links to /profile/account-information */}
                <Link
                  to="/profile/account-information"
                  onClick={() => setShowUser(false)}
                >
                  <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300">
                    Profile
                  </li>
                </Link>
                {user &&
                  (user?.roles?.includes("Admin") ||
                    user?.roles?.includes("Manager") ||
                    user?.roles?.includes("Staff")) && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowUser(false)}
                    >
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300">
                        Administration
                      </li>
                    </Link>
                  )}
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative text-primeColor">
                <FaShoppingCart />
                <span className="absolute top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {cartItems.length}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
