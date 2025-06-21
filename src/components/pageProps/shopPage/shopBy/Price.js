import React, { useState } from "react";
import NavTitle from "./NavTitle";

const Price = ({ selectedPriceRange, onPriceChange }) => {
  const [customRange, setCustomRange] = useState({
    min: selectedPriceRange?.lowPrice || '',
    max: selectedPriceRange?.highPrice || ''
  });

  const priceList = [
    {
      _id: 950,
      priceOne: 0.0,
      priceTwo: 49.99,
      label: "Under $50"
    },
    {
      _id: 951,
      priceOne: 50.0,
      priceTwo: 99.99,
      label: "$50 - $99"
    },
    {
      _id: 952,
      priceOne: 100.0,
      priceTwo: 199.99,
      label: "$100 - $199"
    },
    {
      _id: 953,
      priceOne: 200.0,
      priceTwo: 399.99,
      label: "$200 - $399"
    },
    {
      _id: 954,
      priceOne: 400.0,
      priceTwo: 599.99,
      label: "$400 - $599"
    },
    {
      _id: 955,
      priceOne: 600.0,
      priceTwo: 1000.0,
      label: "$600+"
    },
  ];

  const handlePriceRangeClick = (priceOne, priceTwo) => {
    onPriceChange(priceOne.toString(), priceTwo.toString());
  };

  const handleCustomRangeChange = (field, value) => {
    setCustomRange(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomRange = () => {
    if (customRange.min || customRange.max) {
      onPriceChange(customRange.min, customRange.max);
    }
  };

  const clearPriceFilter = () => {
    onPriceChange('', '');
    setCustomRange({ min: '', max: '' });
  };

  const isRangeSelected = (priceOne, priceTwo) => {
    return selectedPriceRange?.lowPrice === priceOne.toString() && 
           selectedPriceRange?.highPrice === priceTwo.toString();
  };
  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {/* Clear filter option */}
          <li
            className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
              !selectedPriceRange?.lowPrice && !selectedPriceRange?.highPrice ? 'text-primeColor font-semibold' : ''
            }`}
            onClick={clearPriceFilter}
          >
            All Prices
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
          <h4 className="text-sm font-semibold mb-3 text-primeColor">Custom Price Range</h4>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              placeholder="Min"
              value={customRange.min}
              onChange={(e) => handleCustomRangeChange('min', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primeColor"
            />
            <span className="text-gray-400 self-center">-</span>
            <input
              type="number"
              placeholder="Max"
              value={customRange.max}
              onChange={(e) => handleCustomRangeChange('max', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primeColor"
            />
          </div>
          <button
            onClick={applyCustomRange}
            className="w-full py-2 bg-primeColor text-white text-sm rounded hover:bg-black duration-300"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Price;
