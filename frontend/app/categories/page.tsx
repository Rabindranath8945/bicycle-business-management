"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Layers,
  PackageOpen,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("/api/categories/all-with-count");
    setCategories(res.data);
    setFiltered(res.data);
  };

  const handleSearch = (e: any) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      categories.filter((c: any) => c.name.toLowerCase().includes(val))
    );
  };

  // Sorting
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (sort === "a-z") return a.name.localeCompare(b.name);
    if (sort === "z-a") return b.name.localeCompare(a.name);
    if (sort === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await axios.delete(`/api/categories/${id}`);
    load();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-emerald-400">Categories</h1>

        <Link
          href="/categories/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={18} /> Add Category
        </Link>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 py-2.5 text-sm text-slate-200"
          />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center">
          <Filter size={18} className="text-slate-400 mr-2" />
          <select
            className="bg-transparent text-slate-200 text-sm outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A → Z</option>
            <option value="z-a">Z → A</option>
          </select>
        </div>
      </div>

      {/* Category Cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <PackageOpen size={40} className="mx-auto mb-3 text-slate-500" />
          No categories found.
        </div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {sorted.map((cat: any) => (
            <motion.div
              key={cat._id}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-lg hover:border-emerald-500/50 transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
                  <Layers className="text-emerald-400" size={18} />
                </div>

                <h3 className="text-white text-lg font-semibold truncate">
                  {cat.name}
                </h3>
              </div>

              {/* Product Count */}
              <p className="text-xs text-slate-400 mb-1">
                Products:{" "}
                <span className="text-emerald-400">{cat.productCount}</span>
              </p>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2">
                {cat.description || "No description"}
              </p>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                <Link
                  href={`/categories/edit/${cat._id}`}
                  className="text-slate-300 hover:text-emerald-400 flex items-center gap-1 text-sm"
                >
                  <Edit size={15} /> Edit
                </Link>

                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="text-slate-300 hover:text-red-500 flex items-center gap-1 text-sm"
                >
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
