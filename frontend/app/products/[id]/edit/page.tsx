"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image,
  Trash2,
  Plus,
  Zap,
  Tag,
  Barcode,
  Hash,
  IndianRupee,
  AlertTriangle,
  Box,
  RefreshCw,
  ShieldCheck,
  Info,
} from "lucide-react";
import { toast } from "sonner";

// --- Types (Mocked Data/Types for simulation) ---
interface ProductData {
  name: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  sku: string;
  productNumber: string;
  photos: string[];
}
interface Category {
  _id: string;
  name: string;
}

// --- Helper Components (Stylized Inputs) ---
const Input = ({ label, name, value, onChange, readOnly = false }: any) => (
  <div>
    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full px-4 py-3 rounded-xl border transition-all ${
        readOnly
          ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
          : "bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
      }`}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all appearance-none"
    >
      {options.map((opt: Category) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const PriceInput = ({ label, name, value, onChange }: any) => (
  <div>
    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
      {label}
    </label>
    <div className="relative">
      <IndianRupee
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        name={name}
        value={value}
        onChange={onChange}
        type="number"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 font-mono"
      />
    </div>
  </div>
);

// --- Main Component ---
export default function EditProductPage() {
  const [product, setProduct] = useState<ProductData>({
    // Using mock initial data
    name: "Mountain Bike X1 (2025 Edition)",
    sellingPrice: 12000.0,
    costPrice: 8000.0,
    stock: 15,
    sku: "BIKE-X1-MTN",
    productNumber: "PRD-5678",
    photos: ["url-to-img-1", "url-to-img-2"], // Mock image URLs
  });
  const [categories, setCategories] = useState<Category[]>([
    { _id: "cat1", name: "Bikes" },
    { _id: "cat2", name: "Accessories" },
  ]);

  const [saving, setSaving] = useState(false);
  const [previewImgs, setPreviewImgs] = useState<string[]>(product.photos);

  // --- Handlers (Mocked functionality) ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    toast.info("Saving product updates...");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Product updated successfully!");
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = previewImgs.filter((_, i) => i !== index);
    setPreviewImgs(updatedPreviews);
    toast.warning("Image marked for deletion upon save.");
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear ALL photos? This action requires a save to apply."
      )
    ) {
      setPreviewImgs([]);
    }
  };

  // --- UI ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="p-3 bg-white hover:bg-slate-100 rounded-lg text-slate-500 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            Edit: {product.name}
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT & CENTER COLUMNS (Editable Sections) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1: COMMERCIAL DETAILS (Editable) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Zap size={20} className="text-blue-500" /> Commercial Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                />
              </div>
              <PriceInput
                label="Selling Price"
                name="sellingPrice"
                value={product.sellingPrice}
                onChange={handleChange}
              />
              <PriceInput
                label="Cost Price"
                name="costPrice"
                value={product.costPrice}
                onChange={handleChange}
              />
              <Select
                label="Category"
                name="categoryId"
                value={"cat1"}
                onChange={handleChange}
                options={categories}
              />
              <Input
                label="HSN Code"
                name="hsn"
                value="8711.60"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 2: PRODUCT MEDIA (Editable) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                <Image size={20} className="text-purple-500" /> Product Media
              </h2>
              {previewImgs.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {previewImgs.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={imgUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                    aria-label="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                  {index >= product.photos.length && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      New
                    </span>
                  )}
                </div>
              ))}
              {/* Upload Button Placeholder */}
              <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-500 bg-slate-50 transition-colors group">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Plus
                  size={32}
                  className="text-slate-400 group-hover:text-blue-600 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Read-only/Status) --- */}
        <div className="space-y-8">
          {/* SECTION 3: PRODUCT IDENTITY (Locked/Read-only) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <ShieldCheck size={20} className="text-green-500" /> Product
              Identity
            </h2>
            <div className="space-y-5">
              <Input
                readOnly
                label="SKU (Stock Keeping Unit)"
                name="sku"
                value={product.sku}
              />
              <Input
                readOnly
                label="Product Number"
                name="productNumber"
                value={product.productNumber}
              />
            </div>
            <p className="text-xs text-slate-400 mt-4 italic flex items-center gap-2">
              <Info size={12} /> These identifiers cannot be changed once
              created.
            </p>
          </div>

          {/* SECTION 4: INVENTORY SUMMARY (Read-only status card) */}
          <div
            className={`bg-white border rounded-2xl p-8 shadow-md ${
              product.stock < 20
                ? "border-amber-400/50 bg-amber-50/50"
                : "border-slate-200"
            }`}
          >
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3">
              <Box size={20} className="text-blue-500" /> Current Inventory
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-5xl font-extrabold text-slate-900">
                {product.stock}
              </span>
              <button
                className="text-slate-400 hover:text-blue-500 transition-colors"
                title="Refresh stock data"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              {product.stock < 20 && (
                <AlertTriangle size={18} className="text-amber-500" />
              )}
              <p className="text-sm font-semibold text-slate-600">
                {product.stock <= 0
                  ? "Out of Stock"
                  : product.stock < 20
                  ? "Low stock warning"
                  : "In stock"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
