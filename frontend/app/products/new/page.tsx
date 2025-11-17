"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  Layers,
  Upload,
  Tag,
  Barcode,
  Hash,
  FilePlus2,
  IndianRupee,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

//
// ✅ Zod Schema – matches backend fields
//
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Select a category"),
  sellingPrice: z.string().min(1, "Selling price is required"),
  costPrice: z.string().min(1, "Cost price is required"),
  wholesalePrice: z.string().optional(),
  stock: z.string().min(1, "Stock quantity required"),
  unit: z.string().min(1, "Unit required"),
  hsn: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [generatedCodes, setGeneratedCodes] = useState({
    sku: "",
    barcode: "",
    productNumber: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  //
  // 🔹 Fetch categories
  //
  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  //
  // 🔹 Auto-generate SKU / Barcode / Product Number when category selected
  //
  const categoryWatch = watch("categoryId");

  useEffect(() => {
    if (categoryWatch) {
      const selectedCat = categories.find((c) => c._id === categoryWatch);
      if (selectedCat) {
        const prefix = selectedCat.name.substring(0, 3).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        const sku = `${prefix}-${random}`;
        const barcode = `${Date.now().toString().slice(-6)}${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${String(
          date.getMonth() + 1
        ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
        const productNumber = `PRD${formattedDate}-${Math.floor(
          100 + Math.random() * 900
        )}`;

        setGeneratedCodes({ sku, barcode, productNumber });
      }
    }
  }, [categoryWatch, categories]);

  //
  // 🔹 Image preview
  //
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  //
  // 🔹 Submit Handler
  //
  const onSubmit = async (data: ProductForm) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryId", data.categoryId);
      formData.append("sellingPrice", data.sellingPrice);
      formData.append("costPrice", data.costPrice);
      formData.append("wholesalePrice", data.wholesalePrice || "");
      formData.append("stock", data.stock);
      formData.append("unit", data.unit);
      formData.append("hsn", data.hsn || "");
      formData.append("sku", generatedCodes.sku);
      formData.append("barcode", generatedCodes.barcode);
      formData.append("productNumber", generatedCodes.productNumber);
      if (photo) formData.append("photo", photo);

      const res = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Product added successfully!");
      reset();
      setPreview(null);
      setGeneratedCodes({ sku: "", barcode: "", productNumber: "" });
      router.push("/products");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  //
  // 🧭 UI Layout
  //
  return (
    <div className="p-6 max-w-3xl mx-auto text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-slate-700"
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FilePlus2 className="text-emerald-400" />
          Add New Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <input
              {...register("name")}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              {...register("categoryId")}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-400 text-xs">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Auto Generated Codes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CodeBox label="SKU" value={generatedCodes.sku} Icon={Tag} />
            <CodeBox
              label="Barcode"
              value={generatedCodes.barcode}
              Icon={Barcode}
            />
            <CodeBox
              label="Product Number"
              value={generatedCodes.productNumber}
              Icon={Hash}
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PriceInput
              label="Selling Price"
              field="sellingPrice"
              register={register}
              errors={errors}
            />
            <PriceInput
              label="Cost Price"
              field="costPrice"
              register={register}
              errors={errors}
            />
            <PriceInput
              label="Wholesale Price"
              field="wholesalePrice"
              register={register}
              errors={errors}
              optional
            />
          </div>

          {/* Stock + Unit + HSN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FieldInput
              label="Stock"
              field="stock"
              register={register}
              errors={errors}
            />
            <FieldInput
              label="Unit"
              field="unit"
              register={register}
              errors={errors}
            />
            <FieldInput
              label="HSN Code"
              field="hsn"
              register={register}
              errors={errors}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm mb-2 flex items-center gap-2">
              <Upload size={16} /> Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
            {preview && (
              <div className="mt-3">
                <Image
                  src={preview}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="rounded-lg border border-slate-700 object-cover"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium shadow-lg mt-4"
          >
            <Package /> Add Product
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

//
// 🔸 Helper Components
//
function CodeBox({ label, value, Icon }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
      <div className="flex items-center gap-2 text-emerald-400">
        <Icon size={16} /> {label}
      </div>
      <p className="mt-1 text-slate-300 text-sm">{value || "Auto-generated"}</p>
    </div>
  );
}

function PriceInput({ label, field, register, errors, optional }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
        <IndianRupee size={14} className="text-slate-500 mr-2" />
        <input
          {...register(field)}
          className="bg-transparent w-full outline-none"
          placeholder="0.00"
        />
      </div>
      {errors[field] && (
        <p className="text-red-400 text-xs mt-1">{errors[field]?.message}</p>
      )}
    </div>
  );
}

function FieldInput({ label, field, register, errors }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        {...register(field)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
      />
      {errors[field] && (
        <p className="text-red-400 text-xs">{errors[field].message}</p>
      )}
    </div>
  );
}
