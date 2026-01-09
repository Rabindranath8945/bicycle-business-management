"use client";

import { useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Scan,
  FileText,
  Truck,
  Calendar,
  Save,
  Clipboard,
  ChevronLeft,
  Search,
  PackageCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Redesigned Fast Create PO
 * Matches the Enterprise/Odoo UI Theme
 */

export default function FastCreatePO() {
  const smartRef = useRef<HTMLInputElement | null>(null);
  const [smartValue, setSmartValue] = useState("");
  const [supplier, setSupplier] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  useEffect(() => {
    focusSmart();
  }, []);

  const focusSmart = () => setTimeout(() => smartRef.current?.focus(), 50);

  // Totals Calculation
  const subtotal = items.reduce((s, it) => s + it.qty * (it.cost || 0), 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* 1. TOP BAR (Action Header) */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/purchases"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Create Purchase Order
              </h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                New Draft PO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBulkOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
            >
              <Clipboard size={16} /> Bulk Import (Ctrl+I)
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
              <Save size={16} /> Confirm Order
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Inputs & Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. SCANNABLE HUB */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm ring-2 ring-indigo-500/5">
            <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Scan size={14} /> Quick Entry / Scanner
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={smartRef}
                value={smartValue}
                onChange={(e) => setSmartValue(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && alert("Add Logic Called")
                }
                placeholder="Scan barcode or type SKU / Product Name..."
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                {loadingAdd ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                ) : (
                  <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 bg-white border border-gray-200 rounded shadow-sm">
                    Enter
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* B. ITEMS TABLE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <PackageCheck size={18} className="text-gray-500" /> Order Lines
              </h3>
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                {items.length} unique items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 text-[11px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-4 py-4 text-center">Qty</th>
                    <th className="px-4 py-4 text-right">Unit Cost (₹)</th>
                    <th className="px-4 py-4 text-right">Subtotal (₹)</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center opacity-40">
                          <Scan size={48} className="mb-4" />
                          <p className="text-sm font-medium">
                            Ready for scanning...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{row.name}</p>
                          <p className="text-xs text-gray-400 font-mono tracking-tighter">
                            {row.sku || "NO-SKU"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={row.qty}
                            className="w-20 mx-auto block text-center py-1.5 border-gray-200 rounded bg-white shadow-sm focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <input
                            type="number"
                            value={row.cost}
                            className="w-28 ml-auto block text-right py-1.5 border-gray-200 rounded bg-white shadow-sm focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-gray-800">
                          ₹{(row.qty * row.cost).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Metadata & Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* C. SUPPLIER & DATE INFO */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
              <Truck size={16} className="text-gray-400" /> Logistics Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Supplier
                </label>
                <div className="relative mt-1">
                  <input
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Search or Enter Supplier ID"
                    className="w-full pl-3 pr-3 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Expected Arrival
                </label>
                <div className="relative mt-1">
                  <Calendar
                    size={14}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Terms, conditions, or shipping instructions..."
                  className="w-full mt-1 p-3 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* D. ORDER SUMMARY (Odoo style) */}
          <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg shadow-indigo-100">
            <h3 className="text-xs font-bold uppercase tracking-[2px] opacity-60 mb-6">
              Order Summary
            </h3>
            <div className="space-y-4 font-medium">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">GST (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              <div className="h-[1px] bg-white/10 my-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-2xl font-black text-indigo-300">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-xs text-indigo-200">
                <FileText size={14} />
                <span>PO status will be marked as "Draft"</span>
              </div>
              <button className="w-full py-3 bg-white text-indigo-900 font-bold rounded-lg shadow-md hover:bg-indigo-50 transition-colors">
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* BULK IMPORT MODAL (Ctrl+I) */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clipboard className="text-indigo-600" /> Bulk Item Import
              </h2>
              <button
                onClick={() => setBulkOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Paste items in format:{" "}
              <code className="bg-gray-100 px-1 rounded">sku, qty, cost</code>{" "}
              (one per line)
            </p>
            <textarea
              className="w-full h-64 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 font-mono text-sm"
              placeholder="Example:&#10;NIKE-AIR,10,2500&#10;ADIDAS-RUN,5,1800"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setBulkOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                Import Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
