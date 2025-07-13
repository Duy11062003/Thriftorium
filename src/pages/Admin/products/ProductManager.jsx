import React, { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { toast } from "react-toastify";
import ProductModal from "./components/ProductModal";

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: "add", product: null });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAllProductManager();
      setProducts(data);
    } catch {
      toast.error("Không thể tải danh sách sản phẩm");
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (product) => {
    try {
      await ProductService.addProduct(product);
      toast.success("Thêm sản phẩm thành công");
      setModal({ open: false });
      fetchProducts();
    } catch {
      toast.error("Thêm sản phẩm thất bại");
    }
  };
  const handleEdit = async (product) => {
    try {
      await ProductService.updateProduct(product);
      toast.success("Cập nhật sản phẩm thành công");
      setModal({ open: false });
      fetchProducts();
    } catch {
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await ProductService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
    } catch {
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý sản phẩm</h1>
      <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded" onClick={() => setModal({ open: true, mode: "add", product: null })}>
        Thêm sản phẩm
      </button>
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tên</th>
              <th className="border p-2">Danh mục</th>
              <th className="border p-2">Số lượng</th>
              <th className="border p-2">Giá mua</th>
              <th className="border p-2">Nhà cung cấp</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.category?.name || "Chưa phân loại"}</td>
                <td className="border p-2">{p.inventoryQuantity}</td>
                <td className="border p-2">{p.unitPrice}</td>
                <td className="border p-2">{p.supplier}</td>
                <td className="border p-2">{p.status ? "Kích hoạt" : "Ẩn"}</td>
                <td className="border p-2 space-x-2">
                  <button className="bg-blue-400 text-white px-2 py-1 rounded" onClick={() => setModal({ open: true, mode: "view", product: p })}>Xem</button>
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded" onClick={() => setModal({ open: true, mode: "edit", product: p })}>Sửa</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(p.productID)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ProductModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        onSave={modal.mode === "add" ? handleAdd : handleEdit}
        product={modal.product}
        mode={modal.mode}
      />
    </div>
  );
} 