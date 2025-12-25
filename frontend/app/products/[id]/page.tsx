"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Package,
  IndianRupee,
  Layers,
  MapPin,
  List,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Tag,
  Barcode,
  Hash,
  Activity,
  Box,
} from "lucide-react";

// --- Mock Types & Data ---
interface ProductDetailsType {
  _id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  productNumber: string;
  status: "Active" | "Discontinued";
  type: "Stockable" | "Service";
  salePrice: number;
  costPrice: number;
  wholesalePrice: number;
  stockOnHand: number;
  stockAvailable: number;
  totalValue: number;
}

const mockProduct: ProductDetailsType = {
  _id: "p1",
  name: "Mountain Bike X1 (2025 Edition)",
  category: "Cycles",
  brand: "Specialized",
  sku: "BIKE-X1-MTN",
  productNumber: "PRD-5678",
  status: "Active",
  type: "Stockable",
  salePrice: 12000.0,
  costPrice: 8000.0,
  wholesalePrice: 9500.0,
  stockOnHand: 18,
  stockAvailable: 15, // 3 are allocated to orders
  totalValue: 144000.0, // 18 * 8000
};

const stockMovements = [
  { id: 1, date: "2025-10-21", type: "IN", qty: 20, source: "PO#901" },
  { id: 2, date: "2025-10-22", type: "OUT", qty: 2, source: "SO#455" },
  { id: 3, date: "2025-10-23", type: "OUT", qty: 1, source: "SO#456" },
];

const stockByLocation = [
  { location: "Main Warehouse A1", onHand: 10, available: 8 },
  { location: "Store Front Display", onHand: 5, available: 5 },
  { location: "Service Center Bay 3", onHand: 3, available: 2 },
];

// --- Helper Components ---

// Data Card for quick stats
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
        {title}
      </p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
    <Icon size={32} className={`text-${color}-500 opacity-50`} />
  </div>
);

// --- Main Component ---
export default function ProductDetailsPage() {
  const product = mockProduct;

  const stockStatus =
    product.stockOnHand === 0
      ? "Out of Stock"
      : product.stockOnHand < 20
      ? "Low Stock"
      : "In Stock";
  const stockColor =
    product.stockOnHand === 0
      ? "text-red-600 bg-red-100 border-red-200"
      : product.stockOnHand < 20
      ? "text-amber-600 bg-amber-100 border-amber-200"
      : "text-emerald-600 bg-emerald-100 border-emerald-200";
  const StockIcon =
    product.stockOnHand === 0
      ? XCircle
      : product.stockOnHand < 20
      ? AlertTriangle
      : CheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pb-10"
    >
      {/* --- STICKY HEADER/NAV --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-3 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-4">
              <Box size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                {product.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${stockColor}`}
            >
              <StockIcon size={14} />
              {stockStatus}
            </span>
            <Link
              href={`/products/${product._id}/edit`}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md"
            >
              <Edit2 size={16} /> Edit Product
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: CORE INFO & PRICING --- */}
        <div className="lg:col-span-1 space-y-8">
          {/* 1. IDENTITY CARD (Read-Only Master Data) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Tag size={20} className="text-slate-500" /> Product Identity
            </h2>
            <div className="space-y-4">
              {[
                { label: "SKU", value: product.sku, icon: Barcode },
                {
                  label: "Product No.",
                  value: product.productNumber,
                  icon: Hash,
                },
                { label: "Category", value: product.category, icon: Layers },
                { label: "Brand", value: product.brand, icon: Zap },
                { label: "Type", value: product.type, icon: Box },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <item.icon size={16} className="text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      {item.label}
                    </p>
                    <p className="text-sm font-mono text-slate-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. PRICING CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <IndianRupee size={20} className="text-green-600" /> Pricing
              Strategy
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: "Selling Price",
                  value: product.salePrice,
                  color: "text-green-600",
                },
                {
                  label: "Wholesale Price",
                  value: product.wholesalePrice,
                  color: "text-slate-600",
                },
                {
                  label: "Cost Price (Avg)",
                  value: product.costPrice,
                  color: "text-red-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center pb-2 border-b border-slate-100 last:border-b-0"
                >
                  <p className="text-sm text-slate-600">{item.label}</p>
                  <p className={`text-lg font-mono font-bold ${item.color}`}>
                    ₹{item.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INVENTORY & MOVEMENTS --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3. STOCK SUMMARY STATS (The Cockpit Dashboard Section) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="On Hand"
              value={product.stockOnHand}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Available"
              value={product.stockAvailable}
              icon={CheckCircle}
              color="emerald"
            />
            <StatCard
              title="Total Valuation (Cost)"
              value={`₹${product.totalValue.toLocaleString()}`}
              icon={IndianRupee}
              color="purple"
            />
          </div>

          {/* 4. STOCK BY LOCATION */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <MapPin size={20} className="text-blue-500" /> Stock by Location
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      On Hand
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Available
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stockByLocation.map((item) => (
                    <tr key={item.location}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />{" "}
                        {item.location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-mono text-slate-700">
                        {item.onHand}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-mono text-slate-700">
                        {item.available}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. RECENT STOCK MOVEMENTS */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Activity size={20} className="text-purple-500" /> Recent
              Movements
            </h2>
            <ul className="space-y-4">
              {stockMovements.map((move) => (
                <li
                  key={move.id}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        move.type === "IN"
                          ? "bg-emerald-500/20 text-emerald-600"
                          : "bg-red-500/20 text-red-600"
                      }`}
                    >
                      {move.type}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {move.source}
                      </p>
                      <p className="text-xs text-slate-500">{move.date}</p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-mono font-bold ${
                      move.type === "IN" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {move.type === "IN" ? "+" : "-"}
                    {move.qty} units
                  </p>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full text-center text-blue-600 hover:text-blue-800 font-semibold text-sm">
              View All Stock History
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
