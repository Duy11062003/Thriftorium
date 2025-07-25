import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import ProductService from "../../../service/ProductService";
import {
  newArrOne,
  newArrTwo,
  newArrThree,
  newArrFour,
} from "../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback images cho trường hợp không có ảnh từ API
  const fallbackImages = [newArrOne, newArrTwo, newArrThree, newArrFour];

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await ProductService.getProductsBase({
          sortBy: "newest", // hoặc "createAt" tùy backend support
          pageSize: 10, // lấy 10 sản phẩm mới nhất
          pageIndex: 1
        });
        setNewArrivals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setNewArrivals([]);
      }
      setLoading(false);
    };
    fetchNewArrivals();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full pb-16">
        <Heading heading="Sản phẩm mới" />
        <div className="text-center">Đang tải sản phẩm mới...</div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      <Heading heading="Sản phẩm mới" />
      {newArrivals.length > 0 ? (
        <Slider {...settings} infinite={newArrivals.length > 4}>
          {newArrivals.map((product, index) => (
            <div key={product.productId} className="px-2">
              <Product
                _id={product.productId}
                img={product.imageProducts?.[0]?.image || fallbackImages[index % fallbackImages.length]}
                productName={product.name}
                price={product.purchasePrice?.toString() || "0"}
                color={product.category?.name || "Chưa phân loại"}
                badge={true}
                des={`Đánh giá: ${product.averageRating || 0}/5 (${product.ratings?.length || 0} lượt)`}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center text-gray-500">
          Không có sản phẩm mới nào
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
