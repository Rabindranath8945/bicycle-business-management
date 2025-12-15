"use client";
import React, { useEffect, useState, useMemo } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Search, RefreshCcw } from "lucide-react";

export default function CustomerAccounts() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    setLoading(true);
    try {
      /* setList(await fetcher('/api/customers/ledger')) */ setList([
        { _id: "c1", name: "John Doe", balance: 1200, lastInvoice: "INV-1001" },
      ]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = useMemo(
    () =>
      list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q.toLowerCase()) ||
          String(c.balance || "").includes(q)
      ),
    [list, q]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customer Accounts</h2>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-3 py-2 border rounded flex items-center gap-2"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
          <Link
            href="/customers"
            className="px-3 py-2 bg-amber-500 text-white rounded"
          >
            Open Customer List
          </Link>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          className="pl-10 p-2 w-full rounded border"
          placeholder="Search customer..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Customer</th>
              <th>Balance</th>
              <th>Last Invoice</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">₹{(c.balance || 0).toFixed(2)}</td>
                <td className="p-2">{c.lastInvoice || "—"}</td>
                <td className="p-2 text-right">
                  <Link href={`/customers/${c._id}`} className="text-amber-600">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
