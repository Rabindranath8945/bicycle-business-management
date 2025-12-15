"use client";
import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";

export default function AccountingHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    periodSales: 0,
    periodPurchase: 0,
    receivables: 0,
    payables: 0,
    cashBalance: 0,
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      // TODO: replace with real backend
      // const res = await fetcher("/api/accounting/summary");
      // setStats(res);
      setStats({
        periodSales: 125000,
        periodPurchase: 82000,
        receivables: 42000,
        payables: 15000,
        cashBalance: 38000,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Accounting Dashboard</h1>
        <button
          onClick={load}
          className="px-3 py-2 bg-slate-200 rounded flex items-center gap-2"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Sales (period)"
          value={`₹${stats.periodSales.toLocaleString()}`}
        />
        <Card
          title="Purchases (period)"
          value={`₹${stats.periodPurchase.toLocaleString()}`}
        />
        <Card
          title="Receivables"
          value={`₹${stats.receivables.toLocaleString()}`}
        />
        <Card title="Payables" value={`₹${stats.payables.toLocaleString()}`} />
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
        <h3 className="font-semibold mb-3">Quick Links</h3>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/accounting/ledger"
            className="px-3 py-2 rounded bg-emerald-600 text-white"
          >
            General Ledger
          </Link>
          <Link
            href="/accounting/sales-purchase"
            className="px-3 py-2 rounded border"
          >
            Sales & Purchase
          </Link>
          <Link
            href="/accounting/customers"
            className="px-3 py-2 rounded border"
          >
            Customer Accounts
          </Link>
          <Link
            href="/accounting/suppliers"
            className="px-3 py-2 rounded border"
          >
            Supplier Accounts
          </Link>
          <Link
            href="/accounting/reports/pl"
            className="px-3 py-2 rounded border"
          >
            Profit & Loss
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-2">{value}</div>
    </div>
  );
}
