import React, { useState, useEffect } from "react";
import NavTitle from "./NavTitle";

const Price = ({ lowPrice, highPrice, onPriceRangeChange }) => {
  const [customRange, setCustomRange] = useState({
    min: lowPrice || '',
    max: highPrice || ''
  });

  // Update local state when props change (e.g., when filters are cleared)
  useEffect(() => {
    setCustomRange({
      min: lowPrice || '',
      max: highPrice || ''
    });
  }, [lowPrice, highPrice]);

  const priceList = [
    {
      _id: 950,
      priceOne: 0,
      priceTwo: 100000,
      label: "Dưới 100,000đ"
    },
    {
      _id: 951,
      priceOne: 100000,
      priceTwo: 500000,
      label: "100,000đ - 500,000đ"
    },
    {
      _id: 952,
      priceOne: 500000,
      priceTwo: 1000000,
      label: "500,000đ - 1,000,000đ"
    },
    {
      _id: 953,
      priceOne: 1000000,
      priceTwo: 2000000,
      label: "1,000,000đ - 2,000,000đ"
    },
    {
      _id: 954,
      priceOne: 2000000,
      priceTwo: 5000000,
      label: "2,000,000đ - 5,000,000đ"
    },
    {
      _id: 955,
      priceOne: 5000000,
      priceTwo: null,
      label: "Trên 5,000,000đ"
    },
  ];

  const handlePriceRangeClick = (priceOne, priceTwo) => {
    const minPrice = priceOne > 0 ? priceOne.toString() : '';
    const maxPrice = priceTwo ? priceTwo.toString() : '';
    onPriceRangeChange(minPrice, maxPrice);
  };

  const handleCustomRangeChange = (field, value) => {
    setCustomRange(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomRange = () => {
    // Validate prices
    const min = customRange.min ? parseFloat(customRange.min) : null;
    const max = customRange.max ? parseFloat(customRange.max) : null;

    // Check if min price is greater than max price
    if (min && max && min > max) {
      alert("Giá thấp nhất không được lớn hơn giá cao nhất");
      return;
    }

    onPriceRangeChange(customRange.min, customRange.max);
  };

  const clearPriceFilter = () => {
    onPriceRangeChange('', '');
    setCustomRange({ min: '', max: '' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyCustomRange();
    }
  };

  const isRangeSelected = (priceOne, priceTwo) => {
    const currentLow = lowPrice ? parseFloat(lowPrice) : (priceOne > 0 ? null : 0);
    const currentHigh = highPrice ? parseFloat(highPrice) : null;
    
    const rangeMin = priceOne > 0 ? priceOne : null;
    const rangeMax = priceTwo;
    
    return currentLow === rangeMin && currentHigh === rangeMax;
  };

  const hasActiveFilter = lowPrice || highPrice;

  return (
    <div className="cursor-pointer">
      <NavTitle title="Lọc theo giá" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {/* Clear filter option */}
          <li
            className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
              !hasActiveFilter ? 'text-primeColor font-semibold' : ''
            }`}
            onClick={clearPriceFilter}
          >
            Tất cả giá
          </li>
          {priceList.map((item) => (
            <li
              key={item._id}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
                isRangeSelected(item.priceOne, item.priceTwo) ? 'text-primeColor font-semibold' : ''
              }`}
              onClick={() => handlePriceRangeClick(item.priceOne, item.priceTwo)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        
        {/* Custom Price Range */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold mb-3 text-primeColor">Khoảng giá tùy chỉnh</h4>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              placeholder="Giá thấp nhất"
              value={customRange.min}
              onChange={(e) => handleCustomRangeChange('min', e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primeColor"
              min="0"
            />
            <span className="text-gray-400 self-center">-</span>
            <input
              type="number"
              placeholder="Giá cao nhất"
              value={customRange.max}
              onChange={(e) => handleCustomRangeChange('max', e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primeColor"
              min="0"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={applyCustomRange}
              className="flex-1 py-2 bg-primeColor text-white text-sm rounded hover:bg-black duration-300"
            >
              Áp dụng
            </button>
            <button
              onClick={clearPriceFilter}
              className="flex-1 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 duration-300"
            >
              Xóa
            </button>
          </div>
        </div>

        {/* Current Filter Display */}
        {hasActiveFilter && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Đang lọc: </span>
              {lowPrice ? `${parseInt(lowPrice).toLocaleString('vi-VN')}đ` : '0đ'} - {' '}
              {highPrice ? `${parseInt(highPrice).toLocaleString('vi-VN')}đ` : '∞'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Price;