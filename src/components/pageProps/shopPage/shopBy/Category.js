import React, { useState, useEffect } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import CategoryService from "../../../../service/CategoryService";

const Category = ({ selectedCategory, onCategoryChange }) => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoryData = await CategoryService.getAllCategory();
        setCategories(categoryData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="w-full">
      <NavTitle title="Danh mục" icons={false} />
      <div>
        {loading ? (
          <div className="text-sm text-gray-500 py-2">Loading categories...</div>
        ) : (
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {/* All Categories option */}
            <li
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300 ${
                !selectedCategory || selectedCategory === '' ? 'text-primeColor font-semibold' : ''
              }`}
              onClick={() => onCategoryChange('')}
            >
              Tất cả danh mục
            </li>
            {categories.map(({ categoryID, name }) => (
              <li
                key={categoryID}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300 ${
                  selectedCategory === categoryID.toString() ? 'text-primeColor font-semibold' : ''
                }`}
                onClick={() => onCategoryChange(categoryID.toString())}
              >
                {name}
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
};

export default Category;
