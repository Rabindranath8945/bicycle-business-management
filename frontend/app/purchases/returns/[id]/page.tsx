"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  ArrowLeft,
  FileText,
  Download,
  Share2,
  Printer,
  Calendar,
  User,
  Package,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

type ReturnItem = {
  product?: { name?: string };
  qty: number;
  rate: number;
  tax: number;
};

const safeNum = (v: any) => Number(v ?? 0);

export default function PurchaseReturnDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [ret, setRet] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher(`/api/purchase-returns/${id}`);
      setRet(res);
    } catch (err) {
      alert("Failed to load return details");
    } finally {
      setLoading(false);
    }
  }

  const openPdf = () => window.open(`/purchases/returns/pdf/${id}`, "_blank");
  const shareWhatsApp = () =>
    window.open(`/purchases/returns/share/${id}`, "_blank");

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!ret)
    return (
      <div className="p-10 text-center bg-[#F8FAFC] min-h-screen">
        <p className="text-slate-500 font-bold">RETURN NOT FOUND</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-indigo-600 font-semibold"
        >
          Go Back
        </button>
      </div>
    );

  const items = (ret.items || []) as ReturnItem[];
  const subtotal = items.reduce(
    (s, it) => s + safeNum(it.qty) * safeNum(it.rate),
    0
  );
  const totalTax = safeNum(ret.totalAmount) - subtotal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* TOP NAVIGATION & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  #{ret.returnNo}
                </h1>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full ring-1 ring-amber-200">
                  Debit Note
                </span>
              </div>
              <p className="text-slate-500 text-xs font-medium">
                Recorded via ERP v2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={shareWhatsApp}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:opacity-90 transition-opacity"
            >
              <Share2 size={16} /> WhatsApp
            </button>
            <button
              onClick={openPdf}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Printer size={16} /> Print / PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Package size={14} /> Itemized Return
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Product Description</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Rate</th>
                      <th className="px-6 py-4 text-right">Tax</th>
                      <th className="px-6 py-4 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">
                            {it.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            SKU: {it.product?.name?.slice(0, 3).toUpperCase()}
                            -RTN
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          {it.qty}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          ₹{safeNum(it.rate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-400">
                          {it.tax}%
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                          ₹
                          {(
                            safeNum(it.qty) *
                            safeNum(it.rate) *
                            (1 + safeNum(it.tax) / 100)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* SIDEBAR INFO */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Summary Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Supplier
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {ret.supplier?.name || "General Supplier"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Date Processed
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(ret.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Info size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Linked Invoice
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {ret.purchase || "Direct Return"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FINANCIALS */}
            <section className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
              <h3 className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                Settlement
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Untaxed Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">CGST (9%)</span>
                  <span className="font-medium">
                    ₹{(totalTax / 2).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">SGST (9%)</span>
                  <span className="font-medium">
                    ₹{(totalTax / 2).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-px bg-slate-800 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-300">
                    Total Refund
                  </span>
                  <span className="text-2xl font-black text-white">
                    ₹{safeNum(ret.totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
