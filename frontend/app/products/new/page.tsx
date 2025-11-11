"use client";
import { useState } from "react";

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    saleRate: "",
    stock: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        sku: form.sku,
        saleRate: Number(form.saleRate),
        stock: Number(form.stock),
      }),
    });
    alert("Product added!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="SKU"
          className="border p-2 rounded"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          type="number"
          placeholder="Sale Rate"
          className="border p-2 rounded"
          value={form.saleRate}
          onChange={(e) => setForm({ ...form, saleRate: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          className="border p-2 rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
