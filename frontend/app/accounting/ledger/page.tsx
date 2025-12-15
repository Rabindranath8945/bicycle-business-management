"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import { Search, RefreshCcw } from "lucide-react";

export default function LedgerPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      // replace with /api/accounting/ledger?from=...&to=...
      // setEntries(await fetcher(`/api/accounting/ledger`));
      setEntries([
        {
          _id: "j1",
          voucher: "JV-001",
          date: new Date().toISOString(),
          account: "Sales",
          debit: 0,
          credit: 540,
          narration: "Sale INV-1001",
        },
        {
          _id: "j2",
          voucher: "JV-002",
          date: new Date().toISOString(),
          account: "Cash",
          debit: 540,
          credit: 0,
          narration: "Payment INV-1001",
        },
      ]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return entries.filter(
      (e) =>
        (e.voucher || "").toLowerCase().includes(s) ||
        (e.account || "").toLowerCase().includes(s) ||
        (e.narration || "").toLowerCase().includes(s)
    );
  }, [entries, q]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">General Ledger</h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded border flex items-center gap-2"
        >
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="pl-10 p-2 w-full rounded border"
            placeholder="Search voucher / account / narration"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="p-2 border rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Date</th>
              <th>Voucher</th>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Narration</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-2">{e.voucher}</td>
                <td className="p-2">{e.account}</td>
                <td className="p-2">₹{(e.debit || 0).toFixed(2)}</td>
                <td className="p-2">₹{(e.credit || 0).toFixed(2)}</td>
                <td className="p-2">{e.narration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
