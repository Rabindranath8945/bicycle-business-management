"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Package,
  Receipt,
  RotateCcw,
  Plus,
  Truck,
  Users,
  CreditCard,
  FilePlus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  History,
  ClipboardList,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type KPIs = {
  totalPOs: number;
  pendingGRNs: number;
  totalBills: number;
  totalReturns: number;
  monthSpend: number;
  outstanding: number;
  monthlySeries: { name: string; spend: number }[];
};

export default function PurchasesDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the data structure to match the Sales Dashboard style
    const mockData: KPIs = {
      totalPOs: 142,
      pendingGRNs: 8,
      totalBills: 125,
      totalReturns: 3,
      monthSpend: 890000,
      outstanding: 452000,
      monthlySeries: [
        { name: "Jan", spend: 400000 },
        { name: "Feb", spend: 300000 },
        { name: "Mar", spend: 600000 },
        { name: "Apr", spend: 890000 },
      ],
    };
    setKpis(mockData);
    setLoading(false);
  }, []);

  const KPICard = ({
    title,
    value,
    sub,
    icon: Icon,
    colorClass,
    delta,
    currency = false,
  }: any) => (
    <div className="group relative overflow-hidden bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-lg text-white shadow-md", colorClass)}>
          <Icon size={18} />
        </div>
        {delta && (
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
        <h3 className="text-xl font-bold text-gray-900 mt-1">
          {currency ? `₹${value?.toLocaleString("en-IN")}` : value}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );

  const WORKFLOW_ITEMS = [
    {
      title: "New PO",
      desc: "Order stock",
      icon: FilePlus,
      color: "bg-blue-50 text-blue-600",
      href: "/purchases/create-po",
    },
    {
      title: "Receive Goods",
      desc: "GRN Entry",
      icon: Truck,
      color: "bg-emerald-50 text-emerald-600",
      href: "/grn/new",
    },
    {
      title: "Suppliers",
      desc: "Manage vendors",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      href: "/suppliers",
    },
    {
      title: "Bills",
      desc: "Pay invoices",
      icon: ClipboardList,
      color: "bg-amber-50 text-amber-600",
      href: "/purchases/bills",
    },
  ];

  return (
    <div className="p-6 space-y-8 pb-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Purchase Dashboard
          </h1>
          <p className="text-gray-500">
            Procurement and vendor management overview (Odoo Style).
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/purchases/all"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 font-medium text-sm text-gray-700 transition-all"
          >
            <Receipt size={18} /> View All Orders
          </Link>
          <Link
            href="/purchases/create-po"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-700 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Create New PO
          </Link>
        </div>
      </div>

      {/* KPI Grid 1: Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Spend"
          value={kpis?.monthSpend}
          currency
          sub="Total this month"
          icon={DollarSign}
          colorClass="bg-emerald-600"
          delta={14.2}
        />
        <KPICard
          title="Outstanding Payables"
          value={kpis?.outstanding}
          currency
          sub="Pending payments"
          icon={CreditCard}
          colorClass="bg-rose-600"
          delta={-2.5}
        />
        <KPICard
          title="Total Orders"
          value={kpis?.totalPOs}
          sub="Lifetime PO count"
          icon={Activity}
          colorClass="bg-indigo-600"
        />
        <KPICard
          title="Active Returns"
          value={kpis?.totalReturns}
          sub="Claims in progress"
          icon={RotateCcw}
          colorClass="bg-amber-500"
        />
      </div>

      {/* KPI Grid 2: Operational Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Pending GRNs"
          value={kpis?.pendingGRNs}
          sub="Goods yet to arrive"
          icon={Package}
          colorClass="bg-blue-500"
        />
        <KPICard
          title="Unbilled POs"
          value={12}
          sub="Goods received, no bill"
          icon={Receipt}
          colorClass="bg-purple-500"
        />
        <KPICard
          title="Lead Time"
          value="4.2 Days"
          sub="Average fulfillment"
          icon={History}
          colorClass="bg-slate-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" /> Purchase Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpis?.monthlySeries}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#059669"
                  fillOpacity={1}
                  fill="url(#colorSpend)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workflow Actions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Quick Operations</h3>
          {WORKFLOW_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className={cn(
                  "p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform",
                  item.color
                )}
              >
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
