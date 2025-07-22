// src/components/home/Header/Header.js
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logo, logoLight } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants"; // for mobile
import Flex from "../../designLayouts/Flex";

const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const location = useLocation();

  // responsive show/hide desktop menu
  useEffect(() => {
    const handleResize = () => setShowMenu(window.innerWidth >= 667);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // desktop links
  const desktopLinks = [
    { title: "Trang Chủ", to: "/" },
    { title: "Cửa hàng", to: "/shop" },
    { title: "Blog", to: "/blog" },
    { title: "Về Chúng Tôi", to: "/about" },
  ];

  return (
    <div className="w-full h-20 bg-white sticky top-0 z-50 border-b border-gray-200">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/">
            <Image className="w-20 object-cover" imgSrc={logo} />
          </Link>

          <div className="flex items-center space-x-6">
            {/* desktop nav */}
            {showMenu && (
              <ul className="flex items-center gap-6">
                {desktopLinks.map((link, idx) => (
                  <React.Fragment key={link.title}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        "text-base " +
                        (isActive
                          ? "font-semibold text-black"
                          : "text-gray-600 hover:text-black")
                      }
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      {link.title}
                    </NavLink>
                    {idx < desktopLinks.length - 1 && (
                      <span className="inline-block h-5 border-r border-gray-300" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}

            {/* Post button on desktop */}
            {showMenu && (
              <Link
                to="/subscription"
                className="ml-6 px-6 py-2 bg-green-400 hover:bg-green-500 rounded-full text-black font-medium transition"
              >
                Đăng Ký Gói
              </Link>
            )}

            {/* mobile menu toggle */}
            {!showMenu && (
              <HiMenuAlt2
                onClick={() => setSidenav(true)}
                className="w-8 h-6 cursor-pointer text-gray-600"
              />
            )}
          </div>
        </Flex>

        {/* mobile sidenav */}
        {sidenav && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-3/4 h-full bg-white p-6"
            >
              <MdClose
                onClick={() => setSidenav(false)}
                className="w-6 h-6 cursor-pointer text-gray-600 mb-4"
              />

              <ul className="space-y-2">
                {navBarList.map((item) => (
                  <li key={item._id} className="text-lg">
                    <NavLink
                      to={item.link}
                      onClick={() => setSidenav(false)}
                      className="text-gray-700 hover:text-black"
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Category collapse */}
              <div className="mt-6">
                <h1
                  onClick={() => setCategory(!category)}
                  className="flex justify-between cursor-pointer items-center mb-2"
                >
                  Shop by Category <span>{category ? "-" : "+"}</span>
                </h1>
                {category && (
                  <ul className="pl-4 space-y-1 text-gray-600">
                    <li>New Arrivals</li>
                    <li>Gudgets</li>
                    <li>Accessories</li>
                    <li>Electronics</li>
                    <li>Others</li>
                  </ul>
                )}
              </div>

              {/* Brand collapse */}
              <div className="mt-6">
                <h1
                  onClick={() => setBrand(!brand)}
                  className="flex justify-between cursor-pointer items-center mb-2"
                >
                  Shop by Brand <span>{brand ? "-" : "+"}</span>
                </h1>
                {brand && (
                  <ul className="pl-4 space-y-1 text-gray-600">
                    <li>New Arrivals</li>
                    <li>Gudgets</li>
                    <li>Accessories</li>
                    <li>Electronics</li>
                    <li>Others</li>
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
