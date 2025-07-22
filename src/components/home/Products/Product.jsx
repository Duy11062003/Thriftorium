import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useAuth } from "../../../context/AuthContext";
import CartService from "../../../service/CartService";
import { toast } from "react-toastify";

const Product = (props) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const id = props._id;

  const navigate = useNavigate();
  const productItem = props;

  const handleProductDetails = () => {
    navigate(`/product/${id}`, {
      state: {
        item: productItem,
      },
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/signin");
      return;
    }

    setIsAddingToCart(true);

    try {
      // Chuẩn bị dữ liệu để gửi API - chỉ cần productId và accountId
      const cartData = {
        productId: props._id,
        accountId: user.userID, // Assuming user object has id field
      };

      // Gọi API thêm vào giỏ hàng
      await CartService.addCart(cartData);

      // Thêm vào Redux store cho UI (local state)
      dispatch(
        addToCart({
          _id: props._id,
          name: props.productName,
          quantity: 1,
          image: props.img,
          badge: props.badge,
          price: props.price,
          colors: props.color,
        })
      );

      // Thông báo thành công
      toast.success(`Đã thêm "${props.productName}" vào giỏ hàng!`);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);

      // Xử lý lỗi cụ thể
      if (error.response?.status === 401) {
        // Token hết hạn, chuyển hướng đến trang đăng nhập
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        navigate("/signin");
      } else {
        // Hiển thị thông báo lỗi cho user
        toast.error(
          "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!"
        );
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 w-full h-full relative overflow-y-hidden ">
        <div className="w-full h-full">
          <Image className="w-full h-full aspect-square" imgSrc={props.img} />
        </div>
        <div className="absolute top-6 left-8">
          {props.badge && <Badge text="New" />}
        </div>
        <div className="w-full h-16 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li
              onClick={handleAddToCart}
              className={`text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full ${
                isAddingToCart ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
              <span>
                <FaShoppingCart />
              </span>
            </li>
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Chi tiết
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">
            {props.productName}
          </h2>
          <p className="text-[#767676] text-[14px]">{props.price}đ</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.color}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
