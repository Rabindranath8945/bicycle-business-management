// /app/suppliers/dashboard/[id]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  Download,
  FileText,
  Plus,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Package,
  History,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const safeNum = (v: any) => Number(v ?? 0);

// Fallback Data for 2026 ERP Continuity
const MOCK = {
  supplier: { name: "Loading Partner...", gstin: "---", phone: "---" },
  kpis: {
    totalPurchase: 0,
    totalReturns: 0,
    outstandingDue: 0,
    lastPayment: 0,
    grnCount: 0,
  },
  monthly: [],
  recentBills: [],
  recentReturns: [],
};

export default function SupplierDashboardPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [supplier, setSupplier] = useState<any>(MOCK.supplier);
  const [kpis, setKpis] = useState<any>(MOCK.kpis);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [recentReturns, setRecentReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAll();
  }, [id]);

  async function loadAll() {
    setLoading(true);
    try {
      // FIX: Parallel Data Fetching (Promise.allSettled)
      // This prevents the "Waterfall" error where one slow request blocks others.
      const [supRes, kpiRes, monthRes, billsRes, retRes] =
        await Promise.allSettled([
          fetcher(`/api/suppliers/${id}`),
          fetcher(`/api/suppliers/${id}/summary`),
          fetcher(`/api/suppliers/${id}/monthly`),
          fetcher(`/api/purchases?supplier=${id}&limit=10`),
          fetcher(`/api/purchase-returns?supplier=${id}&limit=10`),
        ]);

      // Defensive state updates
      setSupplier(supRes.status === "fulfilled" ? supRes.value : MOCK.supplier);
      setKpis(kpiRes.status === "fulfilled" ? kpiRes.value : MOCK.kpis);
      setMonthly(
        monthRes.status === "fulfilled" && Array.isArray(monthRes.value)
          ? monthRes.value
          : []
      );
      setRecentBills(
        billsRes.status === "fulfilled" && Array.isArray(billsRes.value)
          ? billsRes.value
          : []
      );
      setRecentReturns(
        retRes.status === "fulfilled" && Array.isArray(retRes.value)
          ? retRes.value
          : []
      );
    } catch (e) {
      console.error("Dashboard Sync Error:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
            Synchronizing Partner Data...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.back()}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
            >
              <ArrowLeft
                size={20}
                className="text-slate-600 group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {supplier?.name}
                </h1>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-200">
                  Active Partner
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {supplier?.gstin} • {supplier?.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
              <Download size={18} /> Export
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all">
              <FileText size={18} /> Statement
            </button>
            <Link
              href={`/purchases/create-bill?supplier=${id}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              <Plus size={18} /> New Bill
            </Link>
          </div>
        </div>

        {/* KPI METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Purchased Value",
              val: kpis?.totalPurchase,
              icon: <TrendingUp size={20} />,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Returns Value",
              val: kpis?.totalReturns,
              icon: <Package size={20} />,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Payable Due",
              val: kpis?.outstandingDue,
              icon: <AlertCircle size={20} />,
              color: "text-rose-600",
              bg: "bg-rose-50",
              border: "border-rose-100",
            },
            {
              label: "Last Settlement",
              val: kpis?.lastPayment,
              icon: <CreditCard size={20} />,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm ${
                kpi.border || ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  {kpi.icon}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live 2026
                </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">
                {kpi.label}
              </p>
              <h2 className={`text-2xl font-black mt-1 ${kpi.color}`}>
                ₹{safeNum(kpi.val).toLocaleString("en-IN")}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* TREND CHART & TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8 text-slate-900">
              <h3 className="text-lg font-black tracking-tight">
                Financial Velocity
              </h3>
              <History size={20} className="text-slate-300" />
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="colorPur" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      fontWeight: 700,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="purchases"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorPur)"
                  />
                  <Area
                    type="monotone"
                    dataKey="returns"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Package size={80} />
            </div>
            <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4 relative z-10">
              {recentBills.slice(0, 5).map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <div>
                    <p className="text-xs font-bold">{b.billNo}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-black">
                    ₹{safeNum(b.totalAmount).toLocaleString()}
                  </p>
                </div>
              ))}
              {recentBills.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-10">
                  No recent transactions
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
