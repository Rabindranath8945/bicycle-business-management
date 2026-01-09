"use client";

import React, { useState } from "react";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  ShoppingCart,
  Package,
  Layers,
  DollarSign,
  Camera,
  Zap,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

// --- Types and Schemas ---
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Select a category"),
  sellingPrice: z.string().min(1, "Selling price is required"),
  costPrice: z.string().min(1, "Cost price is required"),
  unit: z.string().min(1),
  sku: z.string().optional(),
  hsn: z.string().optional(),
  brand: z.string().optional(),
  wholesalePrice: z.string().optional(),
  stock: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;
type TabId =
  | "identity"
  | "financials"
  | "logistics"
  | "variants"
  | "accounting"
  | "media"
  | "advanced";

// --- Reusable Sub-Components ---

const InputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
  }
>(({ label, error, ...props }, ref) => (
  <div className="w-full mb-4">
    <label className="text-sm font-semibold text-slate-700 mb-2 block">
      {label}
    </label>
    <input
      ref={ref}
      {...props}
      className={`w-full px-4 py-3 bg-slate-50 border ${
        error ? "border-red-500" : "border-slate-300"
      } rounded-lg focus:border-blue-500 outline-none transition-all`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
));
InputField.displayName = "InputField";

const Toggler = ({
  label,
  checked,
  onChange,
  info,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  info?: string;
}) => (
  <div
    className="flex items-center justify-between cursor-pointer py-2"
    onClick={onChange}
  >
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {info && <span className="text-[10px] text-gray-500">{info}</span>}
    </div>
    <div
      className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </div>
  </div>
);

const FormCard = ({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
      {Icon && <Icon size={14} />} {title}
    </h3>
    {children}
  </div>
);

// --- Main Component ---
export default function RedesignedAddProduct() {
  const [activeTab, setActiveTab] = useState<TabId>("identity");
  const [isSaving, setIsSaving] = useState(false);

  // Toggles and State
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [enableVariants, setEnableVariants] = useState(false);
  const [gstEnabled, setGstEnabled] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { unit: "Pcs" },
  });

  const onSubmit = (data: ProductForm) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Product '${data.name}' saved successfully!`);
    }, 1200);
  };

  const steps = [
    { id: "identity" as TabId, label: "General Info", icon: Info },
    { id: "financials" as TabId, label: "Sales", icon: ShoppingCart },
    { id: "logistics" as TabId, label: "Inventory", icon: Package },
    { id: "variants" as TabId, label: "Variants", icon: Layers },
    { id: "accounting" as TabId, label: "Accounting", icon: DollarSign },
    { id: "media" as TabId, label: "Media", icon: Camera },
    { id: "advanced" as TabId, label: "Advanced", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />{" "}
            <span className="font-medium">Back to Products</span>
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} /> Save Product
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveTab(step.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === step.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <step.icon size={16} /> {step.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1 & 2: Identity & Financials (Existing Pattern) */}
            {activeTab === "identity" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard title="Basic Details" icon={Info}>
                  <InputField
                    label="Product Name"
                    {...register("name")}
                    error={errors.name?.message}
                  />
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Category
                    </label>
                    <select
                      {...register("categoryId")}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Cycles">Cycles</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </FormCard>
                <FormCard title="Identification" icon={Layers}>
                  <InputField label="Brand" {...register("brand")} />
                  <InputField label="SKU" {...register("sku")} />
                  <InputField label="HSN Code" {...register("hsn")} />
                </FormCard>
              </div>
            )}

            {activeTab === "financials" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard title="Pricing (INR)" icon={DollarSign}>
                  <InputField
                    label="Cost Price"
                    type="number"
                    {...register("costPrice")}
                  />
                  <InputField
                    label="Selling Price"
                    type="number"
                    {...register("sellingPrice")}
                  />
                  <InputField
                    label="Wholesale Price"
                    type="number"
                    {...register("wholesalePrice")}
                  />
                </FormCard>
                <FormCard title="Sales Behavior" icon={ShoppingCart}>
                  <Toggler
                    label="Available for Sale"
                    checked={true}
                    onChange={() => {}}
                  />
                  <Toggler
                    label="Allow Discount"
                    checked={true}
                    onChange={() => {}}
                  />
                  <InputField
                    label="Max Discount %"
                    type="number"
                    defaultValue={20}
                  />
                </FormCard>
              </div>
            )}

            {/* 4: Inventory Tab */}
            {activeTab === "logistics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard title="Stock Control" icon={Package}>
                  <Toggler
                    label="Track Inventory"
                    checked={trackInventory}
                    onChange={() => setTrackInventory(!trackInventory)}
                  />
                  <InputField
                    label="Opening Stock"
                    type="number"
                    {...register("stock")}
                    disabled={!trackInventory}
                  />
                  <InputField
                    label="Opening Stock Date"
                    type="date"
                    disabled={!trackInventory}
                  />
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Stock Location
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                      <option>Shop</option>
                      <option>Godown</option>
                    </select>
                  </div>
                </FormCard>
                <FormCard title="Reordering Rules (Odoo Core)" icon={Zap}>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Min Stock Level"
                      type="number"
                      placeholder="0"
                    />
                    <InputField
                      label="Max Stock Level"
                      type="number"
                      placeholder="100"
                    />
                  </div>
                  <Toggler
                    label="Low Stock Alert"
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="mt-4 pt-4 border-t">
                    <Toggler
                      label="Allow Negative Stock"
                      checked={allowNegativeStock}
                      onChange={() =>
                        setAllowNegativeStock(!allowNegativeStock)
                      }
                    />
                    <div className="mt-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Stock Valuation
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                        <option>FIFO (Default)</option>
                        <option>AVCO (Average Cost)</option>
                      </select>
                    </div>
                  </div>
                </FormCard>
              </div>
            )}

            {/* 5: Variants Tab */}
            {activeTab === "variants" && (
              <div className="space-y-6">
                <FormCard title="Variant Configuration" icon={Layers}>
                  <Toggler
                    label="Enable Product Variants"
                    checked={enableVariants}
                    onChange={() => setEnableVariants(!enableVariants)}
                    info="Create multiple versions like Size or Color"
                  />

                  {enableVariants && (
                    <div className="mt-8 space-y-6 border-t pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-2 block">
                            Attribute
                          </label>
                          <select className="w-full p-2 bg-white border border-slate-300 rounded-md">
                            <option>Size</option>
                            <option>Color</option>
                            <option>Material</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-slate-500 mb-2 block">
                            Values
                          </label>
                          <input
                            placeholder="e.g. 26T, 29T (Press enter)"
                            className="w-full p-2 bg-white border border-slate-300 rounded-md"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 text-sm font-semibold flex items-center gap-1"
                      >
                        <Plus size={16} /> Add another attribute
                      </button>

                      <div className="mt-6">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">
                          Auto-generated Variants
                        </h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                              <tr>
                                <th className="p-3">Variant</th>
                                <th className="p-3">Extra Price</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="p-3 font-medium">
                                  Hero Cycle - Black - 26T
                                </td>
                                <td className="p-3">
                                  <input
                                    className="w-20 border rounded px-1"
                                    defaultValue="0"
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    className="w-20 border rounded px-1"
                                    defaultValue="10"
                                  />
                                </td>
                                <td className="p-3 text-right text-red-500">
                                  <Trash2
                                    size={16}
                                    className="inline cursor-pointer"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </FormCard>
              </div>
            )}

            {/* 6: Accounting / GST Tab */}
            {activeTab === "accounting" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard title="Tax Configuration" icon={DollarSign}>
                  <Toggler
                    label="GST Enabled"
                    checked={gstEnabled}
                    onChange={() => setGstEnabled(!gstEnabled)}
                  />
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Tax Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="taxtype" defaultChecked />{" "}
                          CGST + SGST
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="taxtype" /> IGST
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Tax Rate
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                        <option>18% (Standard)</option>
                        <option>12%</option>
                        <option>5%</option>
                        <option>28%</option>
                      </select>
                    </div>
                  </div>
                </FormCard>
                <FormCard title="Accounting Mapping" icon={FileText}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Income Account
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                        <option>Sales Account</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Expense Account
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                        <option>Cost of Goods Sold</option>
                      </select>
                    </div>
                  </div>
                </FormCard>
              </div>
            )}

            {/* 7: Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <FormCard title="Product Images" icon={Camera}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">
                      <Plus size={32} />
                      <span className="text-xs font-bold mt-2 uppercase">
                        Main Image
                      </span>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-300"
                      >
                        <ImageIcon size={32} />
                      </div>
                    ))}
                  </div>
                </FormCard>
                <FormCard title="Media Rules" icon={ShieldCheck}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Toggler
                      label="Show image in Sales Screen"
                      checked={true}
                      onChange={() => {}}
                    />
                    <Toggler
                      label="Show image in PDF Invoice"
                      checked={true}
                      onChange={() => {}}
                      info="A4 Premium templates only"
                    />
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                      <Info className="text-amber-600 shrink-0" size={18} />
                      <p className="text-xs text-amber-800">
                        Thermal printers do not support images. Product images
                        will automatically be hidden on thermal receipts.
                      </p>
                    </div>
                  </div>
                </FormCard>
              </div>
            )}

            {/* 8: Advanced Tab */}
            {activeTab === "advanced" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard title="Tracking" icon={Zap}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Tracking Method
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                        <option>No Tracking</option>
                        <option>By Unique Serial Number</option>
                        <option>By Batches / Lots</option>
                      </select>
                    </div>
                    <Toggler
                      label="Show in POS"
                      checked={true}
                      onChange={() => {}}
                    />
                    <Toggler
                      label="Visible in Inventory"
                      checked={true}
                      onChange={() => {}}
                    />
                  </div>
                </FormCard>
                <FormCard title="Internal Notes" icon={FileText}>
                  <textarea
                    placeholder="Add notes for internal staff... (Will not be printed on invoices)"
                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-sm"
                  ></textarea>
                </FormCard>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}
