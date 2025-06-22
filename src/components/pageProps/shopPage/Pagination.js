import React from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";

function Items({ products }) {
  return (
    <>
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
    </>
  );
}

const Pagination = ({ products, itemsPerPage, currentPage, totalProducts, onPageChange }) => {
  const pageCount = Math.ceil(totalProducts / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newPage = event.selected + 1; // ReactPaginate uses 0-based index
    onPageChange && onPageChange(newPage);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items products={products} />
      </div>
      {totalProducts > 0 && (
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
            forcePage={currentPage - 1} // ReactPaginate uses 0-based index
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
            Products from {startItem} to {endItem} of {totalProducts}
        </p>
      </div>
      )}
    </div>
  );
};

export default Pagination;
