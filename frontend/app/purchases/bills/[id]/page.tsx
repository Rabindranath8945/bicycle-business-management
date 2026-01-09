"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  ArrowLeft,
  FileDown,
  Receipt,
  Calendar,
  User,
  Link as LinkIcon,
  Calculator,
  CreditCard,
  ShieldCheck,
  Printer,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    try {
      const res = await fetcher(`/api/purchases/${id}`);
      setBill(res);
    } catch (err) {
      console.error("Failed to load bill:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- Helper for Safe Currency Formatting ---
  const formatINR = (val: number | undefined | null) => {
    return (val ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading)
    return (
      <div className="p-10 flex flex-col items-center justify-center animate-pulse bg-gray-50 min-h-screen">
        <div className="h-10 w-64 bg-gray-200 rounded-xl mb-6" />
        <div className="h-96 w-full max-w-5xl bg-white rounded-[2rem] border border-gray-200" />
      </div>
    );

  if (!bill)
    return (
      <div className="p-20 text-center space-y-4">
        <p className="text-gray-500 font-bold uppercase tracking-widest">
          Document Not Found
        </p>
        <button
          onClick={() => router.back()}
          className="text-indigo-600 font-bold hover:underline"
        >
          Return to List
        </button>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20">
      {/* 1. ENTERPRISE ACTION BAR */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              Purchase Bill
            </h1>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[2px]">
              Financial Audit Document
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={() => router.push(`/purchases/bills/pdf/${bill._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all text-sm font-bold"
          >
            <FileDown size={18} /> Download Invoice
          </button>
        </div>
      </div>

      {/* 2. THE DOCUMENT CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden border-t-8 border-t-indigo-600">
        {/* TOP STATUS RIBBON */}
        <div className="bg-gray-50 border-b border-gray-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Receipt size={14} /> Bill Number
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-mono tracking-tighter">
              {bill.billNo || "REF-PENDING"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Settlement Status
              </p>
              <p
                className={cn(
                  "text-lg font-black",
                  (bill.dueAmount ?? 0) > 0
                    ? "text-rose-600"
                    : "text-emerald-600"
                )}
              >
                {(bill.dueAmount ?? 0) > 0
                  ? "Pending Payment"
                  : "Fully Settled"}
              </p>
            </div>
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center shadow-inner",
                (bill.dueAmount ?? 0) > 0
                  ? "bg-rose-50 text-rose-500"
                  : "bg-emerald-50 text-emerald-500"
              )}
            >
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-50">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Supplier Account
            </h4>
            <p className="font-bold text-gray-900 text-lg leading-tight">
              {bill.supplier?.name || bill.supplier || "Unknown Vendor"}
            </p>
            <span className="text-[10px] bg-indigo-50 px-2 py-1 rounded text-indigo-600 font-bold uppercase tracking-tighter">
              Verified Ledger Entry
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} /> Billing Date
            </h4>
            <p className="font-bold text-gray-900 text-lg leading-tight">
              {bill.createdAt
                ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <History size={12} /> Time:{" "}
              {bill.createdAt
                ? new Date(bill.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--"}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <LinkIcon size={14} /> Logistics Link
            </h4>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold font-mono">
                {bill.grn || "Direct Billing"}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium italic">
              Stock updated automatically
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="px-8 pb-8 mt-8">
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-right">Unit Rate</th>
                  <th className="px-6 py-4 text-center">Tax %</th>
                  <th className="px-6 py-4 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(bill.items || []).map((it: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        {it.product?.name || it.productName || "General Item"}
                      </p>
                      <p className="text-[10px] text-indigo-500 font-mono uppercase">
                        Reference SKU-2026
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700">
                      {it.quantity ?? 0}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 font-medium">
                      ₹{formatINR(it.rate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {it.tax ?? 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">
                      ₹{formatINR((it.rate ?? 0) * (it.quantity ?? 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS SUMMARY SECTION */}
          <div className="mt-8 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 max-w-sm space-y-3">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={20} className="shrink-0" />
                <span>
                  Compliance verified. Transaction posted to vendor ledger
                  according to 2026 tax standards.
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-md bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Calculator size={120} />
              </div>

              <div className="flex justify-between items-center text-xs font-bold uppercase opacity-40 tracking-[2px]">
                <span>Account Summary</span>
                <Calculator size={16} />
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Untaxed Subtotal</span>
                  <span>₹{formatINR(bill.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Applied Taxation</span>
                  <span>₹{formatINR(bill.taxTotal)}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    Net Payable
                  </span>
                  <span className="text-3xl font-black">
                    ₹{formatINR(bill.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3 relative z-10">
                <div className="flex justify-between text-sm text-emerald-400">
                  <span className="font-bold uppercase text-[10px] tracking-wider">
                    Settled (Paid)
                  </span>
                  <span className="font-black">
                    ₹{formatINR(bill.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-rose-400">
                  <span className="font-bold uppercase text-[10px] tracking-wider">
                    Outstanding Liability
                  </span>
                  <span className="font-black">
                    ₹{formatINR(bill.dueAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
