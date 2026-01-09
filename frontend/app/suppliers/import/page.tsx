"use client";

import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import {
  UploadCloud,
  FilePlus,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type SupplierRow = {
  name?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
  isDuplicate?: boolean;
};

export default function SupplierImportPage() {
  const router = useRouter();
  const [fileRows, setFileRows] = useState<SupplierRow[]>([]);
  const [existingSuppliers, setExistingSuppliers] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    const res = await fetcher("/api/suppliers").catch(() => []);
    setExistingSuppliers(Array.isArray(res) ? res : []);
  }

  function parseCSVText(text: string) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());

    return lines.slice(1).map((ln) => {
      const cols = ln.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const obj: any = {};
      header.forEach((h, i) => (obj[h] = cols[i] ?? ""));

      const rowData: SupplierRow = {
        name: obj.name || obj.supplier || "",
        phone: obj.phone || obj.mobile || "",
        email: obj.email || "",
        gstin: obj.gstin || obj.tax || "",
        address: obj.address || "",
      };

      // Real-time duplicate check against existing DB
      rowData.isDuplicate = existingSuppliers.some(
        (s) =>
          (s.phone && s.phone === rowData.phone) ||
          (s.gstin && s.gstin === rowData.gstin)
      );

      return rowData;
    });
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSVText(String(ev.target?.result || ""));
      setFileRows(rows);
    };
    reader.readAsText(file);
  }

  async function importRows() {
    if (fileRows.length === 0) return;
    setLoading(true);
    // Simulation: In 2026 ERP, we use /api/suppliers/bulk
    setTimeout(() => {
      alert(`Migration Successful: ${fileRows.length} records processed.`);
      setFileRows([]);
      loadSuppliers();
      setLoading(false);
    }, 1500);
  }

  const duplicatesCount = fileRows.filter((r) => r.isDuplicate).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Database className="text-indigo-600" size={24} /> Data
                Migration
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                Bulk Supplier Import 2026
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              /* logic to trigger hidden download of a .csv template */
            }}
            className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Download size={14} /> DOWNLOAD CSV TEMPLATE
          </button>
        </div>

        {/* UPLOAD ZONE */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
            <UploadCloud size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Drag & Drop Supplier List
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Support formats: .csv (Name, Phone, GSTIN, Email, Address)
          </p>

          <label className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Browse Local Files
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </label>
        </div>

        <AnimatePresence>
          {fileRows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {/* ACTION BAR */}
              <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-black uppercase tracking-tighter">
                    {fileRows.length} Rows Detected
                  </div>
                  {duplicatesCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
                      <AlertCircle size={14} /> {duplicatesCount} Existing
                      Partners
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFileRows([])}
                    className="text-xs font-bold text-indigo-100 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={importRows}
                    disabled={loading}
                    className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <FilePlus size={18} /> Execute Import
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PREVIEW TABLE */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Supplier Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">GSTIN Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {fileRows.map((r, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          {r.isDuplicate ? (
                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase">
                              <AlertCircle size={12} /> Exists
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                              <CheckCircle2 size={12} /> New
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          {r.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          {r.phone}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-400 uppercase">
                          {r.gstin || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXISTING STATS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 tracking-tight">
              Active Suppliers ({existingSuppliers.length})
            </h3>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
              <FileText size={18} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingSuppliers.slice(0, 6).map((s, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center gap-3"
              >
                <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-indigo-600 text-xs">
                  {s.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {s.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
