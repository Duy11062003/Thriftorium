import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { BsSuitHeartFill } from 'react-icons/bs';
import { GiReturnArrow } from 'react-icons/gi';
import { FaShoppingCart } from 'react-icons/fa';
import { MdOutlineLabelImportant } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/orebiSlice";

// Giả lập danh sách sản phẩm
const productsData = [
  {
    _id: 1,
    productName: "Sách học tiếng Trung",
    price: "100k",
    img: "path_to_image1", // Thay bằng đường dẫn hình ảnh thực tế
    color: "Red",
    badge: "New",
  },
  {
    _id: 2,
    productName: "Sách tiếng Anh",
    price: "100k",
    img: "path_to_image2", // Thay bằng đường dẫn hình ảnh thực tế
    color: "Blue",
    badge: "Sale",
  },
  {
    _id: 3,
    productName: "Sách tiếng Anh IELTS",
    price: "50k",
    img: "path_to_image3", // Thay bằng đường dẫn hình ảnh thực tế
    color: "Green",
    badge: "Best Seller",
  },
  // Thêm các sản phẩm khác ở đây
];

const ShopDetails = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12); // Số lượng sản phẩm hiển thị mỗi trang
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProductDetails = (product) => {
    const rootId = String(product.productName).toLowerCase().split(" ").join("");
    navigate(`/product/${rootId}`, {
      state: {
        item: product,
      },
    });
  };

  return (
    <div className="max-w-container mx-auto px-4">
      {/* Breadcrumbs */}
      <div className="py-4 text-sm">
        <span className="text-gray-600">Home / Shop / Shop Lí Lắc</span>
      </div>

      {/* Shop Header */}
      <div className="flex items-center justify-between p-4 bg-green-500 text-white rounded-lg mb-6">
        <div className="flex items-center space-x-4">
          <img
            src="path_to_logo" // Thêm đường dẫn tới logo shop
            alt="Shop Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">Shop Lí Lắc</h1>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">138 reviews</span>
            </div>
            <div className="text-sm text-gray-600">0 Followers | 191 Following</div>
          </div>
        </div>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Follow
        </button>
      </div>

      {/* Review for buyers */}
      <div className="my-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Review for buyers</h3>

        <div className="flex space-x-4">
          <img
            src="path_to_avatar" // Thêm đường dẫn avatar của người đánh giá
            alt="Mike Tyson"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">Mike Tyson</div>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis malesuada dui, id fringilla lectus. In auctor mauris in turpis convallis, non blandit augue sollicitudin. Integer consectetur, turpis eget scelerisque lacinia.
            </p>
            <div className="text-sm text-gray-500">
              <button className="mr-2 text-blue-600">Like</button>
              <button className="text-blue-600">Reply</button>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <img
            src="path_to_avatar" // Thêm đường dẫn avatar của người đánh giá
            alt="Mike Tyson"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">Mike Tyson</div>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis malesuada dui, id fringilla lectus. In auctor mauris in turpis convallis, non blandit augue sollicitudin. Integer consectetur, turpis eget scelerisque lacinia.
            </p>
            <div className="text-sm text-gray-500">
              <button className="mr-2 text-blue-600">Like</button>
              <button className="text-blue-600">Reply</button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
        {productsData.slice(0, itemsPerPage).map((product) => (
          <div key={product._id} className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg">
            <div className="w-full relative group">
              <div className="max-w-80 max-h-80 relative overflow-hidden">
                <img
                  src={product.img}
                  alt={product.productName}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute top-6 left-8">
                  {product.badge && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">{product.badge}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
              <div className="flex items-center justify-between font-titleFont">
                <h2 className="text-lg text-primeColor font-bold">{product.productName}</h2>
                <p className="text-[#767676] text-[14px]">{product.price}</p>
              </div>
              <div>
                <p className="text-[#767676] text-[14px]">{product.color}</p>
              </div>
            </div>

            {/* Product Actions */}
            <ul className="w-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
              <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
                Compare
                <GiReturnArrow />
              </li>
              <li
                onClick={() =>
                  dispatch(
                    addToCart({
                      _id: product._id,
                      name: product.productName,
                      quantity: 1,
                      image: product.img,
                      badge: product.badge,
                      price: product.price,
                      colors: product.color,
                    })
                  )
                }
                className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
              >
                Add to Cart
                <FaShoppingCart />
              </li>
              <li
                onClick={() => navigate(`/product/${String(product.productName).toLowerCase().split(" ").join("")}`)}
                className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
              >
                View Details
                <MdOutlineLabelImportant />
              </li>
              <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
                Add to Wish List
                <BsSuitHeartFill />
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Pagination (Load more products) */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setItemsPerPage(itemsPerPage + 12)} // Tăng số sản phẩm hiển thị
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default ShopDetails;
