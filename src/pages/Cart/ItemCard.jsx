// src/pages/Cart/ItemCard.js
import React from "react";
import { ImCross } from "react-icons/im";

const ItemCard = ({ item, onUpdateQuantity, onRemoveItem }) => {
  // item structure from API: { cartID, productID, quantity, product: { name, unitPrice, imageProducts } }
  const product = item.product || {};
  const itemSubtotal = item.quantity * (product.unitPrice || 0);
  
  // Get first image from imageProducts array
  const productImage = product.imageProducts && product.imageProducts.length > 0 
    ? product.imageProducts[0].image 
    : null;

  // Helper function to import image
  const importImg = (file) => {
    try {
      return require(`../../assets/images/products/bestSeller/${file}`);
    } catch {
      return file; // Return URL directly if not local file
    }
  };

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(product.productID, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(product.productID, item.quantity - 1);
    }
  };

  const handleRemoveItem = () => {
    onRemoveItem(product.productID);
  };

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      {/* Phần Product (Xóa + ảnh + tên) */}
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={handleRemoveItem}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        {productImage ? (
          <img 
            className="w-32 h-32 object-cover" 
            src={importImg(productImage)} 
            alt="productImage" 
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <h1 className="font-titleFont font-semibold">{product.name || "Tên sản phẩm"}</h1>
      </div>

      {/* Phần Giá, số lượng, thành tiền */}
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        {/* Giá (format VND) */}
        <div className="flex w-1/3 items-center text-lg font-semibold">
          {product.unitPrice || 0}đ
        </div>
        {/* Số lượng */}
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={handleDecreaseQuantity}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            −
          </span>
          <p>{item.quantity}</p>
          <span
            onClick={handleIncreaseQuantity}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            +
          </span>
        </div>
        {/* Thành tiền của item */}
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <p>{itemSubtotal}đ</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
