import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import ProductService from "../../../service/ProductService";
import {
  spfOne,
  spfTwo,
  spfThree,
  spfFour,
} from "../../../assets/images/index";

const SpecialOffers = () => {
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback images cho trường hợp không có ảnh từ API
  const fallbackImages = [spfOne, spfTwo, spfThree, spfFour];

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const data = await ProductService.getProductsBase({
          sortBy: "price_asc", // sắp xếp theo giá tăng dần
          pageSize: 8, // lấy 8 sản phẩm
          pageIndex: 1
        });
        setSpecialOffers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching special offers:", error);
        setSpecialOffers([]);
      }
      setLoading(false);
    };
    fetchSpecialOffers();
  }, []);

  if (loading) {
    return (
      <div className="w-full pb-20">
        <Heading heading="Ưu đãi đặc biệt" />
        <div className="text-center">Đang tải ưu đãi đặc biệt...</div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <Heading heading="Ưu đãi đặc biệt" />
      {specialOffers.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
          {specialOffers.map((product, index) => (
            <Product
              key={product.productId}
              _id={product.productId}
              img={product.imageProducts?.[0]?.image || fallbackImages[index % fallbackImages.length]}
              productName={product.name}
              price={product.purchasePrice?.toString() || "0"}
              color={product.category?.name || "Chưa phân loại"}
              badge={true}
              des={`Đánh giá: ${product.averageRating || 0}/5 (${product.ratings?.length || 0} lượt)`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Không có ưu đãi đặc biệt nào
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
