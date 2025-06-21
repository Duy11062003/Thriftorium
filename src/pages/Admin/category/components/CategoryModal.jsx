import React, { useEffect, useState } from "react";

export default function CategoryModal({ open, onClose, onSave, category, mode }) {
  const [name, setName] = useState(category?.name || "");
  useEffect(() => {
    setName(category?.name || "");
  }, [category, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">{mode === "add" ? "Thêm danh mục" : "Sửa danh mục"}</h2>
        <label className="block font-medium mb-2">Tên danh mục
          <input className="w-full border p-2 rounded mt-1" placeholder="Tên danh mục" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onSave({ name })}>
          {mode === "add" ? "Thêm" : "Lưu"}
        </button>
      </div>
    </div>
  );
} 