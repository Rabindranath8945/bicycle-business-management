"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Edit,
  Trash2,
  PlusCircle,
  Layers,
  Tag,
  PackageOpen,
} from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  stock?: number;
  hsn?: string;
  image?: string;
  createdAt?: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/products");
        setProducts(res.data || []);
        setFiltered(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e: any) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      products.filter(
        (p) =>
          p.name?.toLowerCase().includes(value) ||
          p.category?.toLowerCase().includes(value) ||
          p.hsn?.toLowerCase().includes(value)
      )
    );
  };

  if (loading)
    return (
      <div className="p-6 text-gray-400 text-center">Loading products...</div>
    );
  if (error)
    return (
      <div className="p-6 text-red-500 text-center">
        Error loading products: {error}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-400">
            Product Inventory
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your product catalog, stock, and pricing efficiently.
          </p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-md transition"
        >
          <PlusCircle size={18} />
          Add Product
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search products by name, category, or HSN..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          <PackageOpen className="mx-auto mb-3 text-slate-500" size={40} />
          No products found.
        </div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map((p) => (
            <motion.div
              key={p._id}
              layout
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 shadow-lg hover:border-emerald-500/50 transition relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="text-emerald-400" size={20} />
                  <h2 className="text-base font-semibold text-white truncate">
                    {p.name || "Unnamed"}
                  </h2>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    (p.stock ?? 0) > 10
                      ? "bg-emerald-600/20 text-emerald-400"
                      : (p.stock ?? 0) > 0
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-red-600/20 text-red-400"
                  }`}
                >
                  {(p.stock ?? 0) > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <p className="text-sm text-slate-400 truncate">
                {p.category || "No Category"}
              </p>

              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Tag size={15} />₹{Number(p.price ?? 0).toFixed(2)}
                </div>
                <span className="text-xs text-slate-400">
                  HSN: {p.hsn || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                <Link
                  href={`/products/edit/${p._id}`}
                  className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 text-sm"
                >
                  <Edit size={15} /> Edit
                </Link>
                <button className="text-slate-400 hover:text-red-500 transition flex items-center gap-1 text-sm">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
