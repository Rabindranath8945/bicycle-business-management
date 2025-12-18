"use client";

import { useEffect, useState, useMemo } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

// Define a type for sorting
type SortField = "name" | "createdAt" | "productCount";

export default function CategoryListPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  // Default sort is now alphabetic A -> Z
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("/api/categories/all-with-count");
      setCategories(res.data);
      setFiltered(res.data);
    } catch (error) {
      // toast.error("Failed to fetch categories");
    }
  };

  const handleSearch = (e: any) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      categories.filter((c: any) => c.name.toLowerCase().includes(val))
    );
  };

  // Sorting Logic (using useMemo for performance)
  const sorted = useMemo(() => {
    return [...filtered].sort((a: any, b: any) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "productCount") {
        // Sort numerically by product count
        comparison = (a.productCount || 0) - (b.productCount || 0);
      }

      return sortDirection === "desc" ? comparison * -1 : comparison;
    });
  }, [filtered, sortField, sortDirection]);

  const deleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(`/api/categories/${id}`);
      // toast.success("Category deleted successfully");
      load();
    } catch (error) {
      // toast.error("Failed to delete category");
    }
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortHeader = ({
    title,
    field,
  }: {
    title: string;
    field: SortField;
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900"
      onClick={() => handleSortChange(field)}
    >
      <div className="flex items-center gap-1">
        {title}
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          ))}
      </div>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 min-h-screen bg-[#F9FAFB] text-[#1E293B]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Product Categories
        </h1>

        <Link
          href="/categories/new"
          className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3] text-white px-4 py-2.5 rounded-lg shadow-md transition-colors"
        >
          <PlusCircle size={18} /> Add New Category
        </Link>
      </div>

      {/* Search Bar (Simplified sort selector was removed as sorting is now handled by table headers) */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 py-2.5 text-sm text-slate-700 outline-none focus:border-[#007BFF]"
          />
        </div>
      </div>

      {/* Category Table View */}
      {sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
          <PackageOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="font-semibold">
            No categories found matching your criteria.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortHeader title="Category Name" field="name" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <SortHeader title="Products" field="productCount" />
                  <SortHeader title="Date Created" field="createdAt" />
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorted.map((cat: any) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <Layers className="text-[#007BFF]" size={16} />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {cat.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 max-w-lg truncate">
                      {cat.description || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {cat.productCount || 0}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/categories/edit/${cat._id}`}
                          className="text-[#007BFF] hover:text-[#0056b3] p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edit Category"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => deleteCategory(cat._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
