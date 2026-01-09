"use client";

import React, { useState } from "react";
import {
  Save,
  Settings2,
  Check,
  EyeOff,
  Percent,
  Layout,
  Receipt,
  Crown,
  Hash,
  Type,
  ShieldCheck,
  Zap,
  Tag,
  BookOpen,
  AlertCircle,
} from "lucide-react";

type TaxType = "CGST+SGST" | "IGST";

export default function TaxAndGSTSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    enableGST: true,
    gstType: "CGST+SGST" as TaxType,
    defaultTaxRate: 18,
    enableProductOverride: true,
  });

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleOption = (key: string) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Tax settings updated for 2026 fiscal year.");
    }, 1200);
  };

  // Shared Button Component
  const ActionButton = ({
    label,
    checked,
    onClick,
    icon: Icon,
    type = "toggle",
  }: any) => (
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
              T
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Tax Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck size={12} /> Compliance Level: 2026 Standard
          </p>
        </div>

        <div className="space-y-8 flex-1">
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Percent size={12} /> GST Configuration
            </h3>

            {/* GST Master Toggle */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                form.enableGST
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    Enable GST Billing
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Toggle for small/local non-GST mode
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  checked={form.enableGST}
                  onChange={() => toggleOption("enableGST")}
                />
              </label>
            </div>

            {form.enableGST ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                {/* GST Type Selection */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    GST Calculation Type
                  </p>
                  <ActionButton
                    label="CGST + SGST (Intra-State)"
                    checked={form.gstType === "CGST+SGST"}
                    onClick={() => updateForm("gstType", "CGST+SGST")}
                    icon={Layout}
                  />
                  <ActionButton
                    label="IGST (Inter-State)"
                    checked={form.gstType === "IGST"}
                    onClick={() => updateForm("gstType", "IGST")}
                    icon={Layout}
                  />
                </div>

                {/* Default Tax Rate */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Default Tax Rate (%)
                  </p>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.defaultTaxRate}
                      onChange={(e) =>
                        updateForm("defaultTaxRate", e.target.value)
                      }
                      className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                    <Percent
                      size={14}
                      className="absolute right-4 top-3.5 text-slate-400"
                    />
                  </div>
                </div>

                {/* Product Override */}
                <ActionButton
                  label="Product-wise Tax Override"
                  checked={form.enableProductOverride}
                  onClick={() => toggleOption("enableProductOverride")}
                  icon={Tag}
                />
                <p className="text-[10px] text-slate-400 font-medium italic">
                  {" "}
                  Allows specific items to have different GST rates (e.g., 5%,
                  12%, 28%) during sale entry.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                <div className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  <strong>Non-GST Mode Active:</strong> Tax lines will be hidden
                  from invoices and Sale calculations. Useful for small
                  retailers or local billing.
                </div>
              </div>
            )}
          </section>
        </div>

        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Syncing..." : "Apply Tax Policy"}
        </button>
      </aside>

      {/* 2. LIVE IMPACT PREVIEW */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              System Behavior Impact
            </h2>
            <p className="text-slate-500 font-medium">
              How these settings affect your 2026 operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-lg">Sales Calculation</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {form.enableGST
                  ? `Automated tax application: Base Price + ${
                      form.defaultTaxRate
                    }% ${form.gstType}. Item-wise tax override is ${
                      form.enableProductOverride ? "Enabled" : "Disabled"
                    }.`
                  : "Tax is hidden. Sale total will strictly reflect the item prices with zero tax calculations in the background."}
              </p>
            </div>

            {/* Impact 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <Receipt size={20} />
              </div>
              <h3 className="font-bold text-lg">Invoice Display</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {form.enableGST
                  ? `Invoices will display a professional Tax Table showing ${
                      form.gstType === "IGST"
                        ? "IGST Amount"
                        : "CGST & SGST breakdown"
                    }.`
                  : "Standard 'Sales Receipt' format. The words 'Tax Invoice' and all tax columns will be removed from the print template."}
              </p>
            </div>

            {/* Impact 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-lg">GST Reports</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {form.enableGST
                  ? "Daily sales will be categorized into Taxable and Non-Taxable buckets for GSTR-1 preparation."
                  : "GST reports will be deactivated. Your sales will be logged as 0% tax local commerce."}
              </p>
            </div>

            {/* Impact 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <Crown size={20} />
              </div>
              <h3 className="font-bold text-lg">Fiscal Year 2026</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                All settings are optimized for current 2026 tax standards,
                ensuring your business stays compliant with the latest IGST/CGST
                rules.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
