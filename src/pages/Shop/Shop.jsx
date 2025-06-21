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
  };

  const handleFiltersChange = (newFilters) => {
    if (newFilters.search !== undefined) setSearchFilter(newFilters.search);
    if (newFilters.category !== undefined) setCategoryFilter(newFilters.category);
    if (newFilters.lowPrice !== undefined) setLowPriceFilter(newFilters.lowPrice);
    if (newFilters.highPrice !== undefined) setHighPriceFilter(newFilters.highPrice);
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

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
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
          />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner 
            onSortChange={handleSortChange}
            currentSort={sortBy}
          />
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
                  <p className="text-lg text-gray-500">Không tìm thấy sản phẩm nào</p>
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
