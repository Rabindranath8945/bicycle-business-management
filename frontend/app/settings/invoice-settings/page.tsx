"use client";

import React, { useState } from "react";
import {
  Save,
  Receipt,
  FileText,
  RefreshCcw,
  QrCode,
  Percent,
  Layout,
  Check,
  PenTool,
  Crown,
  ShieldCheck,
  Eye,
  EyeOff,
  Type,
  Hash,
  Calendar,
  Settings2,
} from "lucide-react";

type CategoryType = "thermal" | "wholesale" | "cycle" | "gst";

export default function AdvancedInvoiceLab() {
  const [activeCat, setActiveCat] = useState<CategoryType>("thermal");
  const [selectedSubVariant, setSelectedSubVariant] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Constants for 2026
  const CURRENT_YEAR = 2026;
  const FIN_YEAR = "2025-26";

  const formatMoney = (v: number) =>
    v.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const [form, setForm] = useState({
    business: {
      tradeName: "Mandal Cycle Store",
      addressLine1: "Tentulberia",
      addressLine2: "Haldia, West Bengal - 721657",
      phone: "+91 70476 63313",
      gstin: "07AAAAA0000A1Z5",
    },
    bank: {
      bankName: "State Bank of India",
      accountNo: "XXXX XXXX 1234",
      ifsc: "SBIN0000123",
      upi: "mandalcycle@upi",
    },
    customer: {
      name: "Sankar Das",
      phone: "+91 954747 2839",
      address: "Haldia, West Bengal",
    },
    // --- NEW FEATURES ---
    numbering: {
      prefix: "INV-",
      startNumber: "1001",
      autoIncrement: true,
      financialYearReset: true,
    },
    controls: {
      showCustomerName: true,
      showCustomerMobile: true,
      showCustomerAddress: true,
      showGSTBreakup: true,
      showBankDetails: true,
    },
    terms:
      "1. Goods once sold are not returnable. 2. Warranty as per MFG policy.",
    brandColor: "#2563eb",
    fontFamily: "Inter, sans-serif",
    design: { separator: "dashed" as "dashed" | "solid" },
    footerByCategory: {
      thermal: "Thank you! Visit again.",
      wholesale: "Terms: Net 30 Days.",
      cycle: "Ride safe, wear a helmet.",
      gst: "GST Compliant Tax Invoice.",
    },
  });

  const isThermal = activeCat === "thermal";
  const isA4 = activeCat !== "thermal";

  // Requirement: Large for A4, Compact for Thermal
  const dynamicFontSize = isThermal ? "12px" : "16px";

  const toggleControl = (key: keyof typeof form.controls) => {
    setForm((prev) => ({
      ...prev,
      controls: { ...prev.controls, [key]: !prev.controls[key] },
    }));
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900">
      {/* 1. CONFIGURATION SIDEBAR */}
      <aside className="w-85 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">
            I
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase">
            Invoice Lab
          </h2>
        </div>

        <div className="space-y-6">
          {/* INVOICE NUMBERING */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Hash size={12} /> Invoice Numbering
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="text-xs p-2 bg-slate-50 border border-slate-100 rounded-lg"
                placeholder="Prefix (INV-)"
                value={form.numbering.prefix}
                onChange={(e) =>
                  setForm({
                    ...form,
                    numbering: { ...form.numbering, prefix: e.target.value },
                  })
                }
              />
              <input
                className="text-xs p-2 bg-slate-50 border border-slate-100 rounded-lg"
                placeholder="Start (1001)"
                value={form.numbering.startNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    numbering: {
                      ...form.numbering,
                      startNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    numbering: {
                      ...form.numbering,
                      autoIncrement: !form.numbering.autoIncrement,
                    },
                  })
                }
                className={`flex items-center justify-between p-2 rounded-lg text-[11px] font-bold border transition-all ${
                  form.numbering.autoIncrement
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                Auto-increment{" "}
                {form.numbering.autoIncrement ? (
                  <Check size={14} />
                ) : (
                  <RefreshCcw size={14} />
                )}
              </button>
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    numbering: {
                      ...form.numbering,
                      financialYearReset: !form.numbering.financialYearReset,
                    },
                  })
                }
                className={`flex items-center justify-between p-2 rounded-lg text-[11px] font-bold border transition-all ${
                  form.numbering.financialYearReset
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                FY Reset ({FIN_YEAR}){" "}
                {form.numbering.financialYearReset ? (
                  <Check size={14} />
                ) : (
                  <Calendar size={14} />
                )}
              </button>
            </div>
          </section>

          {/* TEMPLATE CONTROLS */}
          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Settings2 size={12} /> Template Controls
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => toggleControl("showCustomerName")}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold"
              >
                Customer Name{" "}
                {form.controls.showCustomerName ? (
                  <Check size={14} className="text-blue-600" />
                ) : (
                  <EyeOff size={14} className="text-slate-300" />
                )}
              </button>
              <button
                onClick={() => toggleControl("showCustomerMobile")}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold"
              >
                Customer Mobile{" "}
                {form.controls.showCustomerMobile ? (
                  <Check size={14} className="text-blue-600" />
                ) : (
                  <EyeOff size={14} className="text-slate-300" />
                )}
              </button>
              <button
                disabled={isThermal}
                onClick={() => toggleControl("showCustomerAddress")}
                className={`flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold ${
                  isThermal ? "opacity-30" : ""
                }`}
              >
                Address (A4 Only){" "}
                {form.controls.showCustomerAddress ? (
                  <Check size={14} className="text-blue-600" />
                ) : (
                  <EyeOff size={14} className="text-slate-300" />
                )}
              </button>
              <button
                onClick={() => toggleControl("showGSTBreakup")}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold"
              >
                GST Breakup{" "}
                {form.controls.showGSTBreakup ? (
                  <Check size={14} className="text-blue-600" />
                ) : (
                  <EyeOff size={14} className="text-slate-300" />
                )}
              </button>
              <button
                onClick={() => toggleControl("showBankDetails")}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold"
              >
                Bank Details{" "}
                {form.controls.showBankDetails ? (
                  <Check size={14} className="text-blue-600" />
                ) : (
                  <EyeOff size={14} className="text-slate-300" />
                )}
              </button>
            </div>
          </section>

          {/* TERMS & CONDITIONS */}
          <section className="space-y-2 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={12} /> Terms & Footer
            </h3>
            <textarea
              className="w-full text-[11px] p-3 bg-slate-50 border border-slate-100 rounded-xl h-20"
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              placeholder="Terms & Conditions"
            />
          </section>
        </div>
      </aside>

      {/* 2. LIVE PREVIEW PANEL */}
      <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center border-l border-slate-100 bg-slate-50/30">
        <div className="w-full max-w-4xl flex items-center justify-between mb-6">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {[
              { id: "thermal", label: "Thermal", icon: <Receipt size={14} /> },
              { id: "wholesale", label: "A4 GST", icon: <Layout size={14} /> },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id as CategoryType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeCat === cat.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cat.icon} <span className="hidden md:inline">{cat.label}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200">
            <Save size={18} /> Apply Design
          </button>
        </div>

        {/* DYNAMIC INVOICE CANVAS */}
        <div
          className={`bg-white shadow-2xl transition-all duration-500 border border-slate-200 ${
            isThermal
              ? "w-[300px] rounded-sm"
              : "w-[210mm] min-h-[297mm] rounded-lg"
          }`}
          style={{ fontFamily: form.fontFamily, fontSize: dynamicFontSize }}
        >
          {/* HEADER */}
          <div
            className={`p-8 ${
              isThermal ? "text-center" : "flex justify-between items-start"
            }`}
          >
            <div>
              <h1
                className="text-2xl font-black uppercase"
                style={{ color: form.brandColor }}
              >
                {form.business.tradeName}
              </h1>
              <div className="text-[10px] text-slate-500 font-medium">
                <p>{form.business.addressLine1}</p>
                {!isThermal && <p>{form.business.addressLine2}</p>}
                <p>GSTIN: {form.business.gstin}</p>
                <p>Phone: {form.business.phone}</p>
              </div>
            </div>
            {!isThermal && (
              <div className="text-right">
                <div className="bg-slate-900 text-white px-4 py-1 text-[10px] font-black uppercase rounded mb-3 inline-block">
                  Tax Invoice
                </div>
                <div className="text-xs">
                  <p>
                    <span className="text-slate-400">Inv:</span>{" "}
                    {form.numbering.prefix}2026/{form.numbering.startNumber}
                  </p>
                  <p>
                    <span className="text-slate-400">Date:</span> 08 Jan 2026
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CUSTOMER SECTION */}
          {(form.controls.showCustomerName ||
            form.controls.showCustomerMobile) && (
            <div
              className={`mx-8 py-4 border-y border-dashed border-slate-200 flex justify-between items-center bg-slate-50/50`}
            >
              <div className="text-xs">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                  Bill To
                </p>
                {form.controls.showCustomerName && (
                  <p className="font-bold text-slate-800">
                    {form.customer.name}
                  </p>
                )}
                {form.controls.showCustomerMobile && (
                  <p className="text-[10px] text-slate-500">
                    {form.customer.phone}
                  </p>
                )}
                {form.controls.showCustomerAddress && isA4 && (
                  <p className="text-[10px] text-slate-500">
                    {form.customer.address}
                  </p>
                )}
              </div>
              <QrCode size={isThermal ? 30 : 50} className="text-slate-800" />
            </div>
          )}

          {/* ITEMS TABLE */}
          <div className="px-8 mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-2 px-2">Description</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-[11px] divide-y divide-slate-50">
                <tr>
                  <td className="py-3 px-2 font-bold">Hero Sprint 26T MTB</td>
                  <td className="py-3 px-2 text-center">01</td>
                  <td className="py-3 px-2 text-right font-black">₹8,499.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="px-8 mt-8 flex justify-end">
            <div className="w-64 space-y-2">
              {form.controls.showGSTBreakup && (
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>GST (12%)</span> <span>₹1,019.88</span>
                </div>
              )}
              <div
                className="flex justify-between items-end pt-3 border-t border-slate-200"
                style={{ borderTopStyle: form.design.separator }}
              >
                <span className="text-xs font-black uppercase">
                  Grand Total
                </span>
                <span className="text-xl font-black text-blue-600">
                  ₹9,518.88
                </span>
              </div>
            </div>
          </div>

          {/* BANK & FOOTER */}
          <div className="px-8 mt-12 mb-10 space-y-4">
            {form.controls.showBankDetails && (
              <div
                className={`grid ${
                  isThermal ? "grid-cols-1" : "grid-cols-2"
                } gap-4 pt-4 border-t border-slate-100`}
              >
                <div className="text-[10px] text-slate-600">
                  <p className="font-bold text-slate-400 uppercase text-[9px]">
                    Bank Details
                  </p>
                  <p className="font-bold">{form.bank.bankName}</p>
                  <p>A/C: {form.bank.accountNo}</p>
                  <p className="text-blue-600 font-bold">
                    UPI: {form.bank.upi}
                  </p>
                </div>
                {!isThermal && (
                  <div className="text-right flex flex-col justify-end items-end">
                    <div className="w-24 h-10 border-b border-slate-200 mb-1" />
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Signatory
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="pt-4 border-t border-slate-50 text-center">
              <p className="text-[10px] text-slate-500 italic mb-2">
                {form.terms}
              </p>
              <p className="text-[10px] font-bold text-slate-400">
                {form.footerByCategory[activeCat]}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
