"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  AlertCircle,
  MoreHorizontal,
  Download,
  Layers,
  Package,
  Calendar,
  Activity,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Fallback Data (Extended) ---
interface KPI {
  id: string;
  title: string;
  amount: string;
  sub?: string;
  delta?: number;
  color?: string;
  icon: any;
}
interface RecentSale {
  id: string;
  invoiceNo: string;
  customer: string;
  amount: number;
  time: string;
  status: "Paid" | "Pending";
  method: string;
}
interface BestSellerItem {
  id: string;
  name: string;
  sales: number;
  qty: number;
}

interface DashboardResponse {
  kpis: KPI[];
  salesPurchaseSeries: { month: string; sales: number; purchase: number }[];
  recentSales: RecentSale[];
  bestSellers: BestSellerItem[];
}

const FALLBACK_DATA: DashboardResponse = {
  kpis: [],
  salesPurchaseSeries: [
    { month: "Jan", sales: 4000, purchase: 2400 },
    { month: "Feb", sales: 3000, purchase: 1398 },
    { month: "Mar", sales: 9000, purchase: 2000 },
    { month: "Apr", sales: 7500, purchase: 2780 },
    { month: "May", sales: 8500, purchase: 1890 },
    { month: "Jun", sales: 12000, purchase: 2390 },
  ],
  recentSales: [
    {
      id: "1",
      invoiceNo: "INV-001",
      customer: "John Doe",
      amount: 120.0,
      time: "2 mins",
      status: "Paid",
      method: "Paypal",
    },
    {
      id: "2",
      invoiceNo: "INV-002",
      customer: "Sarah Smith",
      amount: 450.5,
      time: "1 hour",
      status: "Pending",
      method: "Apple Pay",
    },
    {
      id: "3",
      invoiceNo: "INV-003",
      customer: "ACME Corp",
      amount: 1200.0,
      time: "3 hours",
      status: "Paid",
      method: "Stripe",
    },
    {
      id: "4",
      invoiceNo: "INV-004",
      customer: "Bob Johnson",
      amount: 1569.0,
      time: "1 Day",
      status: "Paid",
      method: "PayU",
    },
    {
      id: "5",
      invoiceNo: "INV-005",
      customer: "Tech Solutions",
      amount: 1478.0,
      time: "2 Days",
      status: "Pending",
      method: "Paytm",
    },
  ],
  bestSellers: [
    { id: "p1", name: "Lobar Handy", sales: 6547, qty: 5260 },
    { id: "p2", name: "Bold V3.2", sales: 3474, qty: 5147 },
    { id: "p3", name: "Lenovo 3rd Generation", sales: 1478, qty: 58784 },
    { id: "p4", name: "Apple Series 5 Watch", sales: 987, qty: 63240 },
    { id: "p5", name: "Woodcraft Sandal", sales: 784, qty: 5597 },
  ],
};

// --- Components ---

const BestSellerList = ({ items }: { items: BestSellerItem[] }) => (
  <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold">Best Sellers</h3>
      <button className="text-blue-400 text-sm hover:underline">
        View All
      </button>
    </div>
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-slate-400">Total Sales: {item.qty}+</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-400">{item.sales}</p>
            <p className="text-xs text-slate-500">units sold</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecentTransactionsTable = ({ items }: { items: RecentSale[] }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
      <button className="text-blue-600 text-sm font-semibold hover:underline">
        View All
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Payment Method
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-50">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-0">
                    <div className="text-sm font-medium text-slate-900">
                      {item.customer}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.invoiceNo} • {item.time}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                {item.method}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={cn(
                    "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                    item.status === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                ${item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main Dashboard Component ---

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse>(FALLBACK_DATA);
  // Assume stock alerts data exists elsewhere

  return (
    <div className="space-y-8 pb-10">
      {/* 1. TOP HEADER & GLOBAL ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Executive Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} /> Real-time data for December 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
            <Download size={16} /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Layers size={16} /> Manage View
          </button>
        </div>
      </div>

      {/* 2. PRIMARY KPI GRID - GLASS DESIGN (Unchanged) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Net Revenue",
            val: "$124.5k",
            trend: "+12.5%",
            up: true,
            icon: DollarSign,
            color: "bg-blue-600",
          },
          {
            title: "Active Orders",
            val: "1,240",
            trend: "+4.3%",
            up: true,
            icon: ShoppingBag,
            color: "bg-indigo-600",
          },
          {
            title: "Returns",
            val: "$2.1k",
            trend: "-2.1%",
            up: false,
            icon: TrendingDown,
            color: "bg-rose-600",
          },
          {
            title: "Purchase Due",
            val: "$14.8k",
            trend: "+0.5%",
            up: true,
            icon: AlertCircle,
            color: "bg-amber-600",
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div
                className={cn(
                  "p-3 rounded-2xl text-white shadow-lg",
                  kpi.color
                )}
              >
                <kpi.icon size={20} />
              </div>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                  kpi.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                )}
              >
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{" "}
                {kpi.trend}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {kpi.title}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {kpi.val}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CORE ANALYTICS BENTO SECTION (Unchanged layout structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* REVENUE GROWTH AREA CHART (8 COLS) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Revenue Velocity
              </h3>
              <p className="text-sm text-slate-400">
                Projected vs Actual sales performance
              </p>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesPurchaseSeries}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="rgba(37, 99, 235, 0.15)"
                />
                <Area
                  type="monotone"
                  dataKey="purchase"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT SIDE WIDGETS (STOCK ALERTS & TOP SELLING) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden">
            <h3 className="text-lg font-bold">Stock Alerts</h3>
            <div className="mt-6 space-y-4 relative z-10">
              {["Bicycle Frame X2"].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg text-white">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Bicycle Frame X2</p>
                      <p className="text-[10px] text-slate-400">
                        Only 2 units left
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold bg-white text-slate-900 px-3 py-1 rounded-full uppercase">
                    Order
                  </button>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 p-8 opacity-20">
              <AlertCircle size={120} />
            </div>
          </div>

          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex justify-between items-center">
              Sales by Country
            </h3>
            <div className="mt-4 flex items-center justify-center h-48">
              {/* Placeholder for a map visualization */}
              <div className="text-slate-400 text-sm">Interactive Map View</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. NEW ROW: BEST SELLERS & RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <BestSellerList items={data.bestSellers} />
        </div>
        <div className="lg:col-span-8">
          <RecentTransactionsTable items={data.recentSales} />
        </div>
      </div>
    </div>
  );
}
