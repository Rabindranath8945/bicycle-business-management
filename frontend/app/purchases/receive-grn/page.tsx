"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import {
  Truck,
  Search,
  Plus,
  Trash2,
  Clipboard,
  PackageCheck,
  Calendar,
  Barcode,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReceiveGRNPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierResults, setSupplierResults] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const [poId, setPoId] = useState("");
  const [loadingPO, setLoadingPO] = useState(false);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState<any[]>([
    {
      id: "init-" + Date.now(),
      productText: "",
      receivedQty: 1,
      rate: 0,
      batchNo: "",
      expiry: "",
    },
  ]);

  // Load suppliers on mount
  useEffect(() => {
    fetcher("/api/suppliers")
      .then((res) => setSuppliers(Array.isArray(res) ? res : res.items || []))
      .catch(() => setSuppliers([]));
  }, []);

  // Filter suppliers locally
  useEffect(() => {
    if (!supplierQuery || selectedSupplier) {
      setSupplierResults([]);
      return;
    }
    const q = supplierQuery.toLowerCase();
    setSupplierResults(
      suppliers.filter((s) => s.name.toLowerCase().includes(q))
    );
  }, [supplierQuery, suppliers, selectedSupplier]);

  const updateRow = (id: string, patch: any) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: "row-" + Date.now(),
        productText: "",
        receivedQty: 1,
        rate: 0,
        batchNo: "",
        expiry: "",
      },
    ]);
  };

  // Totals
  const subtotal = items.reduce(
    (s, it) => s + (it.receivedQty || 0) * (it.rate || 0),
    0
  );
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 1. ENTERPRISE HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/purchases/grn/list"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                Receive Goods (GRN)
              </h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[2px]">
                Inventory Inwarding
              </p>
            </div>
          </div>
          <button
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all font-bold text-sm disabled:opacity-50"
          >
            <PackageCheck size={18} />{" "}
            {saving ? "Processing..." : "Post Inventory"}
          </button>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* A. SOURCE SELECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                Vendor / Supplier
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="Search supplier..."
                  value={
                    selectedSupplier ? selectedSupplier.name : supplierQuery
                  }
                  onChange={(e) => {
                    setSupplierQuery(e.target.value);
                    setSelectedSupplier(null);
                  }}
                />
                {supplierResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-auto">
                    {supplierResults.map((s) => (
                      <div
                        key={s._id}
                        onClick={() => {
                          setSelectedSupplier(s);
                          setSupplierResults([]);
                        }}
                        className="p-3 hover:bg-indigo-50 cursor-pointer text-sm border-b last:border-0"
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                Import from PO
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2.5 bg-gray-50 border-gray-200 rounded-lg text-sm font-mono"
                  placeholder="PO Number..."
                  value={poId}
                  onChange={(e) => setPoId(e.target.value)}
                />
                <button className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-100 transition-all flex items-center gap-2">
                  <Clipboard size={14} /> Fetch
                </button>
              </div>
            </div>
          </div>

          {/* B. ITEMS TABLE (Fixed with onChange) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Inward Items List
              </h3>
              <button
                onClick={addRow}
                className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Manual Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-white">
                  <tr>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-4 py-4 text-center w-24">Qty</th>
                    <th className="px-4 py-4 text-right w-32">Rate (₹)</th>
                    <th className="px-4 py-4 w-40">Batch / Expiry</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((it) => (
                    <tr
                      key={it.id}
                      className="hover:bg-gray-50/50 group transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-gray-900 text-sm"
                          placeholder="Product Name..."
                          value={it.productText}
                          onChange={(e) =>
                            updateRow(it.id, { productText: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          className="w-full text-center py-1.5 bg-gray-50 border-gray-100 rounded text-sm font-bold"
                          value={it.receivedQty}
                          onChange={(e) =>
                            updateRow(it.id, {
                              receivedQty: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          className="w-full text-right py-1.5 bg-gray-50 border-gray-100 rounded text-sm font-bold"
                          value={it.rate}
                          onChange={(e) =>
                            updateRow(it.id, { rate: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        <div className="relative">
                          <Barcode
                            className="absolute left-2 top-2 text-gray-300"
                            size={12}
                          />
                          <input
                            className="w-full pl-7 py-1 bg-white border-gray-200 rounded text-[10px] font-mono"
                            placeholder="Batch No"
                            value={it.batchNo}
                            onChange={(e) =>
                              updateRow(it.id, { batchNo: e.target.value })
                            }
                          />
                        </div>
                        <div className="relative">
                          <Calendar
                            className="absolute left-2 top-2 text-gray-300"
                            size={12}
                          />
                          <input
                            type="date"
                            className="w-full pl-7 py-1 bg-white border-gray-200 rounded text-[10px]"
                            value={it.expiry}
                            onChange={(e) =>
                              updateRow(it.id, { expiry: e.target.value })
                            }
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <span className="font-black text-gray-900 text-sm">
                            ₹{(it.receivedQty * it.rate).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeRow(it.id)}
                            className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Truck size={120} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[3px] opacity-50 mb-8">
              GRN Valuation
            </h3>
            <div className="space-y-4 relative z-10 text-sm">
              <div className="flex justify-between opacity-60">
                <span>Untaxed Amount</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-60">
                <span>Taxation (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              <div className="h-[1px] bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-xs opacity-60">Net Inward Value</span>
                <span className="text-3xl font-black text-indigo-300">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 p-3 rounded-xl border border-emerald-400/20">
                <ShieldCheck size={16} />
                <span>Verified Stock Entry Mode</span>
              </div>
              <button className="w-full py-4 bg-white text-indigo-900 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl">
                CONFIRM RECEIPT
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle size={14} /> Process Checklist
            </h4>
            <ul className="space-y-4 text-xs font-bold text-gray-600">
              <li className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center border",
                    selectedSupplier
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-gray-200"
                  )}
                >
                  {selectedSupplier && <ShieldCheck size={12} />}
                </div>
                Supplier Verified
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
