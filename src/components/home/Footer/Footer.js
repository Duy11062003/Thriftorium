import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import { paymentCard } from "../../../assets/images";
import Image from "../../designLayouts/Image";

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailValidation = () => {
    return String(emailInfo)
      .toLocaleLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Please provide an Email !");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Please give a valid Email!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };

  // Menu items matching Header component
  const menuItems = [
    { title: "Trang chủ", to: "/" },
    { title: "Cửa hàng", to: "/shop" },
    { title: "Blog", to: "/blog" },
    { title: "Về chúng tôi", to: "/about" },
  ];

  return (
    <div className="w-full bg-[#F5F5F3] py-20">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-6 px-4 gap-10">
        <div className="col-span-2">
          <FooterListTitle title=" Social" />
          <div className="flex flex-col gap-6">
            <p className="text-base w-full xl:w-[80%]">
            </p>
            <ul className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61576944895351"
                target="_blank"
                rel="noreferrer"
              >
                <li className="w-7 h-7 bg-primeColor text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-black duration-300">
                  <FaFacebook />
                </li>
              </a>
              <a
                href="https://www.instagram.com/thirftorium/?igsh=MTU5bnF3cmx2NHM1cw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
              >
                <li className="w-7 h-7 bg-primeColor text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-black duration-300">
                  <FaInstagram />
                </li>
              </a>
            </ul>
          </div>
        </div>
        <div>
          <FooterListTitle title="Menu" />
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.to}
                  className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300 block"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 flex flex-col items-center w-full px-4">
          <FooterListTitle title="Contact" />
          <div className="w-full">
            <p className="text-center mb-4">
              0867406757
            </p>
            <p className="text-center mb-4">
              Thu Duc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;