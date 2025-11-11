"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/categories"),
        ]);
        setProducts(prodRes.data);
        setFiltered(prodRes.data);
        setCategories(["All", ...catRes.data.map((c: any) => c.name)]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = products;
    if (category !== "All") {
      result = result.filter((p: any) => p.category === category);
    }
    if (search.trim() !== "") {
      result = result.filter(
        (p: any) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.hsn?.toLowerCase().includes(search.toLowerCase()) ||
          p.code?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, products]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p: any) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/products/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, HSN, or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="md:w-1/4 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">HSN</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((p: any) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.hsn || "-"}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-right">₹{p.price.toFixed(2)}</td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <Link
                      href={`/products/edit/${p._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
