import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import ProductService from "../../../service/ProductService";
import {
  bestSellerOne,
  bestSellerTwo,
  bestSellerThree,
  bestSellerFour,
} from "../../../assets/images/index";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback images cho trường hợp không có ảnh từ API
  const fallbackImages = [bestSellerOne, bestSellerTwo, bestSellerThree, bestSellerFour];

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await ProductService.getTopProductInMonth(4);
        setBestSellers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setBestSellers([]);
      }
      setLoading(false);
    };
    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="w-full pb-20">
        <Heading heading="Our Bestsellers" />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
          <div className="text-center">Đang tải...</div>
        </div>
      </div>
    );
  }
  console.log(bestSellers);
  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {bestSellers.length > 0 ? (
          bestSellers.map((product, index) => (
            <Product
              key={product.id || product.productID}
              _id={product.id || product.productID}
              img={product.imageProducts?.[0]?.image || fallbackImages[index] || bestSellerOne}
              productName={product.productName}
              price={product.purchasePrice?.toString() || "0"}
              color={product.original || "N/A"}
              badge={product.status}
              des={product.description || "Không có mô tả"}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Không có sản phẩm bán chạy nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
