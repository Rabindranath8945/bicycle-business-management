"use client";

import React, { useState } from "react";
import {
  Save,
  Package,
  Tags,
  Hash,
  Layers,
  Barcode,
  AlertTriangle,
  Database,
  Check,
  Zap,
  LayoutGrid,
  TrendingDown,
  ShieldCheck,
  Settings2,
  Info,
} from "lucide-react";

type ValuationMethod = "FIFO" | "LIFO" | "Average";

export default function ProductInventorySettings() {
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    enableCategories: true,
    enableBrands: true,
    enableHSN: true,
    enableVariants: true,
    enableSerialTracking: false,
    lowStockLimit: 5,
    allowNegativeStock: false,
    valuationMethod: "FIFO" as ValuationMethod,
  });

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleOption = (key: string) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Inventory rules updated for 2026.");
    }, 1200);
  };

  const ActionButton = ({ label, checked, onClick, icon: Icon }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all w-full text-left ${
        checked
          ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
          : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
      }`}
    >
      {Icon && <Icon size={16} />}
      <span className="flex-1 text-left">{label}</span>
      {checked ? (
        <Check size={14} className="text-blue-600" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900">
      {/* 1. CONFIGURATION SIDEBAR */}
      <aside className="w-96 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-blue-200">
              P
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Product Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck size={12} /> Inventory Core: 2026 Stable
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* PRODUCT CONTROLS */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Settings2 size={12} /> Product Controls
            </h3>
            <div className="space-y-2">
              <ActionButton
                label="Enable Categories"
                checked={form.enableCategories}
                onClick={() => toggleOption("enableCategories")}
                icon={LayoutGrid}
              />
              <ActionButton
                label="Enable Brands"
                checked={form.enableBrands}
                onClick={() => toggleOption("enableBrands")}
                icon={Tags}
              />
              <ActionButton
                label="Enable HSN Codes"
                checked={form.enableHSN}
                onClick={() => toggleOption("enableHSN")}
                icon={Hash}
              />
              <ActionButton
                label="Enable Variants (Size/Color)"
                checked={form.enableVariants}
                onClick={() => toggleOption("enableVariants")}
                icon={Layers}
              />
              <ActionButton
                label="Serial / Batch Tracking"
                checked={form.enableSerialTracking}
                onClick={() => toggleOption("enableSerialTracking")}
                icon={Barcode}
              />
            </div>
          </section>

          {/* STOCK RULES */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Database size={12} /> Stock Rules
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  Low Stock Alert Limit
                </label>
                <input
                  type="number"
                  value={form.lowStockLimit}
                  onChange={(e) => updateForm("lowStockLimit", e.target.value)}
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="p-4 rounded-xl border bg-slate-50 border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      Allow Negative Stock
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-tight">
                      Allow sales even if stock is 0
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600"
                    checked={form.allowNegativeStock}
                    onChange={() => toggleOption("allowNegativeStock")}
                  />
                </label>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  Valuation Method
                </label>
                <select
                  value={form.valuationMethod}
                  onChange={(e) =>
                    updateForm("valuationMethod", e.target.value)
                  }
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                >
                  <option value="FIFO">FIFO (First In First Out)</option>
                  <option value="LIFO">LIFO (Last In First Out)</option>
                  <option value="Average">Weighted Average</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Apply Inventory Policy"}
        </button>
      </aside>

      {/* 2. LIVE IMPACT PREVIEW */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Inventory Logic Impact
            </h2>
            <p className="text-slate-500 font-medium">
              Visualizing how settings affect your 2026 dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact: Product Management */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-lg">Product Add/Edit</h3>
              <div className="text-sm text-slate-500 space-y-2 font-medium">
                <p
                  className={`flex items-center gap-2 ${
                    form.enableHSN ? "text-slate-800" : "opacity-30"
                  }`}
                >
                  <Check size={14} /> HSN Field:{" "}
                  {form.enableHSN ? "Visible" : "Hidden"}
                </p>
                <p
                  className={`flex items-center gap-2 ${
                    form.enableVariants ? "text-slate-800" : "opacity-30"
                  }`}
                >
                  <Check size={14} /> Multi-Variant Table:{" "}
                  {form.enableVariants ? "Enabled" : "Disabled"}
                </p>
                <p
                  className={`flex items-center gap-2 ${
                    form.enableSerialTracking ? "text-slate-800" : "opacity-30"
                  }`}
                >
                  <Check size={14} /> Batch Tracking:{" "}
                  {form.enableSerialTracking ? "Active" : "Off"}
                </p>
              </div>
            </div>

            {/* Impact: Sales & POS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-lg">Sales Workflow</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {form.allowNegativeStock
                  ? "Items can be billed regardless of physical stock count. Inventory will reflect negative values."
                  : "The POS system will block sales for any item whose stock reaches zero."}
              </p>
            </div>

            {/* Impact: Alerts */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <TrendingDown size={20} />
              </div>
              <h3 className="font-bold text-lg">Inventory Dashboard</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Automatic "Low Stock" badge will appear for items with less than{" "}
                <span className="text-amber-600 font-bold">
                  {form.lowStockLimit} units
                </span>{" "}
                remaining.
              </p>
            </div>

            {/* Impact: Reports */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Info size={20} />
              </div>
              <h3 className="font-bold text-lg">Valuation & Profit</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Stock value and Gross Profit will be calculated using the{" "}
                <span className="text-purple-600 font-bold">
                  {form.valuationMethod}
                </span>{" "}
                method for 2026 audits.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
