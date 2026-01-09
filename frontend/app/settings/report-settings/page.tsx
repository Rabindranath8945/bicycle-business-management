"use client";

import React, { useState } from "react";
import {
  Save,
  Activity,
  Calendar,
  Clock,
  Download,
  FileText,
  Check,
  Database,
  Upload,
  RefreshCw,
  PieChart,
  ShieldCheck,
} from "lucide-react";

type ExportFormat = "PDF" | "Excel";

export default function ReportDataSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // State for the form
  const [form, setForm] = useState({
    financialYearStartMonth: 3, // April (0-indexed 3)
    dateFormat: "DD-MM-YYYY",
    exportFormat: "Excel" as ExportFormat,
    enableAutoBackup: true,
  });

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleOption = (key: keyof typeof form) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("System data protocols updated for 2026.");
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
              R
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Report Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck size={12} /> Data Standards: 2026
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* REPORTS CONTROL */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <PieChart size={12} /> Reports & Formatting
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  Financial Year Start
                </label>
                <select
                  value={form.financialYearStartMonth}
                  onChange={(e) =>
                    updateForm(
                      "financialYearStartMonth",
                      Number(e.target.value)
                    )
                  }
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={0}>January (Calendar Year)</option>
                  <option value={3}>April (Indian Fiscal Year)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  System Date Format
                </label>
                <select
                  value={form.dateFormat}
                  onChange={(e) => updateForm("dateFormat", e.target.value)}
                  className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="DD-MM-YYYY">
                    DD-MM-YYYY (e.g., 09-01-2026)
                  </option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard)</option>
                </select>
              </div>
            </div>
          </section>

          {/* EXPORT FORMATS */}
          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Download size={12} /> Default Export
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                label="PDF"
                checked={form.exportFormat === "PDF"}
                onClick={() => updateForm("exportFormat", "PDF")}
                icon={FileText}
              />
              <ActionButton
                label="Excel"
                checked={form.exportFormat === "Excel"}
                onClick={() => updateForm("exportFormat", "Excel")}
                icon={Database}
              />
            </div>
          </section>

          {/* BACKUP */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Database size={12} /> Data Security
            </h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-blue-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                <Upload size={14} /> Run Manual Backup
              </button>
              <ActionButton
                label="Auto-Cloud Backup"
                checked={form.enableAutoBackup}
                onClick={() => toggleOption("enableAutoBackup")}
                icon={RefreshCw}
              />
            </div>
          </section>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Syncing..." : "Save Data Policy"}
        </button>
      </aside>

      {/* 2. LIVE IMPACT PREVIEW */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Data Logic Impact
            </h2>
            <p className="text-slate-500 font-medium">
              How these settings influence your 2026 business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <h3 className="font-bold text-lg">Financial Reporting</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Your Profit & Loss statements will generate for the{" "}
                <strong>
                  {form.financialYearStartMonth === 3
                    ? "Apr 2025 - Mar 2026"
                    : "Jan 2026 - Dec 2026"}
                </strong>{" "}
                cycle.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <Download size={20} />
              </div>
              <h3 className="font-bold text-lg">Data Mobility</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                The one-click export button on the dashboard will now generate
                an <strong>{form.exportFormat}</strong> document using the{" "}
                <strong>{form.dateFormat}</strong> timestamp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-lg">Redundancy Status</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {form.enableAutoBackup
                  ? "Automatic 256-bit encrypted cloud backups are scheduled for 12:00 AM daily."
                  : "Automatic backup is disabled. You must manually export data to prevent 2026 fiscal data loss."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-lg">Retention Policy</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Reports are cached for 30 days to ensure near-instant loading of
                historical 2025/2026 data trends.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
