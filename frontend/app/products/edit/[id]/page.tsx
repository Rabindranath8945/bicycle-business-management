"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner"; // Using the sonner toast library
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Plus,
  Tag,
  Barcode,
  Hash,
  IndianRupee,
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
  description?: string; // Added from previous requests
}

interface Category {
  _id: string;
  name: string;
}

// ------------------------------
// Main Component
// ------------------------------
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

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
          description: p.description || "",
        });

        setPreviewImgs(p.photos || []);
        setCategories(catRes.data || []);
      } catch (err) {
        toast.error("Failed to load product");
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
    setProduct({ ...product, [name]: value });
  };

  // ------------------------------
  // File Handlers
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
    const dbPhotosCount = product!.photos!.length;

    previewsCopy.splice(index, 1);

    // If we removed a newly added file
    if (index >= dbPhotosCount) {
      filesCopy.splice(index - dbPhotosCount, 1);
    }
    // If we removed a database image, it stays removed from previews, newFiles list is untouched

    setPreviewImgs(previewsCopy);
    setNewFiles(filesCopy);

    // If all original DB photos are removed this way, we must signal a full clear to backend
    if (previewsCopy.length === 0 && dbPhotosCount > 0) setClearAll(true);
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
      Object.entries(product).forEach(([key, value]) => {
        if (value !== undefined && key !== "photos") {
          formData.append(key, String(value));
        }
      });

      // ---------- Clear all photos flag ----------
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

      toast.success("Product updated successfully");
      router.push("/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading product data...</div>;

  if (!product)
    return <div className="p-6 text-red-500">Product not found.</div>;

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto" // Increased max-width
    >
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            href="/products"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            Edit Product Record
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-lg font-bold text-sm shadow-md transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMN 1: CORE DETAILS */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-700">
              Core Information
            </h2>
            <Input
              label="Product Name"
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
              label="Unit of Measure"
              name="unit"
              value={product.unit}
              onChange={handleChange}
            />

            {/* ID Fields */}
            <div className="space-y-3 pt-4 border-t">
              <InputFieldReadonly icon={Tag} label="SKU" value={product.sku} />
              <InputFieldReadonly
                icon={Hash}
                label="Product Number"
                value={product.productNumber}
              />
            </div>
          </div>

          {/* COLUMN 2: PRICING & LOGISTICS */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-700">
              Pricing & Inventory
            </h2>
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
            <PriceInput
              label="Wholesale Price"
              name="wholesalePrice"
              value={product.wholesalePrice}
              onChange={handleChange}
              optional
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock on Hand"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
              />
              <Input
                label="HSN Code"
                name="hsn"
                value={product.hsn}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4 border-t">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                Description (Internal Notes)
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF]"
              />
            </div>
          </div>

          {/* COLUMN 3: IMAGES */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-700">
              Media Assets
            </h2>
            <ImageUploader
              previewImgs={previewImgs}
              onAddFile={handleAddFile}
              onRemoveImage={handleRemoveImage}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>

      {/* Placeholder for sonner toasts (will be rendered in a specific toast provider component elsewhere in your app) */}
      {/* {toasts.map(t => <div key={t.id}>{t.message}</div>)} */}
    </motion.div>
  );
}

// --- Helper Components ---

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}: any) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value || (type === "number" && value === 0 ? 0 : "")}
      onChange={onChange}
      disabled={disabled}
      className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF] ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    />
  </div>
);

const PriceInput = ({
  label,
  name,
  value,
  onChange,
  optional = false,
}: any) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
      {label}{" "}
      {optional && (
        <span className="text-gray-400 normal-case">(Optional)</span>
      )}
    </label>
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#007BFF] transition-all">
      <span className="pl-4 text-gray-400 font-bold">
        <IndianRupee size={14} />
      </span>
      <input
        name={name}
        type="number"
        value={value || (value === 0 ? 0 : "")}
        onChange={onChange}
        className="w-full bg-transparent px-3 py-3 outline-none text-sm font-bold"
        placeholder="0.00"
      />
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF]"
    >
      <option value="">Select an option</option>
      {options.map((opt: Category) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const InputFieldReadonly = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
    <div className="p-2 bg-white rounded-md text-[#007BFF] shadow-sm">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[9px] text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-xs font-mono text-slate-700">{value || "N/A"}</p>
    </div>
  </div>
);

const ImageUploader = ({
  previewImgs,
  onAddFile,
  onRemoveImage,
  onClearAll,
}: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(onAddFile);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input field
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {previewImgs.length} images uploaded
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            disabled={previewImgs.length === 0}
          >
            Clear All
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-xs text-[#007BFF] hover:text-[#0056b3]"
          >
            <Plus size={14} /> Add Image
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-3">
        {previewImgs.map((imgUrl: string, index: number) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
          >
            <img
              src={imgUrl}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute top-1 right-1 p-1 bg-white/70 backdrop-blur-sm rounded-full shadow-md text-red-500 hover:bg-white transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {previewImgs.length === 0 && (
          <div
            className="col-span-3 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#007BFF]/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={24} className="text-gray-400 mb-2" />
            <span className="text-xs text-gray-500">
              Upload your product images
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
