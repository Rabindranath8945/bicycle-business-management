"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown, // Added missing import
  ShoppingCart,
  Receipt,
  RotateCcw,
  ArrowRight,
  Plus,
  Warehouse,
  Users,
  AlertTriangle,
  CreditCard,
  FilePlus,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Define the shape of our data
type KPIs = {
  totalInvoices: number;
  pendingPayments: number;
  retailSales: number;
  returns: number;
  monthSales: number;
  receivables: number;
  monthlySeries: number[];
};

const FALLBACK_KPI_DATA: KPIs = {
  totalInvoices: 4500,
  pendingPayments: 850,
  retailSales: 3100,
  returns: 120,
  monthSales: 156890,
  receivables: 45890,
  monthlySeries: [
    20000, 25000, 30000, 35000, 42000, 47000, 52000, 49000, 54000, 58000, 45000,
    37000,
  ],
};

// Workflow data definition
const WORKFLOW_ITEMS = [
  {
    title: "New Invoice",
    desc: "Create billing",
    icon: FilePlus,
    href: "#",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Add Customer",
    desc: "Grow database",
    icon: UserPlus,
    href: "#",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Inventory",
    desc: "Stock levels",
    icon: Warehouse,
    href: "#",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Reports",
    desc: "View analytics",
    icon: ClipboardList,
    href: "#",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function SalesDashboard() {
  const [kpis] = useState<KPIs | null>(FALLBACK_KPI_DATA);

  const spark = useMemo(
    () => (kpis ? kpis.monthlySeries : new Array(12).fill(0)),
    [kpis]
  );

  const KPICard = ({
    title,
    value,
    sub,
    icon: Icon,
    colorClass,
    delta,
  }: {
    title: string;
    value: string | number;
    sub: string;
    icon: any;
    colorClass: string;
    delta?: number;
  }) => (
    <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-xl text-white shadow-md", colorClass)}>
          <Icon size={20} />
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              delta > 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            )}
          >
            {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{" "}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 pb-10 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Sales Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, here is what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          {/* View Invoices Link */}
          <a
            href="/invoices"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-sm text-gray-700"
          >
            <Receipt size={18} /> View Invoices
          </a>

          {/* Add New Sales Link */}
          <a
            href="/sales/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200/50 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Add New Sales
          </a>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <KPICard
          title="Invoices"
          value={kpis?.totalInvoices ?? "—"}
          sub="Lifetime volume"
          icon={Receipt}
          colorClass="bg-indigo-600"
        />
        <KPICard
          title="Pending"
          value={kpis?.pendingPayments ?? "—"}
          sub="Invoices due"
          icon={AlertTriangle}
          colorClass="bg-amber-600"
        />
        <KPICard
          title="Retail"
          value={kpis?.retailSales ?? "—"}
          sub="POS sales"
          icon={ShoppingCart}
          colorClass="bg-blue-600"
        />
        <KPICard
          title="Returns"
          value={kpis?.returns ?? "—"}
          sub="Items back"
          icon={RotateCcw}
          colorClass="bg-rose-600"
        />
        <KPICard
          title="Revenue"
          value={kpis ? `₹${kpis.monthSales.toLocaleString()}` : "—"}
          sub="This month"
          icon={DollarSign}
          colorClass="bg-emerald-600"
          delta={12.5}
        />
        <KPICard
          title="Receivables"
          value={kpis ? `₹${kpis.receivables.toLocaleString()}` : "—"}
          sub="Total debt"
          icon={CreditCard}
          colorClass="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Sales Performance: Last 12 Months
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={spark.map((val, i) => ({
                    name: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ][i],
                    sales: val,
                  }))}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workflow Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WORKFLOW_ITEMS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div
                  className={cn(
                    "p-4 rounded-full group-hover:scale-110 transition-transform",
                    item.color
                  )}
                >
                  <item.icon size={24} />
                </div>
                <p className="mt-3 font-semibold text-gray-900 text-sm">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {item.desc}
                </p>
              </a>
            ))}
          </div>

          {/* Top Customers */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-5 text-gray-900">
              Top Customers (by Value)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Tech Corp", total: 60000 },
                { name: "John Doe", total: 45000 },
                { name: "Sarah Smith", total: 32000 },
              ].map((customer, i) => (
                <div
                  key={i}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {customer.name.substring(0, 2)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{customer.total.toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Placeholder */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex gap-3 pb-4 border-b border-gray-50 last:border-0"
              >
                <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Invoice #450{i} generated
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
