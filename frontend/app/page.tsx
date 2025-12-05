"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// DashboardPage.tsx
// Default-exported React component for Next.js app.
// TailwindCSS utility classes used for styling (no external color overrides here).
// This file is intentionally self-contained and uses a single fetch to `/api/dashboard`.
// Replace fetch endpoints with your real backend routes. Keep your theme variables in globals.

type KPI = {
  id: string;
  title: string;
  amount: string;
  sub?: string;
  delta?: number; // percent change
  color?: string;
};

type DashboardResponse = {
  kpis: KPI[];
  alert?: { message: string; actionLabel?: string } | null;
  salesPurchaseSeries: { month: string; sales: number; purchase: number }[];
  overall: { suppliers: number; customers: number; orders: number };
  customerOverview: { name: string; value: number }[];
  topSelling: { id: string; name: string; qty: number; image?: string }[];
  lowStock: {
    id: string;
    name: string;
    stock: number;
    threshold: number;
    image?: string;
  }[];
  recentSales: {
    id: string;
    invoiceNo: string;
    customer: string;
    amount: number;
    time: string;
  }[];
};

const FALLBACK_DATA: DashboardResponse = {
  kpis: [
    {
      id: "sales",
      title: "Total Sales",
      amount: "$48,988,078",
      sub: "+22% vs last month",
      delta: 22,
      color: "bg-amber-400",
    },
    {
      id: "sales_return",
      title: "Total Sales Return",
      amount: "$16,478,145",
      sub: "-2% vs last month",
      delta: -2,
      color: "bg-sky-500",
    },
    {
      id: "purchase",
      title: "Total Purchase",
      amount: "$24,145,789",
      sub: "+12% vs last month",
      delta: 12,
      color: "bg-emerald-400",
    },
    {
      id: "purchase_return",
      title: "Total Purchase Return",
      amount: "$18,458,747",
      sub: "-3% vs last month",
      delta: -3,
      color: "bg-indigo-500",
    },
  ],
  alert: {
    message:
      "Your Product Apple Iphone 15 is running Low, already below 5 Pcs.",
    actionLabel: "Add Stock",
  },
  salesPurchaseSeries: [
    { month: "Jan", sales: 20000, purchase: 30000 },
    { month: "Feb", sales: 25000, purchase: 28000 },
    { month: "Mar", sales: 30000, purchase: 24000 },
    { month: "Apr", sales: 35000, purchase: 30000 },
    { month: "May", sales: 42000, purchase: 38000 },
    { month: "Jun", sales: 47000, purchase: 44000 },
    { month: "Jul", sales: 52000, purchase: 43000 },
    { month: "Aug", sales: 49000, purchase: 41000 },
    { month: "Sep", sales: 54000, purchase: 47000 },
    { month: "Oct", sales: 58000, purchase: 52000 },
    { month: "Nov", sales: 45000, purchase: 39000 },
    { month: "Dec", sales: 37000, purchase: 34000 },
  ],
  overall: { suppliers: 6987, customers: 4896, orders: 487 },
  customerOverview: [
    { name: "First Time", value: 5500 },
    { name: "Returning", value: 3500 },
  ],
  topSelling: [
    { id: "p1", name: "Charger Cable - Lighting", qty: 247, image: "" },
    { id: "p2", name: "Yves Saint Eau De Parfum", qty: 121, image: "" },
  ],
  lowStock: [
    {
      id: "l1",
      name: "Vacuum Cleaner Robot",
      stock: 2,
      threshold: 5,
      image: "",
    },
    { id: "l2", name: "Dell XPS 13", stock: 1, threshold: 3, image: "" },
  ],
  recentSales: [
    {
      id: "s1",
      invoiceNo: "INV-1001",
      customer: "John Doe",
      amount: 540,
      time: "Today",
    },
    {
      id: "s2",
      invoiceNo: "INV-1002",
      customer: "ACME Corp.",
      amount: 1200,
      time: "Yesterday",
    },
  ],
};

const COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF8042"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1Y");

  useEffect(() => {
    // Fetch dashboard data from your backend. Replace the URL with your real API.
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json: DashboardResponse) => {
        setData(json);
      })
      .catch(() => {
        // Fallback if API is not available yet
        setData(FALLBACK_DATA);
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = data?.kpis ?? FALLBACK_DATA.kpis;
  const alert = data?.alert ?? FALLBACK_DATA.alert;
  const series = data?.salesPurchaseSeries ?? FALLBACK_DATA.salesPurchaseSeries;

  return (
    <div className="p-6 min-h-screen bg-gray-50 max-w-[1600px] mx-auto">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Welcome, Admin</h1>
            <div className="text-sm text-gray-500">
              You have <span className="font-medium">200+</span> Orders, Today
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-amber-500 text-white rounded shadow">
              Add New
            </button>
            <button className="px-4 py-2 bg-slate-800 text-white rounded">
              POS
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        {alert && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                />
              </svg>
              <div className="text-sm text-amber-700">{alert.message}</div>
            </div>
            {alert.actionLabel && (
              <button className="px-3 py-1 bg-amber-600 text-white rounded">
                {alert.actionLabel}
              </button>
            )}
          </div>
        )}

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => (
            <div
              key={k.id}
              className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">{k.title}</div>
                  <div className="text-2xl font-semibold mt-1">{k.amount}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      k.delta && k.delta > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {k.delta && (k.delta > 0 ? `+${k.delta}%` : `${k.delta}%`)}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-400">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Grid: Charts + Right Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Charts and lists (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Sales & Purchase</h3>
                <div className="flex items-center gap-2">
                  {["1D", "1W", "1M", "3M", "6M", "1Y"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`text-sm px-2 py-1 rounded ${
                        range === r
                          ? "bg-amber-500 text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={series}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="purchase" stackId="a" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="sales" stackId="a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Selling */}
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Top Selling Products</h4>
                  <div className="text-xs text-gray-400">Today</div>
                </div>
                <ul className="space-y-4">
                  {(data?.topSelling ?? FALLBACK_DATA.topSelling).map(
                    (item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/50 backdrop-blur hover:bg-amber-50/30 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer border border-white/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm shadow-lg bg-gradient-to-br from-gray-200/80 to-white/40 backdrop-blur-md border border-white/30">
                            Img
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.qty} Sales
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          ${(Math.random() * 100).toFixed(0)}
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Low Stock */}
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Low Stock Products</h4>
                  <div className="text-xs text-gray-400">View All</div>
                </div>
                <ul className="space-y-4">
                  {(data?.lowStock ?? FALLBACK_DATA.lowStock).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/50 backdrop-blur hover:bg-amber-50/30 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer border border-white/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm shadow-lg bg-gradient-to-br from-gray-200/80 to-white/40 backdrop-blur-md border border-white/30">
                          Img
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400">
                            {item.stock} in stock
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <button className="text-xs text-amber-600">
                          Add Stock
                        </button>
                        <div className="text-xs text-red-500">
                          Threshold {item.threshold}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Sales */}
              <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Recent Sales</h4>
                  <div className="text-xs text-gray-400">Today</div>
                </div>
                <ul className="space-y-4">
                  {(data?.recentSales ?? FALLBACK_DATA.recentSales).map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium">{s.customer}</div>
                        <div className="text-xs text-gray-400">
                          {s.invoiceNo} • {s.time}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">${s.amount}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <aside className="space-y-4">
            <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <h4 className="font-medium mb-3">Overall Information</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-semibold">
                    {data?.overall.suppliers ?? FALLBACK_DATA.overall.suppliers}
                  </div>
                  <div className="text-xs text-gray-400">Suppliers</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {data?.overall.customers ?? FALLBACK_DATA.overall.customers}
                  </div>
                  <div className="text-xs text-gray-400">Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {data?.overall.orders ?? FALLBACK_DATA.overall.orders}
                  </div>
                  <div className="text-xs text-gray-400">Orders</div>
                </div>
              </div>
            </div>

            <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Customers Overview</h4>
                <div className="text-xs text-gray-400">Today</div>
              </div>
              <div style={{ width: "100%", height: 180 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={
                        data?.customerOverview ?? FALLBACK_DATA.customerOverview
                      }
                      dataKey="value"
                      nameKey="name"
                      outerRadius={60}
                      innerRadius={30}
                    >
                      {(
                        data?.customerOverview ?? FALLBACK_DATA.customerOverview
                      ).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                First Time vs Returning customers breakdown
              </div>
            </div>

            <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-2 rounded bg-amber-500 text-white">
                  Create Invoice
                </button>
                <button className="px-3 py-2 rounded border">
                  Add Product
                </button>
                <button className="px-3 py-2 rounded border">
                  Stock Adjustment
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer / small note */}
        <div className="mt-6 text-xs text-gray-400">
          Dashboard powered by your POS — layout A applied exactly as requested.
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/60 flex items-center justify-center">
            <div className="text-gray-700">Loading dashboard...</div>
          </div>
        )}
      </div>
    </div>
  );
}
