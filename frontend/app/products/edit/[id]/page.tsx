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

// --- Types
interface ProductData {
  name: string;
  categoryId: string;
  categoryName?: string;
  sellingPrice: number;
  costPrice: number;
  wholesalePrice?: number;
  stock?: number;
  unit?: string;
  hsn?: string;
  sku?: string;
  productNumber?: string;
  photo?: string | File;
  photos?: (string | File)[]; // multiple
}

interface Category {
  _id: string;
  name: string;
}

// --- Simple Toast system
type Toast = { id: string; type: "success" | "error"; message: string };

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (t: Omit<Toast, "id">) => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2, 6);
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, 4000);
  };
  return { toasts, push };
}

// --- Simple SKU generator
const generateSKU = (name = "", category = "") => {
  const n =
    name
      .replace(/[^a-zA-Z0-9]+/g, "")
      .slice(0, 6)
      .toUpperCase() || "PRD";
  const c =
    category
      .replace(/[^a-zA-Z0-9]+/g, "")
      .slice(0, 3)
      .toUpperCase() || "GEN";
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${n}-${c}-${rand}`;
};

// --- Canvas crop helper
const cropImage = async (
  imageSrc: string,
  cropRect: { x: number; y: number; w: number; h: number }
) => {
  return new Promise<Blob | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropRect.w;
      canvas.height = cropRect.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(
        img,
        cropRect.x,
        cropRect.y,
        cropRect.w,
        cropRect.h,
        0,
        0,
        cropRect.w,
        cropRect.h
      );
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    };
    img.onerror = () => resolve(null);
    img.src = imageSrc;
  });
};

// --- Main component
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImgs, setPreviewImgs] = useState<Array<string | null>>([]);
  const [files, setFiles] = useState<Array<File | null>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toasts, push } = useToasts();

  // Cropper UI state
  const [cropOpenFor, setCropOpenFor] = useState<number | null>(null); // index
  const [cropDrawRect, setCropDrawRect] = useState<{
    startX: number;
    startY: number;
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  // fetch product & categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products/${productId}`),
          axios.get("/api/categories"),
        ]);

        const prod = prodRes.data;

        setProduct({
          name: prod.name || "",
          categoryId: prod.categoryId?._id || "",
          categoryName: prod.categoryId?.name || "",
          sellingPrice: prod.sellingPrice || 0,
          costPrice: prod.costPrice || 0,
          wholesalePrice: prod.wholesalePrice || 0,
          stock: prod.stock || 0,
          unit: prod.unit || "",
          hsn: prod.hsn || "",
          sku: prod.sku || "",
          productNumber: prod.productNumber || "",
          photo: prod.photo || "",
          photos: prod.photos || (prod.photo ? [prod.photo] : []),
        });

        const initialPhotos = (
          prod.photos && prod.photos.length
            ? prod.photos
            : prod.photo
            ? [prod.photo]
            : []
        ).slice(0, 6);
        setPreviewImgs(
          initialPhotos.map((p: any) => (typeof p === "string" ? p : null))
        );
        setFiles(initialPhotos.map(() => null));

        setCategories(catRes.data || []);
      } catch (err: any) {
        console.error(err);
        push({
          type: "error",
          message: "Failed to load product or categories",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  // validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (!product) return { valid: false, errors: e };
    if (!product.name || product.name.trim().length < 2)
      e.name = "Name is required (min 2 chars)";
    if (!product.sellingPrice || Number(product.sellingPrice) <= 0)
      e.sellingPrice = "Selling price must be greater than 0";
    if (!product.costPrice || Number(product.costPrice) <= 0)
      e.costPrice = "Cost price must be greater than 0";
    setErrors(e);
    return { valid: Object.keys(e).length === 0, errors: e };
  };

  // Auto SKU generation: when name or category changes and sku is empty or auto-generated
  useEffect(() => {
    if (!product) return;
    const shouldAuto =
      !product.sku || product.sku.startsWith("PRD") || product.sku === "";
    if (shouldAuto) {
      const newSku = generateSKU(
        product.name || "",
        product.categoryName || ""
      );
      setProduct((p) => (p ? { ...p, sku: newSku } : p));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.name, product?.categoryId]);

  const handleChange = (e: any) => {
    if (!product) return;
    const { name, value } = e.target;
    // keep categoryName in sync when categoryId changes
    if (name === "categoryId") {
      const cat = categories.find((c) => c._id === value);
      setProduct({
        ...product,
        categoryId: value,
        categoryName: cat?.name || "",
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // file input change (multiple/individual)
  const handleFileChange = (index: number, file: File | null) => {
    const nextFiles = [...files];
    const nextPreviews = [...previewImgs];
    nextFiles[index] = file;
    if (file) {
      nextPreviews[index] = URL.createObjectURL(file);
    } else {
      nextPreviews[index] = null;
    }
    setFiles(nextFiles);
    setPreviewImgs(nextPreviews);
  };

  const handleAddEmptySlot = () => {
    setFiles((s) => [...s, null].slice(0, 6));
    setPreviewImgs((s) => [...s, null].slice(0, 6));
  };

  const handleRemoveImage = (idx: number) => {
    const next = previewImgs.filter((_, i) => i !== idx);
    const nextFiles = files.filter((_, i) => i !== idx);
    setPreviewImgs(next);
    setFiles(nextFiles);
  };

  // Simple crop: user draws rectangle on canvas; crop applied to that preview index
  const openCropFor = (idx: number) => {
    setCropOpenFor(idx);
    setCropDrawRect(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (cropOpenFor === null) return;
    const canvas = cropCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const startX = Math.max(0, Math.round(e.clientX - rect.left));
    const startY = Math.max(0, Math.round(e.clientY - rect.top));
    setCropDrawRect({ startX, startY, x: startX, y: startY, w: 0, h: 0 });
  };
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (cropOpenFor === null || !cropDrawRect) return;
    const canvas = cropCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const curX = Math.max(0, Math.round(e.clientX - rect.left));
    const curY = Math.max(0, Math.round(e.clientY - rect.top));
    const x = Math.min(cropDrawRect.startX, curX);
    const y = Math.min(cropDrawRect.startY, curY);
    const w = Math.abs(curX - cropDrawRect.startX);
    const h = Math.abs(curY - cropDrawRect.startY);
    setCropDrawRect({ ...cropDrawRect, x, y, w, h });
  };
  const handleCanvasMouseUp = () => {
    // no-op (cropDrawRect already updated)
  };

  const handleApplyCrop = async () => {
    if (cropOpenFor === null) return;
    const idx = cropOpenFor;
    const src = previewImgs[idx];
    if (!src || !cropDrawRect)
      return push({ type: "error", message: "Select crop area first" });

    const canvas = cropCanvasRef.current!;
    // convert crop rect from canvas coords to image coords
    const img = cropImageRef.current!;
    const scaleX = img.naturalWidth / canvas.width;
    const scaleY = img.naturalHeight / canvas.height;
    const cropRect = {
      x: Math.round(cropDrawRect.x * scaleX),
      y: Math.round(cropDrawRect.y * scaleY),
      w: Math.round(cropDrawRect.w * scaleX),
      h: Math.round(cropDrawRect.h * scaleY),
    };

    const blob = await cropImage(src as string, cropRect);
    if (!blob) return push({ type: "error", message: "Crop failed" });
    const file = new File([blob], `crop-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    // replace file & preview
    const nextFiles = [...files];
    const nextPreviews = [...previewImgs];
    nextFiles[idx] = file;
    nextPreviews[idx] = URL.createObjectURL(file);
    setFiles(nextFiles);
    setPreviewImgs(nextPreviews);

    setCropOpenFor(null);
    setCropDrawRect(null);
    push({ type: "success", message: "Image cropped" });
  };

  // Save handler: build FormData with fields and multiple images
  const handleSave = async () => {
    if (!product) return;
    const { valid } = validate();
    if (!valid)
      return push({ type: "error", message: "Please fix validation errors" });

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name as any);
      formData.append("categoryId", product.categoryId as any);
      formData.append("sellingPrice", String(product.sellingPrice));
      formData.append("costPrice", String(product.costPrice));
      formData.append("wholesalePrice", String(product.wholesalePrice || "0"));
      formData.append("stock", String(product.stock || 0));
      formData.append("unit", product.unit || "");
      formData.append("sku", product.sku || "");

      // append images: files take precedence, otherwise skipped (server can keep existing)
      files.forEach((f, i) => {
        if (f) formData.append("photos", f);
      });

      // If user removed all images but there were existing previews, send empty flag to clear
      if (previewImgs.length === 0 && (!files || files.length === 0)) {
        formData.append("clearPhotos", "1");
      }

      await axios.put(`/api/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      push({ type: "success", message: "Product updated" });
      router.push("/products");
    } catch (err: any) {
      console.error(err);
      push({
        type: "error",
        message: err.response?.data?.message || "Update failed",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-400">Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-red-400">Product not found.</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/products"
          className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="text-xl font-semibold text-emerald-400">Edit Product</h1>
      </div>

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400">Product Name</label>
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              className={`w-full mt-1 bg-slate-800 border ${
                errors.name ? "border-red-500" : "border-slate-700"
              } rounded-lg p-2 text-slate-200`}
            />
            {errors.name && (
              <div className="text-xs text-red-400 mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-400">Category</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">Selling Price</label>
            <input
              name="sellingPrice"
              type="number"
              value={product.sellingPrice as any}
              onChange={handleChange}
              className={`w-full mt-1 bg-slate-800 border ${
                errors.sellingPrice ? "border-red-500" : "border-slate-700"
              } rounded-lg p-2 text-slate-200`}
            />
            {errors.sellingPrice && (
              <div className="text-xs text-red-400 mt-1">
                {errors.sellingPrice}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-400">Cost Price</label>
            <input
              name="costPrice"
              type="number"
              value={product.costPrice as any}
              onChange={handleChange}
              className={`w-full mt-1 bg-slate-800 border ${
                errors.costPrice ? "border-red-500" : "border-slate-700"
              } rounded-lg p-2 text-slate-200`}
            />
            {errors.costPrice && (
              <div className="text-xs text-red-400 mt-1">
                {errors.costPrice}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-400">Stock</label>
            <input
              name="stock"
              type="number"
              value={product.stock || 0}
              onChange={handleChange}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Unit</label>
            <input
              name="unit"
              value={product.unit || ""}
              onChange={handleChange}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">SKU Code</label>
            <input
              name="sku"
              value={product.sku || "Not Generated"}
              onChange={handleChange}
              className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-300"
            />
            <div className="text-xs text-slate-500 mt-1">
              Auto-generated from name & category (editable)
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Product Number</label>
            <input
              value={product.productNumber || ""}
              disabled
              className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-300"
            />
          </div>
        </div>

        {/* Images: multiple upload + preview + cropper */}
        <div className="mt-4">
          <label className="text-sm text-slate-400">Product Images</label>

          <div className="flex flex-wrap gap-3 mt-3">
            {previewImgs.map((src, idx) => (
              <div key={idx} className="w-32">
                <div className="w-32 h-32 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden relative">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={`img-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <ImageIcon />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <label className="text-xs bg-slate-800 px-2 py-1 rounded cursor-pointer border border-slate-700 text-slate-300">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(idx, e.target.files?.[0] || null)
                      }
                    />
                    Change
                  </label>

                  <button
                    type="button"
                    onClick={() => openCropFor(idx)}
                    className="text-xs text-slate-400 hover:text-emerald-400"
                  >
                    Crop
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {previewImgs.length < 6 && (
              <div className="w-32">
                <div className="w-32 h-32 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleFileChange(
                          previewImgs.length,
                          e.target.files?.[0] || null
                        );
                      }}
                    />
                    <div className="text-center text-xs">Add Image</div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cropper modal-like area (simple) */}
        {cropOpenFor !== null && (
          <div className="mt-4 border-t border-slate-700 pt-4">
            <div className="text-sm text-slate-400 mb-2">
              Draw a rectangle on the image below to crop (drag mouse)
            </div>
            <div className="bg-black/30 p-3 rounded">
              <div className="relative">
                <canvas
                  ref={cropCanvasRef}
                  width={600}
                  height={400}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  className="w-full max-w-full border border-slate-600 rounded"
                />
                <img
                  ref={cropImageRef}
                  src={previewImgs[cropOpenFor] || ""}
                  alt="crop-src"
                  onLoad={() => {
                    // draw image to canvas scaled to fit
                    const canvas = cropCanvasRef.current!;
                    const ctx = canvas.getContext("2d");
                    const img = cropImageRef.current!;
                    if (!ctx || !img) return;
                    // fit image into canvas
                    const cw = canvas.width;
                    const ch = canvas.height;
                    ctx.clearRect(0, 0, cw, ch);
                    // draw centered and cover
                    const ratio = Math.max(
                      cw / img.naturalWidth,
                      ch / img.naturalHeight
                    );
                    const w = img.naturalWidth * ratio;
                    const h = img.naturalHeight * ratio;
                    const x = (cw - w) / 2;
                    const y = (ch - h) / 2;
                    ctx.drawImage(img, x, y, w, h);
                    // reset any selection
                  }}
                  style={{ display: "none" }}
                />
                {/* Draw selection overlay */}
                {cropDrawRect && (
                  <div
                    style={{
                      position: "absolute",
                      left: cropDrawRect.x,
                      top: cropDrawRect.y,
                      width: cropDrawRect.w,
                      height: cropDrawRect.h,
                      border: "2px dashed #10B981",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleApplyCrop}
                  className="px-3 py-1 bg-emerald-600 text-white rounded"
                >
                  Apply Crop
                </button>
                <button
                  onClick={() => {
                    setCropOpenFor(null);
                    setCropDrawRect(null);
                  }}
                  className="px-3 py-1 bg-slate-700 text-slate-200 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}{" "}
            Save Changes
          </button>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed right-4 bottom-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow ${
              t.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
