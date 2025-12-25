"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Tag,
  Barcode,
  Settings2,
  Layers,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  Hash,
  Box,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---
type Variant = {
  id: string;
  attributes: { size: string; color: string; gear?: string };
  sku: string;
  barcode: string;
  stock: number;
  isActive: boolean;
};

export default function ProductVariantsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      attributes: { size: "Medium", color: "Matte Black", gear: "21 Speed" },
      sku: "MTB-M-BLK-21",
      barcode: "890001",
      stock: 12,
      isActive: true,
    },
    {
      id: "2",
      attributes: { size: "Large", color: "Matte Black", gear: "21 Speed" },
      sku: "MTB-L-BLK-21",
      barcode: "890002",
      stock: 5,
      isActive: true,
    },
    {
      id: "3",
      attributes: { size: "Small", color: "Glossy Red", gear: "7 Speed" },
      sku: "MTB-S-RED-07",
      barcode: "890003",
      stock: 0,
      isActive: false,
    },
  ]);

  const toggleVariantStatus = (id: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
    toast.info("Variant status updated");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 font-sans">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Configure Variants
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Mountain Bike X1 (2025 Edition)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 1000);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-sm font-semibold"
            >
              {isGenerating ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Layers size={16} />
              )}
              Regenerate Matrix
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-100">
              <Save size={18} /> Save Variants
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT: ATTRIBUTE CONFIGURATION --- */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings2 size={16} /> Active Attributes
              </h3>

              <div className="space-y-4">
                {["Size", "Color", "Gear Type"].map((attr) => (
                  <div
                    key={attr}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700">
                        {attr}
                      </span>
                      <button className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200 font-bold text-blue-600 hover:bg-blue-50">
                        EDIT
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white text-xs font-medium rounded-lg border border-slate-200 text-slate-600">
                        Small
                      </span>
                      <span className="px-3 py-1 bg-white text-xs font-medium rounded-lg border border-slate-200 text-slate-600">
                        Medium
                      </span>
                      <span className="px-3 py-1 bg-white text-xs font-medium rounded-lg border border-slate-200 text-slate-600">
                        Large
                      </span>
                      <button className="px-2 py-1 text-blue-600">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                  <Info size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Adding a new attribute will recalculate the variant matrix.
                    Ensure all current SKUs are saved before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* --- RIGHT: VARIANT MATRIX TABLE --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">
                  Variant Matrix
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {variants.length} Combinations Generated
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Combination
                      </th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Identifiers
                      </th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                        Snapshot
                      </th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {variants.map((v) => (
                      <tr
                        key={v.id}
                        className={`group transition-colors ${
                          v.isActive
                            ? "hover:bg-blue-50/30"
                            : "bg-slate-50/50 opacity-60"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">
                              {v.attributes.size} / {v.attributes.color}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {v.attributes.gear || "Standard Gear"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Tag size={12} className="text-slate-300" />
                              <input
                                defaultValue={v.sku}
                                className="text-xs font-mono bg-transparent border-b border-transparent focus:border-blue-400 outline-none w-full py-0.5"
                                placeholder="Enter SKU"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Barcode size={12} className="text-slate-300" />
                              <input
                                defaultValue={v.barcode}
                                className="text-xs font-mono bg-transparent border-b border-transparent focus:border-blue-400 outline-none w-full py-0.5"
                                placeholder="Enter Barcode"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`text-sm font-bold ${
                                v.stock > 0 ? "text-slate-900" : "text-red-500"
                              }`}
                            >
                              {v.stock}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              On Hand
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleVariantStatus(v.id)}
                            className={`p-2 rounded-xl transition-all ${
                              v.isActive
                                ? "text-emerald-500 bg-emerald-50"
                                : "text-slate-400 bg-slate-200"
                            }`}
                          >
                            {v.isActive ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <XCircle size={20} />
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  <Plus size={18} /> Add Custom Variant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
