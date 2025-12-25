"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Package,
  Edit,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Tag,
  Barcode,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---
type Product = {
  _id: string;
  name: string;
  categoryName?: string;
  stock: number;
  salePrice: number;
  costPrice: number;
  wholesalePrice: number;
  sku: string;
  barcode: string;
  productNumber: string;
  status: "Active" | "Discontinued";
  type: "Stockable" | "Consumable" | "Service";
};

export default function RedesignedProductPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Mock Data
  const products: Product[] = [
    {
      _id: "1",
      name: "Mountain Bike X1",
      categoryName: "Cycles",
      stock: 15,
      salePrice: 12000,
      costPrice: 8000,
      wholesalePrice: 9500,
      sku: "MB-01",
      barcode: "12345",
      productNumber: "P-001",
      status: "Active",
      type: "Stockable",
    },
    {
      _id: "2",
      name: "Chain Lube",
      categoryName: "Accessories",
      stock: 0,
      salePrice: 450,
      costPrice: 200,
      wholesalePrice: 280,
      sku: "CL-05",
      barcode: "67890",
      productNumber: "P-002",
      status: "Active",
      type: "Consumable",
    },
  ];

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 font-sans">
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Inventory Control
          </h1>
          <p className="text-gray-500 mt-1">
            Manage cycles, parts, and services from a central hub.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium shadow-sm">
            <Download size={18} /> Export
          </button>
          <Link
            href="/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md shadow-blue-200"
          >
            <Plus size={18} /> New Product
          </Link>
        </div>
      </header>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name, SKU, or barcode..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {["All", "Cycles", "Parts", "Services"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all border border-gray-100">
            <Filter size={16} /> Advanced Filters
          </button>
        </div>
      </div>

      {/* 3. PRODUCT TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked
                        ? new Set(products.map((p) => p._id))
                        : new Set()
                    )
                  }
                />
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product Info
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Identifiers
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Pricing (Sale/Whsl)
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Availability
              </th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr
                key={product._id}
                className="group hover:bg-blue-50/30 transition-colors"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product._id)}
                    onChange={() => toggleSelect(product._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-200">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 leading-tight">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {product.categoryName} • {product.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded w-fit">
                      <Tag size={10} /> {product.sku}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                      <Barcode size={10} /> {product.barcode}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-mono font-bold text-gray-900 text-sm">
                    ₹{product.salePrice.toLocaleString()}
                  </div>
                  <div className="font-mono text-xs text-gray-400 mt-1">
                    Wh: ₹{product.wholesalePrice.toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        product.stock > 10
                          ? "bg-emerald-50 text-emerald-600"
                          : product.stock > 0
                          ? "bg-amber-50 text-amber-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {product.stock} On Hand
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-[10px] text-amber-500 flex items-center gap-1">
                        <AlertCircle size={10} /> Low Stock
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/products/edit/${product._id}`}
                      className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-gray-200"
                    >
                      <Edit size={16} />
                    </Link>
                    <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-600 transition-all border border-transparent hover:border-gray-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. FLOATING BULK ACTIONS BAR (2025 Trend) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 z-50 ring-1 ring-white/10"
          >
            <div className="flex items-center gap-3 pr-8 border-r border-white/10">
              <span className="bg-blue-500 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                {selectedIds.size}
              </span>
              <span className="text-sm font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
                <CheckCircle2 size={18} /> Activate
              </button>
              <button className="flex items-center gap-2 text-sm font-medium hover:text-amber-400 transition-colors">
                <XCircle size={18} /> Deactivate
              </button>
              <button className="flex items-center gap-2 text-sm font-medium hover:text-red-400 transition-colors">
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
