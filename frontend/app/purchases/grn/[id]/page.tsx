"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import {
  Printer,
  Package,
  User,
  CalendarDays,
  ArrowLeft,
  FileText,
  Hash,
  BadgeCheck,
  Box,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GRNDetail() {
  const { id } = useParams() as any;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    try {
      const r = await fetcher(`/api/grn/${id}`);
      setData(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="p-10 flex flex-col items-center justify-center animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-96 w-full max-w-5xl bg-gray-100 rounded-2xl" />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20 print:bg-white print:p-0">
      {/* 1. TOP ACTION BAR (Hidden on Print) */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Goods Receipt Note
            </h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[2px]">
              Inventory Inwarding Document
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <Printer size={18} /> Print Document
          </button>
          <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-bold flex items-center gap-2">
            <BadgeCheck size={18} /> Posted to Stock
          </div>
        </div>
      </div>

      {/* 2. THE DOCUMENT (Main Card) */}
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Document Header Section */}
        <div className="bg-indigo-900 p-8 text-white flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-200">
              <Hash size={12} /> Document Identifier
            </div>
            <h2 className="text-4xl font-black tracking-tight">
              {data.grnNumber}
            </h2>
            <div className="flex items-center gap-4 text-sm text-indigo-100">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="opacity-60" />
                <span>
                  {new Date(
                    data.receivedAt || data.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex items-center gap-2">
                <FileText size={16} className="opacity-60" />
                <span>
                  Ref PO:{" "}
                  <span className="font-bold">
                    {data.poId || "Direct Inward"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-indigo-900">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                Supplier Source
              </p>
              <p className="font-bold text-lg leading-tight">
                {data.supplier?.name || "N/A"}
              </p>
              <p className="text-xs text-indigo-200">
                {data.supplier?.phone || "No contact provided"}
              </p>
            </div>
          </div>
        </div>

        {/* 3. STOCK TABLE */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
              <Box size={14} /> Received Inventory Lines
            </h3>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
              {data.items?.length} Unique SKUs
            </span>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4 text-center">Batch Assignment</th>
                  <th className="px-6 py-4 text-center">Inward Qty</th>
                  <th className="px-6 py-4 text-right">Acquisition Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.items?.map((it: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900">
                        {it.product?.name || it.product}
                      </div>
                      <div className="text-[10px] font-mono text-indigo-600 mt-1 uppercase tracking-tighter">
                        SKU: {it.product?.sku || "GENERAL-ITEM"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded font-mono text-[11px] font-bold">
                        {it.batchNo || "NO-BATCH"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                        {it.receivedQty}{" "}
                        <span className="text-[10px] opacity-40">Units</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="font-bold text-gray-900">
                        ₹{(it.cost || 0).toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-gray-400">Excl. GST</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Total Items
                </p>
                <p className="font-black text-xl text-gray-900">
                  {data.items.length}
                </p>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl md:col-span-2 flex items-center justify-between px-8">
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">
                  Total Valuation (Untaxed)
                </p>
                <p className="text-xs text-indigo-900 font-medium italic">
                  Verified by Warehouse Manager
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-indigo-900">
                  ₹
                  {data.items
                    .reduce(
                      (s: number, i: any) => s + i.receivedQty * (i.cost || 0),
                      0
                    )
                    .toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:flex justify-between mt-12 px-10">
        <div className="text-center border-t border-gray-300 pt-4 w-48">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Warehouse Sign
          </p>
        </div>
        <div className="text-center border-t border-gray-300 pt-4 w-48">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Accounts Verified
          </p>
        </div>
      </div>
    </div>
  );
}
