import React from "react";
import Category from "./shopBy/Category";
import Price from "./shopBy/Price";

const ShopSideNav = ({ filters, onFiltersChange, onPriceRangeChange }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category 
        icons={false} 
        selectedCategory={filters.category}
        onCategoryChange={(category) => onFiltersChange({ category })}
      />
      <Price 
        lowPrice={filters.lowPrice}
        highPrice={filters.highPrice}
        onPriceRangeChange={onPriceRangeChange}
      />
    </div>
  );
};

export default ShopSideNav;