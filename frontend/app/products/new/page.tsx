"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  Tag,
  Barcode,
  Hash,
  IndianRupee,
  ArrowLeft,
  Save,
  Layers,
  Info,
  ShieldCheck,
  FilePlus2,
  Box,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function DashboardMatchAddProduct() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [uploading, setUploading] = useState(false);
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
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const watchName = watch("name", "New Product Record");
  const categoryWatch = watch("categoryId");

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  useEffect(() => {
    if (categoryWatch && categories.length > 0) {
      const selectedCat = categories.find((c) => c._id === categoryWatch);
      const prefix = (selectedCat?.name || "PROD")
        .substring(0, 3)
        .toUpperCase();
      setGeneratedCodes({
        sku: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `${Date.now().toString().slice(-6)}${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        productNumber: `PRD-${Date.now().toString().slice(-4)}`,
      });
    }
  }, [categoryWatch, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Access the first file at index [0] using optional chaining
    const file = e.target.files?.[0] || null;

    if (preview) URL.revokeObjectURL(preview);
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductForm) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value || "")
      );
      Object.entries(generatedCodes).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (photo) formData.append("photo", photo);
      await axios.post("/api/products", formData);
      toast.success("Product successfully created");
      router.push("/products");
    } catch (error: any) {
      toast.error("Operation failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1E293B] font-sans pb-20">
      {/* 1. Dashboard-Style Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <FilePlus2 className="text-[#007BFF]" />
              <h1 className="text-xl font-bold text-slate-800">{watchName}</h1>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-lg font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            <Save size={18} /> {uploading ? "Saving..." : "Create Product"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. MAIN SHEET - White Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              {[
                { id: "general", label: "Identity", icon: Info },
                { id: "pricing", label: "Financials", icon: IndianRupee },
                { id: "inventory", label: "Logistics", icon: Layers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "text-[#007BFF] border-[#007BFF] bg-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            <form className="p-8 space-y-8">
              <AnimatePresence mode="wait">
                {activeTab === "general" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">
                        Product Name
                      </label>
                      <input
                        {...register("name")}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF]"
                        placeholder="e.g. Server Rack Mount 42U"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                          Category
                        </label>
                        <select
                          {...register("categoryId")}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF]"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                          Unit
                        </label>
                        <select
                          {...register("unit")}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none"
                        >
                          <option value="pcs">Pieces (Pcs)</option>
                          <option value="kg">Kilograms (Kg)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "pricing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 gap-6"
                  >
                    <PriceField
                      label="Selling Price"
                      name="sellingPrice"
                      register={register}
                      errors={errors}
                    />
                    <PriceField
                      label="Cost Price"
                      name="costPrice"
                      register={register}
                      errors={errors}
                    />
                  </motion.div>
                )}

                {activeTab === "inventory" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                          Initial Stock
                        </label>
                        <input
                          type="number"
                          {...register("stock")}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                          HSN Code
                        </label>
                        <input
                          {...register("hsn")}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#007BFF]"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-blue-500/5 border border-blue-200 rounded-lg flex items-center gap-3">
                      <ShieldCheck className="text-[#007BFF]" size={20} />
                      <p className="text-xs text-slate-600 font-medium tracking-wide">
                        Automatic system-codes generation is active for this
                        product.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* 3. SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">
              Product Image
            </h3>
            <div className="relative group aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-[#007BFF] transition-all flex flex-col items-center justify-center overflow-hidden bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload
                    className="text-gray-300 group-hover:text-[#007BFF] mb-2"
                    size={32}
                  />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Click to Upload
                  </span>
                </>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">
              System Data
            </h3>
            <div className="space-y-3">
              <Metadata label="SKU" value={generatedCodes.sku} icon={Tag} />
              <Metadata
                label="Barcode"
                value={generatedCodes.barcode}
                icon={Barcode}
              />
              <Metadata
                label="Internal ID"
                value={generatedCodes.productNumber}
                icon={Hash}
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

// Reusable Components
function PriceField({ label, name, register, errors }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500">{label}</label>
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#007BFF] transition-all">
        <span className="pl-4 text-gray-400 font-bold">₹</span>
        <input
          type="number"
          {...register(name)}
          className="w-full bg-transparent px-3 py-3 outline-none text-sm font-bold"
          placeholder="0.00"
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-[10px]">{errors[name].message}</p>
      )}
    </div>
  );
}

function Metadata({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="p-2 bg-white rounded-md text-[#007BFF] shadow-sm">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[9px] text-gray-400 font-bold uppercase">{label}</p>
        <p className="text-xs font-mono text-slate-700">
          {value || "Pending..."}
        </p>
      </div>
    </div>
  );
}
