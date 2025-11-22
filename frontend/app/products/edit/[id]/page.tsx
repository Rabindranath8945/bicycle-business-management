"use client";

import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";

// ------------------------------
// Types
// ------------------------------
interface ProductData {
  name: string;
  categoryId: string;
  sellingPrice: number;
  costPrice: number;
  wholesalePrice?: number;
  stock?: number;
  unit?: string;
  hsn?: string;
  sku?: string;
  productNumber?: string;
  photos?: string[];
}

interface Category {
  _id: string;
  name: string;
}

// ------------------------------
// Toast Helper
// ------------------------------
type Toast = { id: string; type: "success" | "error"; message: string };
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (t: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, 3500);
  };
  return { toasts, push };
}

// ------------------------------
// Main Component
// ------------------------------
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const { toasts, push } = useToasts();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [previewImgs, setPreviewImgs] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [clearAll, setClearAll] = useState(false);

  // ------------------------------
  // Load product + categories
  // ------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products/${productId}`),
          axios.get("/api/categories"),
        ]);

        const p = prodRes.data;

        setProduct({
          name: p.name,
          categoryId: p.categoryId?._id || "",
          sellingPrice: p.sellingPrice,
          costPrice: p.costPrice,
          wholesalePrice: p.wholesalePrice,
          stock: p.stock,
          unit: p.unit,
          hsn: p.hsn,
          sku: p.sku,
          productNumber: p.productNumber,
          photos: p.photos || [],
        });

        setPreviewImgs(p.photos || []);
        setCategories(catRes.data || []);
      } catch (err) {
        push({ type: "error", message: "Failed to load product" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  // ------------------------------
  // Handle field change
  // ------------------------------
  const handleChange = (e: any) => {
    if (!product) return;
    const { name, value } = e.target;

    if (name === "categoryId") {
      setProduct({ ...product, categoryId: value });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // ------------------------------
  // File Add
  // ------------------------------
  const handleAddFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewImgs((prev) => [...prev, url]);
    setNewFiles((prev) => [...prev, file]);
    setClearAll(false);
  };

  const handleRemoveImage = (index: number) => {
    const previewsCopy = [...previewImgs];
    const filesCopy = [...newFiles];

    // If image removed was an existing DB photo → remove from preview only
    // If image removed was a newly added file → remove from both
    previewsCopy.splice(index, 1);
    if (index >= product!.photos!.length) {
      filesCopy.splice(index - product!.photos!.length, 1);
    }

    setPreviewImgs(previewsCopy);
    setNewFiles(filesCopy);

    if (previewsCopy.length === 0) setClearAll(true);
  };

  const handleClearAll = () => {
    setPreviewImgs([]);
    setNewFiles([]);
    setClearAll(true);
  };

  // ------------------------------
  // Save Handler
  // ------------------------------
  const handleSave = async () => {
    if (!product) return;
    setSaving(true);

    try {
      const formData = new FormData();

      // ---------- Basic fields ----------
      formData.append("name", product.name);
      formData.append("categoryId", product.categoryId);
      formData.append("sellingPrice", String(product.sellingPrice));
      formData.append("costPrice", String(product.costPrice));
      formData.append("wholesalePrice", String(product.wholesalePrice || 0));
      formData.append("stock", String(product.stock || 0));
      formData.append("unit", product.unit || "");
      formData.append("hsn", product.hsn || "");
      formData.append("sku", product.sku || "");

      // ---------- Clear all photos ----------
      if (clearAll) {
        formData.append("clearPhotos", "1");
      }

      // ---------- Add new selected photos ----------
      newFiles.forEach((file) => {
        formData.append("photo", file);
      });

      await axios.put(`/api/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      push({ type: "success", message: "Product updated successfully" });
      router.push("/products");
    } catch (err: any) {
      push({
        type: "error",
        message: err.response?.data?.message || "Update failed",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 text-slate-400">Loading product...</div>;

  if (!product)
    return <div className="p-6 text-red-400">Product not found.</div>;

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-3xl mx-auto"
    >
      <Link
        className="text-slate-400 flex items-center gap-2 mb-4"
        href="/products"
      >
        <ArrowLeft size={18} /> Back
      </Link>

      <h1 className="text-xl font-semibold text-emerald-400 mb-4">
        Edit Product
      </h1>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        {/* --- Form Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <Select
            label="Category"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            options={categories}
          />
          <Input
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={product.sellingPrice}
            onChange={handleChange}
          />
          <Input
            label="Cost Price"
            name="costPrice"
            type="number"
            value={product.costPrice}
            onChange={handleChange}
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
          />
          <Input
            label="Unit"
            name="unit"
            value={product.unit}
            onChange={handleChange}
          />
          <Input
            label="HSN"
            name="hsn"
            value={product.hsn}
            onChange={handleChange}
          />

          <Input
            label="SKU"
            name="sku"
            value={product.sku}
            onChange={handleChange}
          />

          <Input
            label="Product Number"
            value={product.productNumber}
            disabled
          />
        </div>

        {/* ---------- IMAGES ---------- */}
        <div className="mt-6">
          <label className="text-sm text-slate-400">Product Images</label>

          <div className="flex flex-wrap gap-4 mt-3">
            {previewImgs.map((src, index) => (
              <div key={index} className="w-32">
                <div className="w-32 h-32 bg-slate-800 rounded border border-slate-600 overflow-hidden">
                  <img src={src} className="w-full h-full object-cover" />
                </div>
                <button
                  className="text-xs mt-2 text-red-400 flex items-center gap-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            ))}

            {/* Add image */}
            <div className="w-32">
              <label className="w-32 h-32 bg-slate-800 rounded border border-slate-700 flex items-center justify-center cursor-pointer text-slate-400">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleAddFile(e.target.files[0])
                  }
                />
                <ImageIcon />
              </label>
            </div>
          </div>

          {/* CLEAR ALL */}
          {previewImgs.length > 0 && (
            <button
              className="mt-3 text-sm text-red-400"
              onClick={handleClearAll}
            >
              Remove All Photos
            </button>
          )}
        </div>

        {/* SAVE BUTTON */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast messages */}
      <div className="fixed bottom-6 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow ${
              t.type === "success" ? "bg-emerald-600" : "bg-red-600"
            } text-white`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ------------------------------
// Reusable Inputs
// ------------------------------
function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        {...props}
        className="mt-1 w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200"
      >
        <option value="">Select Category</option>
        {options.map((o: any) => (
          <option key={o._id} value={o._id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
