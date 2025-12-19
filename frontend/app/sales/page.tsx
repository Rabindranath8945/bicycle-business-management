"use client";

import { useMemo, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
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
  Activity, // New: General activity/trend
  Handshake, // New: Wholesale
  Store, // New: Retail
  Clock, // New: EMI Sales
  Wrench, // New: Fitting Charges
  BarChart2, // New: For charts
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
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Define the shape of our new data structure
type SalesDashboardData = {
  todaySales: {
    retail: number;
    wholesale: number;
    cycle: number;
  };
  totalRevenue: number;
  profit: number;
  cashVsDigital: {
    cash: number;
    digital: number;
  };
  emiSales: number;
  fittingChargesIncome: number;
  monthlySalesSeries: { name: string; sales: number }[];
  saleTypeComparison: { name: string; retail: number; wholesale: number }[];
  topProducts: { name: string; sales: number }[];
};

const FALLBACK_DASHBOARD_DATA: SalesDashboardData = {
  todaySales: {
    retail: 125000,
    wholesale: 85000,
    cycle: 3000,
  },
  totalRevenue: 5400000,
  profit: 1250000,
  cashVsDigital: {
    cash: 3200000,
    digital: 2200000,
  },
  emiSales: 450000,
  fittingChargesIncome: 25000,
  monthlySalesSeries: [
    { name: "Jan", sales: 250000 },
    { name: "Feb", sales: 320000 },
    { name: "Mar", sales: 290000 },
    { name: "Apr", sales: 380000 },
    { name: "May", sales: 450000 },
    { name: "Jun", sales: 510000 },
    { name: "Jul", sales: 480000 },
    { name: "Aug", sales: 550000 },
    { name: "Sep", sales: 580000 },
    { name: "Oct", sales: 620000 },
    { name: "Nov", sales: 540000 },
    { name: "Dec", sales: 480000 },
  ],
  saleTypeComparison: [
    { name: "Jan", retail: 120000, wholesale: 80000 },
    { name: "Feb", retail: 150000, wholesale: 90000 },
    { name: "Mar", retail: 140000, wholesale: 85000 },
    { name: "Apr", retail: 180000, wholesale: 100000 },
    { name: "May", retail: 210000, wholesale: 120000 },
    { name: "Jun", retail: 240000, wholesale: 140000 },
    { name: "Jul", retail: 230000, wholesale: 130000 },
    { name: "Aug", retail: 260000, wholesale: 150000 },
    { name: "Sep", retail: 280000, wholesale: 160000 },
    { name: "Oct", retail: 300000, wholesale: 180000 },
    { name: "Nov", retail: 260000, wholesale: 150000 },
    { name: "Dec", retail: 230000, wholesale: 130000 },
  ],
  topProducts: [
    { name: "Product A - Blue Shoe", sales: 85 },
    { name: "Product B - Red Heel", sales: 72 },
    { name: "Product C - Sneaker", sales: 61 },
    { name: "Product D - Sandal", sales: 45 },
    { name: "Product E - Boot", sales: 32 },
  ],
};

// Reusing existing workflow data definition
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
  const [data] = useState<SalesDashboardData | null>(FALLBACK_DASHBOARD_DATA);

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
    <div className="group relative overflow-hidden bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-lg text-white shadow-md", colorClass)}>
          <Icon size={18} />
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
            {delta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{" "}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );

  const formatCurrency = (amount: number | undefined) => {
    return amount !== undefined ? `₹${amount.toLocaleString("en-IN")}` : "—";
  };

  return (
    <div className="p-6 space-y-8 pb-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Sales Dashboard
          </h1>
          <p className="text-gray-500">
            Central overview of all sales activities (Odoo Style).
          </p>
        </div>
        <div className="flex gap-3">
          {/* View Invoices Link */}
          <a
            href="/invoices"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-sm text-gray-700"
          >
            <Receipt size={18} /> View Invoices
          </a>

          {/* Add New Sales Link */}
          <a
            href="/sales/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-200/50 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Add New Sales
          </a>
        </div>
      </div>

      {/* KPI Grid 1: Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(data?.totalRevenue)}
          sub="Lifetime total revenue"
          icon={DollarSign}
          colorClass="bg-emerald-600"
          delta={12.5}
        />
        <KPICard
          title="Profit"
          value={formatCurrency(data?.profit)}
          sub="Lifetime profit"
          icon={Activity}
          colorClass="bg-purple-600"
          delta={8.1}
        />
        <KPICard
          title="Today Sales (Cash)"
          value={formatCurrency(data?.cashVsDigital.cash)}
          sub="Today's cash income"
          icon={CreditCard}
          colorClass="bg-indigo-600"
        />
        <KPICard
          title="Today Sales (Digital)"
          value={formatCurrency(data?.cashVsDigital.digital)}
          sub="Today's digital income"
          icon={CreditCard}
          colorClass="bg-blue-600"
        />
      </div>

      {/* KPI Grid 2: Specific Income Streams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard
          title="Today Retail Sales"
          value={formatCurrency(data?.todaySales.retail)}
          sub="POS & E-commerce"
          icon={Store}
          colorClass="bg-rose-500"
        />
        <KPICard
          title="Today Wholesale"
          value={formatCurrency(data?.todaySales.wholesale)}
          sub="B2B volume"
          icon={Handshake}
          colorClass="bg-amber-500"
        />
        <KPICard
          title="Today Cycle Sales"
          value={formatCurrency(data?.todaySales.cycle)}
          sub="Cycle/Exchange Sales"
          icon={RotateCcw}
          colorClass="bg-gray-500"
        />
        <KPICard
          title="EMI Sales"
          value={formatCurrency(data?.emiSales)}
          sub="Total EMI amount"
          icon={Clock}
          colorClass="bg-cyan-600"
        />
        <KPICard
          title="Fitting Income"
          value={formatCurrency(data?.fittingChargesIncome)}
          sub="Service charges"
          icon={Wrench}
          colorClass="bg-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart (Area Chart) - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Sales Trend: Last 12 Months
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlySalesSeries}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
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

        {/* Quick Actions / Workflow Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {WORKFLOW_ITEMS.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-lg", item.color)}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-gray-600 transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts Section: Sale Type Comparison & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sale Type Comparison Chart */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Sale Type Comparison (Retail vs. Wholesale)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.saleTypeComparison}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
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
                <Bar
                  dataKey="retail"
                  stackId="a"
                  fill="#059669"
                  name="Retail"
                />
                <Bar
                  dataKey="wholesale"
                  stackId="a"
                  fill="#3b82f6"
                  name="Wholesale"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products List/Chart */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Selling Products (Units)
          </h3>
          <div className="space-y-3">
            {data?.topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <p className="text-sm text-gray-700 truncate">{product.name}</p>
                <span className="text-sm font-semibold text-blue-600">
                  {product.sales} units
                </span>
              </div>
            ))}
          </div>
          {/* A simple bar chart representation if preferred, but a list is cleaner here */}
        </div>
      </div>
    </div>
  );
}
