"use client";

import React, { useState } from "react";
import {
  Save,
  ShoppingCart,
  Check,
  Search,
  Percent,
  MessageCircle,
  FileText,
  Settings2,
  Package,
  Hash,
  Type,
  LayoutGrid,
  Monitor,
  Printer,
  ShieldCheck,
  FileSearch,
} from "lucide-react";

export default function SalesSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    searchByName: true,
    searchByCategory: false,
    searchByHSN: true,
    searchByProductNumber: true,
    autoTaxFromSettings: true,
    discountPercentage: true,
    discountFlatAmount: true,
    saveAndPrintShortcut: true,
    saveAndWhatsappShortcut: false,
    autoPdfGenerate: true,
    autoWhatsappSend: false,
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
      alert("Sales settings updated successfully.");
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
              S
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Sales Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <Settings2 size={12} /> Point of Sale Optimization
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* PRODUCT SEARCH BEHAVIOR */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Search size={12} /> Sale Form Product Search
            </h3>
            <div className="space-y-2">
              <ActionButton
                label="Search by Name"
                checked={form.searchByName}
                onClick={() => toggleOption("searchByName")}
                icon={Type}
              />
              <ActionButton
                label="Search by Category"
                checked={form.searchByCategory}
                onClick={() => toggleOption("searchByCategory")}
                icon={LayoutGrid}
              />
              <ActionButton
                label="Search by HSN Code"
                checked={form.searchByHSN}
                onClick={() => toggleOption("searchByHSN")}
                icon={Hash}
              />
              <ActionButton
                label="Search by Product Number/SKU"
                checked={form.searchByProductNumber}
                onClick={() => toggleOption("searchByProductNumber")}
                icon={Package}
              />
            </div>
          </section>

          {/* DISCOUNT & TAX RULES */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Percent size={12} /> Discount & Tax Rules
            </h3>
            <div className="space-y-2">
              <ActionButton
                label="Auto tax from settings"
                checked={form.autoTaxFromSettings}
                onClick={() => toggleOption("autoTaxFromSettings")}
                icon={ShieldCheck}
              />
              <ActionButton
                label="Enable % Discount"
                checked={form.discountPercentage}
                onClick={() => toggleOption("discountPercentage")}
                icon={Percent}
              />
              <ActionButton
                label="Enable Flat Amount Discount"
                checked={form.discountFlatAmount}
                onClick={() => toggleOption("discountFlatAmount")}
                icon={Hash}
              />
            </div>
          </section>

          {/* AFTER SALE AUTOMATION */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MessageCircle size={12} /> After Sale Automation
            </h3>
            <div className="space-y-2">
              <ActionButton
                label="Auto PDF Generate on Save"
                checked={form.autoPdfGenerate}
                onClick={() => toggleOption("autoPdfGenerate")}
                icon={FileText}
              />
              <ActionButton
                label="Auto WhatsApp Invoice Send"
                checked={form.autoWhatsappSend}
                onClick={() => toggleOption("autoWhatsappSend")}
                icon={MessageCircle}
              />
              <p className="text-[10px] text-slate-400 font-medium italic">
                Requires customer mobile number to be present in the form.
              </p>
            </div>
          </section>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Apply Sales Policy"}
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
              Visualizing how settings affect the "Add Sale" workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact: POS Form Interface */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Monitor size={20} />
              </div>
              <h3 className="font-bold text-lg">POS Form Interface</h3>
              <div className="text-sm text-slate-500 space-y-2 font-medium">
                <p>Discount fields will accept both % and flat amounts.</p>
                <p>
                  If a product is scanned/selected, tax is instantly applied
                  based on settings.
                </p>
              </div>
            </div>

            {/* Impact: Product Search Modal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <FileSearch size={20} />
              </div>
              <h3 className="font-bold text-lg">Product Search Modal</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Users can use multiple filters simultaneously. The search
                algorithm prioritizes Name, Product Number, and HSN codes for
                quick lookup.
              </p>
            </div>

            {/* Impact: Post-Sale Action Buttons */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <Printer size={20} />
              </div>
              <h3 className="font-bold text-lg">Quick Save Actions</h3>
              <div className="text-sm text-slate-500 space-y-2 font-medium">
                <p>Shortcut 'Save + Print' button will be visible.</p>
                <p>
                  Automated WhatsApp sending option appears if a valid customer
                  phone is entered.
                </p>
              </div>
            </div>

            {/* Impact: System Automation */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-bold text-lg">Automation Workflow</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Upon finalizing a sale, the system instantly generates and
                stores the invoice PDF. WhatsApp sending is queued in the
                background.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
