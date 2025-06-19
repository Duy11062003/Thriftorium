// src/pages/Profile/MyOrder.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaReceipt,
  FaTicketAlt,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const importAsset = (file) => {
  try {
    return require(`../../assets/images/${file}`);
  } catch {
    return "";
  }
};

const importProductImg = (file) => {
  try {
    return require(`../../assets/images/products/bestSeller/${file}`);
  } catch {
    return "";
  }
};

export default function MyOrder() {
  const { logout } = useAuth();

  const tabs = [
    "All",
    "Waiting for confirmation",
    "In transit",
    "Successful delivery",
    "Canceled",
  ];
  const [activeTab, setActiveTab] = useState("All");

  const sampleOrders = [
    {
      id: "#123ABC",
      status: "Waiting for confirmation",
      badgeClass: "bg-yellow-100 text-yellow-800",
      date: "10/03/2025",
      product: {
        image: "bestSellerOne.webp",
        name: "Có hai con mèo",
        quantity: 1,
      },
      subtotal: "42.000 VND",
      primaryAction: { label: "Cancel order", outline: true },
      secondaryAction: { label: "Detail", outline: false },
    },
    {
      id: "#456DEF",
      status: "In transit",
      badgeClass: "bg-yellow-100 text-yellow-800",
      date: "07/03/2025",
      product: {
        image: "bestSellerTwo.webp",
        name: "Sách quản trị học",
        quantity: 1,
      },
      subtotal: "50.000 VND",
      primaryAction: { label: "Confirm delivery", outline: true },
      secondaryAction: { label: "Detail", outline: false },
    },
    {
      id: "#789GHI",
      status: "Canceled",
      badgeClass: "bg-red-100 text-red-800",
      date: "12/02/2025",
      product: {
        image: "bestSellerThree.webp",
        name: "Oxford student's dictionary",
        quantity: 1,
      },
      subtotal: "100.000 VND",
      primaryAction: { label: "Buy back", outline: true },
      secondaryAction: { label: "Detail", outline: false },
    },
    {
      id: "#012JKL",
      status: "Successful delivery",
      badgeClass: "bg-green-100 text-green-800",
      date: "10/02/2025",
      product: {
        image: "bestSellerFour.webp",
        name: "Khí còn 20",
        quantity: 1,
      },
      subtotal: "200.000 VND",
      primaryAction: { label: "Buy back", outline: true },
      secondaryAction: { label: "Detail", outline: false },
    },
  ];

  const filtered =
    activeTab === "All"
      ? sampleOrders
      : sampleOrders.filter((o) => o.status === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-container mx-auto px-4">
        {/* Title */}
        <h1 className="text-4xl font-bold">My Order</h1>
        <p className="text-sm text-gray-600 mt-1 mb-8">/profile/my order</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 space-y-8">
            <div className="flex items-center space-x-4">
              <img
                src={importAsset("orebiLogo.png")}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="font-semibold">Bùi Khánh Duy</div>
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/profile/account-information"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaUser className="mr-3" /> Account Information
              </NavLink>
              <NavLink
                to="/profile/my-order"
                className={({ isActive }) =>
                  "flex items-center px-4 py-2 rounded-lg " +
                  (isActive
                    ? "bg-green-400 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                <FaReceipt className="mr-3" /> My Order
              </NavLink>
              <NavLink
                to="/profile/voucher"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaTicketAlt className="mr-3" /> Voucher
              </NavLink>
              <NavLink
                to="/profile/change-password"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaKey className="mr-3" /> Change Password
              </NavLink>
              <button
                onClick={() => logout()}
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt className="mr-3" /> Log Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6 border border-gray-200">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeTab === t
                      ? "bg-green-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Orders */}
            {filtered.map((o) => (
              <div
                key={o.id}
                className="mb-6 border border-gray-300 rounded-lg p-4"
              >
                {/* Order header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg">{o.id}</span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${o.badgeClass}`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{o.date}</span>
                </div>

                {/* Product info */}
                <div className="flex items-center gap-4">
                  <img
                    src={importProductImg(o.product.image)}
                    alt={o.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-lg">{o.product.name}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: {o.product.quantity}
                    </div>
                  </div>
                </div>

                {/* Subtotal & actions */}
                <div className="flex justify-between items-center mt-6">
                  {/* Sub Total on left */}
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Sub Total:</span>{" "}
                    {o.subtotal}
                  </div>
                  {/* Buttons on right */}
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 text-sm rounded ${
                        o.primaryAction.outline
                          ? "border border-black text-black bg-white hover:bg-gray-100"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {o.primaryAction.label}
                    </button>
                    <button className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800">
                      {o.secondaryAction.label}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-500">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
