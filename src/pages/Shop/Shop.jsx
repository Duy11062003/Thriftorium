import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import Product from "../../components/home/Products/Product";
import ProductService from "../../service/ProductService";

const Shop = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // State for individual filters
  const [searchFilter, setSearchFilter] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [lowPriceFilter, setLowPriceFilter] = useState(searchParams.get('lowPrice') || '');
  const [highPriceFilter, setHighPriceFilter] = useState(searchParams.get('highPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Combined filters for API call - memoized to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    search: searchFilter,
    category: categoryFilter,
    lowPrice: lowPriceFilter,
    highPrice: highPriceFilter,
    sortBy: sortBy
  }), [searchFilter, categoryFilter, lowPriceFilter, highPriceFilter, sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', newSortBy);
    setSearchParams(newParams);
  };

  const handleFiltersChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (newFilters.search !== undefined) {
      setSearchFilter(newFilters.search);
      if (newFilters.search) {
        newParams.set('search', newFilters.search);
      } else {
        newParams.delete('search');
      }
    }
    
    if (newFilters.category !== undefined) {
      setCategoryFilter(newFilters.category);
      if (newFilters.category) {
        newParams.set('category', newFilters.category);
      } else {
        newParams.delete('category');
      }
    }
    
    if (newFilters.lowPrice !== undefined) {
      setLowPriceFilter(newFilters.lowPrice);
      if (newFilters.lowPrice) {
        newParams.set('lowPrice', newFilters.lowPrice);
      } else {
        newParams.delete('lowPrice');
      }
    }
    
    if (newFilters.highPrice !== undefined) {
      setHighPriceFilter(newFilters.highPrice);
      if (newFilters.highPrice) {
        newParams.set('highPrice', newFilters.highPrice);
      } else {
        newParams.delete('highPrice');
      }
    }
    
    setSearchParams(newParams);
  };

  // Handle price range filter
  const handlePriceRangeChange = (lowPrice, highPrice) => {
    handleFiltersChange({ 
      lowPrice: lowPrice || '', 
      highPrice: highPrice || '' 
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchFilter('');
    setCategoryFilter('');
    setLowPriceFilter('');
    setHighPriceFilter('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          sortBy: filters.sortBy,
          ...(filters.search && { search: filters.search }),
          ...(filters.category && { category: filters.category }),
          ...(filters.lowPrice && { lowPrice: parseFloat(filters.lowPrice) }),
          ...(filters.highPrice && { highPrice: parseFloat(filters.highPrice) })
        };

        const data = await ProductService.getProductsBase(params);
        setProducts(data ?? []);
        setTotalProducts(data?.length || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Update filters when URL parameters change (e.g., when clicking category in header)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlLowPrice = searchParams.get('lowPrice') || '';
    const urlHighPrice = searchParams.get('highPrice') || '';
    const urlSortBy = searchParams.get('sortBy') || 'newest';

    // Only update if values are different to avoid unnecessary re-renders
    if (urlSearch !== searchFilter) setSearchFilter(urlSearch);
    if (urlCategory !== categoryFilter) setCategoryFilter(urlCategory);
    if (urlLowPrice !== lowPriceFilter) setLowPriceFilter(urlLowPrice);
    if (urlHighPrice !== highPriceFilter) setHighPriceFilter(urlHighPrice);
    if (urlSortBy !== sortBy) setSortBy(urlSortBy);
  }, [searchParams, searchFilter, categoryFilter, lowPriceFilter, highPriceFilter, sortBy]);

  // Check if any filters are active
  const hasActiveFilters = searchFilter || categoryFilter || lowPriceFilter || highPriceFilter || sortBy !== 'newest';

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Sản phẩm" />
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
            
            {searchFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Tìm kiếm: {searchFilter}
                <button 
                  onClick={() => handleFiltersChange({ search: '' })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {categoryFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Danh mục: {categoryFilter}
                <button 
                  onClick={() => handleFiltersChange({ category: '' })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {(lowPriceFilter || highPriceFilter) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Giá: {lowPriceFilter ? `${parseInt(lowPriceFilter).toLocaleString()}đ` : '0đ'} - {highPriceFilter ? `${parseInt(highPriceFilter).toLocaleString()}đ` : '∞'}
                <button 
                  onClick={() => handlePriceRangeChange('', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                Sắp xếp: {sortBy}
                <button 
                  onClick={() => handleSortChange('newest')}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          
          <button 
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav 
            filters={{
              category: categoryFilter,
              lowPrice: lowPriceFilter,
              highPrice: highPriceFilter
            }}
            onFiltersChange={handleFiltersChange}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner 
            onSortChange={handleSortChange}
            currentSort={sortBy}
            totalProducts={totalProducts}
            searchTerm={searchFilter}
          />
          
          {/* Mobile Filter Button */}
          <div className="mdl:hidden mb-4">
            <button 
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={() => {
                // You can implement a mobile filter modal here
                alert('Mobile filter modal - implement as needed');
              }}
            >
              Bộ lọc & Sắp xếp
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg">Đang tải sản phẩm...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
              {products && products.length > 0 ? (
                products.map((item) => (
                  <div key={item.productId} className="w-full">
                    <Product
                      _id={item.productId}
                      img={item.imageProducts?.[0]?.image || '/placeholder-image.jpg'}
                      productName={item.name}
                      price={item.purchasePrice}
                      color={item.color}
                      badge={item.badge}
                      des={item.description}
                      category={item.category?.name}
                      averageRating={item.averageRating}
                      totalRatings={item.ratings?.length || 0}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-gray-500">
                    {hasActiveFilters 
                      ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc" 
                      : "Không tìm thấy sản phẩm nào"
                    }
                  </p>
                  {hasActiveFilters && (
                    <button 
                      onClick={clearAllFilters}
                      className="mt-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Xóa bộ lọc và xem tất cả sản phẩm
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;