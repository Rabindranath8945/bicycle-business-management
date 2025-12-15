// /app/suppliers/dashboard/[id]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Download, FileText, FilePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Supplier Dashboard UI (frontend-only)
 * - Place at /app/suppliers/dashboard/[id]/page.tsx
 * - Requires `recharts` (already used in your project)
 */

type Bill = any;
type ReturnT = any;

const MOCK = {
  supplier: {
    _id: "mock-sup-1",
    name: "ABC Supplies",
    phone: "9876543210",
    gstin: "19AAAAA0000A1Z2",
    address: "Demo address, Town",
  },
  kpis: {
    totalPurchase: 125000,
    totalReturns: 4500,
    outstandingDue: 18000,
    lastPayment: 5000,
    grnCount: 12,
  },
  monthly: [
    { month: "Jan", purchases: 8000, returns: 200 },
    { month: "Feb", purchases: 12000, returns: 100 },
    { month: "Mar", purchases: 9000, returns: 400 },
    { month: "Apr", purchases: 14000, returns: 300 },
    { month: "May", purchases: 18000, returns: 500 },
    { month: "Jun", purchases: 20000, returns: 800 },
    { month: "Jul", purchases: 15000, returns: 600 },
    { month: "Aug", purchases: 17000, returns: 300 },
    { month: "Sep", purchases: 13000, returns: 200 },
    { month: "Oct", purchases: 19000, returns: 700 },
    { month: "Nov", purchases: 21000, returns: 900 },
    { month: "Dec", purchases: 16000, returns: 500 },
  ],
  recentBills: [
    {
      _id: "b1",
      billNo: "PB-1001",
      totalAmount: 4500,
      paidAmount: 4500,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "b2",
      billNo: "PB-1002",
      totalAmount: 15000,
      paidAmount: 5000,
      createdAt: new Date().toISOString(),
    },
  ],
  recentReturns: [
    {
      _id: "r1",
      returnNo: "PR-2001",
      totalAmount: 1200,
      createdAt: new Date().toISOString(),
    },
  ],
};

export default function SupplierDashboardPage() {
  const { id } = useParams() as any;
  const router = useRouter();

  const [supplier, setSupplier] = useState<any | null>(null);
  const [kpis, setKpis] = useState<any | null>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [recentReturns, setRecentReturns] = useState<ReturnT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadAll() {
    setLoading(true);
    try {
      // Try fetching supplier details
      const sup = await fetcher(`/api/suppliers/${id}`).catch(() => null);
      setSupplier(sup ?? MOCK.supplier);

      // KPIs endpoint (expected)
      const purchases = await fetcher(`/api/suppliers/${id}/summary`).catch(
        () => null
      );
      if (purchases) {
        setKpis(purchases);
      } else setKpis(MOCK.kpis);

      // monthly trends (fallback)
      const monthlyRes = await fetcher(`/api/suppliers/${id}/monthly`).catch(
        () => null
      );
      setMonthly(monthlyRes ?? MOCK.monthly);

      const bills = await fetcher(
        `/api/purchases?supplier=${id}&limit=10`
      ).catch(() => null);
      setRecentBills(Array.isArray(bills) ? bills : MOCK.recentBills);

      const returns = await fetcher(
        `/api/purchase-returns?supplier=${id}&limit=10`
      ).catch(() => null);
      setRecentReturns(Array.isArray(returns) ? returns : MOCK.recentReturns);
    } catch (e) {
      console.error(e);
      // fallback data already set
    } finally {
      setLoading(false);
    }
  }

  const topProducts = useMemo(() => {
    // Sample derivation: if backend returns top items, use them. For now mock top products by slicing monthly data.
    return [
      { name: 'Inner Tube 26"', qty: 150 },
      { name: "Mudguard - Plastic", qty: 100 },
      { name: "Chain Cover", qty: 72 },
    ];
  }, []);

  function downloadCSV(rows: any[], filename = "export.csv") {
    const keys = Object.keys(rows[0] || {});
    const csv = [
      keys.join(","),
      ...rows.map((r) => keys.map((k) => `"${String(r[k] ?? "")}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function generateSupplierPDF() {
    // We'll open a client-side window and call a client PDF generator route (or you can call backend later).
    // For now, open a new tab with the (planned) backend PDF route: /api/suppliers/:id/pdf
    window.open(`/api/suppliers/${id}/pdf`, "_blank");
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading supplier dashboard…</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-2 py-1 rounded bg-slate-100/40"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">
              {supplier?.name || "Supplier"}
            </h1>
            <div className="text-sm text-gray-500">
              {supplier?.gstin || ""} • {supplier?.phone || ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              downloadCSV(
                recentBills,
                `${supplier?.name || "supplier"}-bills.csv`
              )
            }
            className="px-3 py-2 border rounded-md flex items-center gap-2"
          >
            <Download size={16} /> Export Bills CSV
          </button>

          <button
            onClick={generateSupplierPDF}
            className="px-3 py-2 bg-amber-500 text-white rounded-md flex items-center gap-2"
          >
            <FileText size={16} /> Supplier PDF
          </button>

          <Link
            href={`/purchases/create-bill?supplier=${id}`}
            className="px-3 py-2 bg-emerald-600 text-white rounded-md flex items-center gap-2"
          >
            <FilePlus size={16} /> Create Bill
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Purchases</div>
          <div className="text-2xl font-semibold">
            ₹{(kpis.totalPurchase || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Returns</div>
          <div className="text-2xl font-semibold">
            ₹{(kpis.totalReturns || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Outstanding Due</div>
          <div className="text-2xl font-semibold text-red-600">
            ₹{(kpis.outstandingDue || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Last Payment</div>
          <div className="text-2xl font-semibold">
            ₹{(kpis.lastPayment || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white/80 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Monthly Purchases & Returns</h3>
            <div className="text-sm text-gray-500">Last 12 months</div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="purchases"
                  name="Purchases"
                  radius={[6, 6, 0, 0]}
                />
                <Bar dataKey="returns" name="Returns" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <h4 className="font-medium mb-3">Top Purchased Products</h4>
          <ul className="space-y-3">
            {topProducts.map((p) => (
              <li key={p.name} className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.qty} units</div>
                </div>
                <div className="text-sm font-semibold">#{p.qty}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Bills & Returns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Recent Bills</h4>
            <div className="text-xs text-gray-500">
              {recentBills.length} latest
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2">Bill#</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{b.billNo}</td>
                    <td>
                      ₹
                      {(b.totalAmount || 0).toFixed
                        ? (b.totalAmount || 0).toFixed(2)
                        : b.totalAmount}
                    </td>
                    <td>
                      ₹
                      {(b.paidAmount || 0).toFixed
                        ? (b.paidAmount || 0).toFixed(2)
                        : b.paidAmount}
                    </td>
                    <td>
                      {new Date(
                        b.createdAt || b.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/purchases/bills/pdf/${b._id}`}
                        className="text-amber-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Recent Returns</h4>
            <div className="text-xs text-gray-500">
              {recentReturns.length} latest
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2">Return#</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentReturns.map((r) => (
                  <tr key={r._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{r.returnNo || r._id}</td>
                    <td>
                      ₹
                      {(r.totalAmount || 0).toFixed
                        ? (r.totalAmount || 0).toFixed(2)
                        : r.totalAmount}
                    </td>
                    <td>
                      {new Date(
                        r.createdAt || r.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/purchases/returns/${r._id}`}
                        className="text-amber-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
