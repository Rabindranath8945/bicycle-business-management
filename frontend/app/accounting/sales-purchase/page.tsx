"use client";
import React, { useEffect, useState, useMemo } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Search, RefreshCcw } from "lucide-react";

export default function SalesPurchasePage() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      // TODO: connect to /api/accounting/sales-purchase
      // setList(await fetcher("/api/accounting/sales-purchase"));
      setList([
        {
          id: "s1",
          type: "Sale",
          ref: "INV-1001",
          date: new Date().toISOString(),
          amount: 540,
        },
        {
          id: "p1",
          type: "Purchase",
          ref: "PB-1001",
          date: new Date().toISOString(),
          amount: 1200,
        },
      ]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return list.filter(
      (r) =>
        (r.ref || "").toLowerCase().includes(s) ||
        (r.type || "").toLowerCase().includes(s)
    );
  }, [list, q]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Sales & Purchase Journal</h2>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-3 py-2 border rounded flex items-center gap-2"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
          <Link
            href="/accounting/ledger"
            className="px-3 py-2 bg-amber-500 text-white rounded"
          >
            Open Ledger
          </Link>
        </div>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          className="pl-10 p-2 rounded border w-full"
          placeholder="Search ref / type..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
        {loading ? (
          <div className="p-6 text-center">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Type</th>
                <th>Ref</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.type}</td>
                  <td className="p-2">{r.ref}</td>
                  <td className="p-2">₹{r.amount}</td>
                  <td className="p-2">{new Date(r.date).toLocaleString()}</td>
                  <td className="p-2 text-right">
                    <Link
                      href={`/accounting/ledger?ref=${r.ref}`}
                      className="text-amber-600"
                    >
                      View Ledger
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
