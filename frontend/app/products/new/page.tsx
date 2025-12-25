"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Upload,
  Info,
  IndianRupee,
  Layers,
  ShieldCheck,
  Barcode,
  Tag,
  Box,
  Zap,
  Camera,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Select a category"),
  sellingPrice: z.string().min(1, "Selling price is required"),
  costPrice: z.string().min(1, "Cost price is required"),
  wholesalePrice: z.string().optional(),
  stock: z.string().min(1, "Opening stock required"),
  unit: z.string().min(1), // ✅ REQUIRED
  hsn: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function RedesignedAddProduct() {
  const [activeTab, setActiveTab] = useState("identity");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { unit: "pcs" },
  });

  const watchName = watch("name");
  const watchCategory = watch("categoryId");
  const watchPrice = watch("sellingPrice");

  // Step Progress Logic
  const steps = [
    { id: "identity", label: "Identity", icon: Tag },
    { id: "financials", label: "Financials", icon: IndianRupee },
    { id: "logistics", label: "Logistics", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* --- TOP PERSISTENT NAV --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                {watchName || "New Product"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Inventory Master Record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 mr-2 uppercase tracking-widest hidden md:block">
              Draft Autosaved
            </span>
            <button
              onClick={handleSubmit((data) => console.log(data))}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Save size={18} />
              Publish Product
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: FORM SECTION --- */}
        <div className="lg:col-span-8">
          {/* Navigation Steps */}
          <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === step.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <step.icon size={16} />
                {step.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {activeTab === "identity" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                      General Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="group">
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">
                          Product Name
                        </label>
                        <input
                          {...register("name")}
                          placeholder="e.g. Specialized Allez Sprint 2025"
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">
                            Category
                          </label>
                          <select
                            {...register("categoryId")}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none"
                          >
                            <option value="">Select Category</option>
                            <option value="cycles">Cycles</option>
                            <option value="parts">Spare Parts</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">
                            Brand
                          </label>
                          <input
                            placeholder="e.g. Shimano"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === "financials" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                    Price & Tax Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100">
                      <label className="text-sm font-bold text-blue-900 mb-3 block">
                        Selling Price (MRP)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-400">
                          ₹
                        </span>
                        <input
                          {...register("sellingPrice")}
                          className="w-full pl-10 pr-5 py-4 bg-white border-2 border-blue-200 rounded-2xl outline-none focus:border-blue-500 font-mono text-lg"
                        />
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                      <label className="text-sm font-bold text-slate-700 mb-3 block">
                        Cost Price (Landing)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          {...register("costPrice")}
                          className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-mono text-lg"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT: PREVIEW SIDEBAR --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Box className="text-blue-400" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">
                    Live Preview
                  </span>
                </div>

                <div className="space-y-1 mb-6">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">
                    Product Name
                  </p>
                  <h2 className="text-xl font-bold truncate">
                    {watchName || "Untitlied Product"}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                      Selling Price
                    </p>
                    <p className="font-mono text-lg">₹{watchPrice || "0.00"}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                      Category
                    </p>
                    <p className="text-sm font-bold text-blue-400 capitalize">
                      {watchCategory || "Not Set"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Barcode size={18} className="text-slate-500" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          System SKU
                        </p>
                        <p className="text-xs font-mono text-slate-300">
                          AUTO-GEN-4921
                        </p>
                      </div>
                    </div>
                    <Zap size={14} className="text-blue-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="mt-6 group relative cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 opacity-0 z-20 cursor-pointer"
              />
              <div className="h-48 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
                <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="text-slate-400 group-hover:text-blue-600" />
                </div>
                <p className="text-sm font-bold text-slate-600">
                  Upload Product Image
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
