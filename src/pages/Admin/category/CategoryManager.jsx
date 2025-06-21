import React, { useEffect, useState } from "react";
import CategoryService from "../../../service/CategoryService";
import { toast } from "react-toastify";
import CategoryModal from "./components/CategoryModal";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: "add", category: null });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAllCategory();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Không thể tải danh sách danh mục");
      setCategories([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (cat) => {
    try {
      await CategoryService.createCategory(cat);
      toast.success("Thêm danh mục thành công");
      setModal({ open: false });
      fetchCategories();
    } catch {
      toast.error("Thêm danh mục thất bại");
    }
  };
  const handleEdit = async (cat) => {
    try {
      await CategoryService.updateCategory(modal.category.categoryID, cat);
      toast.success("Cập nhật danh mục thành công");
      setModal({ open: false });
      fetchCategories();
    } catch {
      toast.error("Cập nhật danh mục thất bại");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await CategoryService.deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch {
      toast.error("Xóa danh mục thất bại");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý danh mục</h1>
      <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded" onClick={() => setModal({ open: true, mode: "add", category: null })}>
        Thêm danh mục
      </button>
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tên danh mục</th>
              <th className="border p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.categoryID}>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2 space-x-2">
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded" onClick={() => setModal({ open: true, mode: "edit", category: c })}>Sửa</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(c.categoryID)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <CategoryModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        onSave={modal.mode === "add" ? handleAdd : handleEdit}
        category={modal.category}
        mode={modal.mode}
      />
    </div>
  );
} 