"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Printer,
  Truck,
  Calendar,
  Hash,
  User,
  Package,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function POViewPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [po, setPO] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher(`/api/purchase-orders/${id}`);
      setPO(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "draft":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "complete":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="p-10 flex flex-col items-center justify-center animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-64 w-full max-w-4xl bg-gray-100 rounded-xl" />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20">
      {/* 1. TOP ACTION BAR */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              {po?.poNumber || "PO-0000"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-widest",
                  getStatusStyles(po?.status)
                )}
              >
                {po?.status || "Unknown"}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Created on {new Date(po?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            <Printer size={18} /> Print PDF
          </button>
          {po?.status === "draft" && (
            <button
              onClick={() => {}} // confirmPO logic
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all text-sm font-bold"
            >
              <CheckCircle size={18} /> Confirm Order
            </button>
          )}
          {po?.status !== "cancelled" && (
            <button
              onClick={() => {}} // cancelPO logic
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-all text-sm font-bold"
            >
              <XCircle size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* 2. DOCUMENT BODY */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* A. Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Vendor Information
            </h4>
            <div>
              <p className="font-bold text-gray-900">
                {po?.supplier?.name || "Official Vendor"}
              </p>
              <p className="text-sm text-gray-500">
                ID: {po?.supplier?._id?.toUpperCase() || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Truck size={14} /> Shipping Status
            </h4>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Standard Delivery
                </p>
                <p className="text-xs text-emerald-600 font-medium italic">
                  Priority fulfillment
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} /> Key Dates
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Ordered:</span>
                <span className="font-medium text-gray-700">
                  {new Date(po?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expected:</span>
                <span className="font-medium text-gray-900">TBD</span>
              </div>
            </div>
          </div>
        </div>

        {/* B. Line Items Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider">
              Purchase Order Lines
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white border-b border-gray-50">
              <tr>
                <th className="px-6 py-4">Product / SKU</th>
                <th className="px-6 py-4 text-center">Qty Ordered</th>
                <th className="px-6 py-4 text-center">Qty Received</th>
                <th className="px-6 py-4 text-right">Unit Cost (₹)</th>
                <th className="px-6 py-4 text-right">Line Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(po?.items || []).map((it: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {it.productName || it.product}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">
                      SKU-{i}4500
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-700">
                    {it.qtyOrdered}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs font-bold",
                        it.qtyReceived >= it.qtyOrdered
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {it.qtyReceived || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ₹{it.cost?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">
                    ₹{(it.qtyOrdered * it.cost).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* TOTALS FOOTER */}
            <tfoot className="bg-indigo-900 text-white">
              <tr>
                <td colSpan={3} className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs opacity-60">
                    <AlertCircle size={14} /> All prices inclusive of taxes
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-xs uppercase font-bold opacity-60">
                  Grand Total
                </td>
                <td className="px-6 py-4 text-right text-xl font-black">
                  ₹
                  {(po?.items || [])
                    .reduce((s: number, i: any) => s + i.qtyOrdered * i.cost, 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
