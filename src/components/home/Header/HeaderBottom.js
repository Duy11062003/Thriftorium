// src/components/home/Header/HeaderBottom.js
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../constants";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
                {["Accessories","Furniture","Electronics","Clothes","Bags","Home appliances"].map((cat) => (
                  <li
                    key={cat}
                    className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300 cursor-pointer"
                  >
                    {cat}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search your products here"
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div className="absolute top-16 left-0 w-full max-h-96 bg-white overflow-y-auto shadow-2xl scrollbar-hide z-50 cursor-pointer">
                {filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(
                        `/product/${item.productName.toLowerCase().replace(/\s+/g, "")}`,
                        { state: { item } }
                      );
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 bg-gray-100 mb-3 p-3 max-w-[600px] h-28"
                  >
                    <img className="w-24" src={item.img} alt="productImg" />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.productName}</p>
                      <p className="text-xs">{item.des}</p>
                      <p className="text-sm">
                        Price: <span className="text-primeColor font-semibold">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User & Cart */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex items-center gap-1 text-primeColor">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] p-4 pb-6"
              >
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
                {/* Profile now links to /profile/account-information */}
                <Link to="/profile/account-information" onClick={() => setShowUser(false)}>
                  <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300">
                    Profile
                  </li>
                </Link>
                <li className="text-gray-400 px-4 py-1 hover:text-white duration-300">
                  Others
                </li>
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative text-primeColor">
                <FaShoppingCart />
                <span className="absolute top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length || 0}
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