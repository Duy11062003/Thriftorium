import React, { useEffect, useState } from "react";
import CategoryService from "../../../../service/CategoryService";

const defaultProduct = {
  name: "",
  inventoryQuantity: 0,
  description: "",
  unitPrice: 0,
  purchasePrice: 0,
  supplier: "",
  original: "",
  status: true,
  categoryID: 0,
  imageProducts: [],
};

export default function ProductModal({ open, onClose, onSave, product, mode }) {
  const [form, setForm] = useState(product || defaultProduct);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const initForm = product
      ? {
          ...defaultProduct,
          ...product,
          categoryID: product.category?.categoryID ?? 0,
        }
      : defaultProduct;
    setForm(initForm);
  }, [product, open]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategory();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    };
    if (open) fetchCategories();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[70vh] overflow-y-auto">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {mode === "add"
            ? "Thêm sản phẩm"
            : mode === "edit"
            ? "Sửa sản phẩm"
            : "Chi tiết sản phẩm"}
        </h2>
        <div className="space-y-3">
          <label className="block font-medium">
            Tên sản phẩm
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Danh mục
            <select
              className="w-full border p-2 rounded mt-1"
              value={form.categoryID}
              onChange={(e) => {
                console.log(e.target.value);
                const newCategoryID = parseInt(e.target.value) || 0;
                setForm((f) => ({ ...f, categoryID: newCategoryID }));
              }}
              disabled={mode === "view"}
            >
              <option value={0}>Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.categoryID} value={cat.categoryID}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block font-medium">
            Số lượng
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Số lượng"
              type="number"
              value={form.inventoryQuantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, inventoryQuantity: e.target.value }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Giá bán
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Giá bán"
              type="number"
              value={form.unitPrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, unitPrice: e.target.value }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Giá nhập
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Giá nhập"
              type="number"
              value={form.purchasePrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, purchasePrice: e.target.value }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Nhà cung cấp
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Nhà cung cấp"
              value={form.supplier}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplier: e.target.value }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Xuất xứ
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Xuất xứ"
              value={form.original}
              onChange={(e) =>
                setForm((f) => ({ ...f, original: e.target.value }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Mô tả
            <textarea
              className="w-full border p-2 rounded mt-1"
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="block font-medium">
            Ảnh (URL)
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Ảnh (URL)"
              value={form.imageProducts[0]?.image || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  imageProducts: [{ image: e.target.value }],
                }))
              }
              disabled={mode === "view"}
            />
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.checked }))
              }
              disabled={mode === "view"}
            />
            <span>Kích hoạt</span>
          </label>
        </div>
        {mode !== "view" && (
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onSave(form)}
          >
            {mode === "add" ? "Thêm" : "Lưu"}
          </button>
        )}
      </div>
    </div>
  );
}
