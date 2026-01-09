"use client";

import React, { useState } from "react";
import {
  Save,
  Monitor,
  Printer,
  Globe,
  Clock,
  LayoutTemplate,
  Check,
  Settings2,
  Smartphone,
  Scaling,
  Languages,
  MousePointer2,
  ShieldCheck,
} from "lucide-react";

type PrinterType = "Thermal" | "A4";

export default function SystemPreferencesPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    dateFormat: "DD-MM-YYYY",
    timeFormat: "12-hour",
    language: "English",
    defaultDashboard: "Sales Overview",
    printerType: "Thermal" as PrinterType,
    paperSize: "80mm",
    leftMargin: 2,
    topMargin: 0,
  });

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePrinter = (type: PrinterType) => {
    setForm((prev) => ({
      ...prev,
      printerType: type,
      paperSize: type === "Thermal" ? "80mm" : "A4 Standard",
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("System preferences synchronized for 2026.");
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
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-slate-200">
              S
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              System Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck size={12} /> Environment: Stable 2026
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* GENERAL PREFERENCES */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Globe size={12} /> General & Localization
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  System Language
                </label>
                <select
                  value={form.language}
                  onChange={(e) => updateForm("language", e.target.value)}
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="English">English (United Kingdom)</option>
                  <option value="Bengali">Bengali (Available Soon)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  Default Start Page
                </label>
                <select
                  value={form.defaultDashboard}
                  onChange={(e) =>
                    updateForm("defaultDashboard", e.target.value)
                  }
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                >
                  <option value="Sales Overview">Sales Overview</option>
                  <option value="Inventory Hub">Inventory Hub</option>
                  <option value="Quick Billing">Quick Billing (POS)</option>
                </select>
              </div>
            </div>
          </section>

          {/* PRINTER SETTINGS */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Printer size={12} /> Hardware & Printing
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                label="Thermal"
                checked={form.printerType === "Thermal"}
                onClick={() => togglePrinter("Thermal")}
                icon={Smartphone}
              />
              <ActionButton
                label="A4 Inkjet"
                checked={form.printerType === "A4"}
                onClick={() => togglePrinter("A4")}
                icon={Monitor}
              />
            </div>

            <div className="space-y-3 mt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  Paper Size
                </label>
                <select
                  value={form.paperSize}
                  onChange={(e) => updateForm("paperSize", e.target.value)}
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                >
                  {form.printerType === "Thermal" ? (
                    <>
                      <option value="58mm">58mm (Small POS)</option>
                      <option value="80mm">80mm (Standard POS)</option>
                    </>
                  ) : (
                    <>
                      <option value="A4 Standard">A4 Standard</option>
                      <option value="A5 Mini">A5 Mini (Half Page)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                    Left Margin (px)
                  </label>
                  <input
                    type="number"
                    value={form.leftMargin}
                    onChange={(e) => updateForm("leftMargin", e.target.value)}
                    className="w-full text-sm font-bold p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                    Top Margin (px)
                  </label>
                  <input
                    type="number"
                    value={form.topMargin}
                    onChange={(e) => updateForm("topMargin", e.target.value)}
                    className="w-full text-sm font-bold p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none"
                  />
                </div>
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
          {isSaving ? "Updating..." : "Save Preferences"}
        </button>
      </aside>

      {/* 2. LIVE IMPACT PREVIEW */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              System Environment
            </h2>
            <p className="text-slate-500 font-medium">
              How these preferences impact Mandal Cycle Store's daily workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact: Printer Logic */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Printer size={20} />
              </div>
              <h3 className="font-bold text-lg">Print Output</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                The system will automatically scale all invoices for a{" "}
                <strong>{form.paperSize}</strong> output. Margin offsets are set
                to <strong>{form.leftMargin}px (L)</strong> and{" "}
                <strong>{form.topMargin}px (T)</strong>.
              </p>
            </div>

            {/* Impact: Dashboard */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <LayoutTemplate size={20} />
              </div>
              <h3 className="font-bold text-lg">Startup Behavior</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Every time you or your staff log in during 2026, the system will
                direct you to the <strong>{form.defaultDashboard}</strong>{" "}
                screen.
              </p>
            </div>

            {/* Impact: Time/Date */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-lg">Timekeeping</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Invoices and Logs will be timestamped using the{" "}
                <strong>{form.timeFormat}</strong> format with{" "}
                <strong>{form.dateFormat}</strong> as the date standard.
              </p>
            </div>

            {/* Impact: User Interface */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Languages size={20} />
              </div>
              <h3 className="font-bold text-lg">Localization</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                The core interface is set to <strong>{form.language}</strong>.
                Customer receipts can be toggled to Bengali in future updates.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
