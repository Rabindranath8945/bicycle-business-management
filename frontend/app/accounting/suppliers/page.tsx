"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Search, RefreshCcw } from "lucide-react";

export default function AccountingSuppliers() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  // FIX: Proper loading on mount — no async cleanup, no invalid disconnect()
  useEffect(() => {
    const loadData = async () => {
      try {
        setList([{ _id: "s1", name: "Hero Cycles", balance: 25000 }]);
      } catch (e) {
        console.error(e);
      }
    };

    loadData();
  }, []);

  async function load() {
    try {
      /* setList(await fetcher('/api/suppliers/ledger')) */ setList([
        { _id: "s1", name: "Hero Cycles", balance: 25000 },
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  const filtered = useMemo(
    () =>
      list.filter((s) =>
        (s.name || "").toLowerCase().includes(q.toLowerCase())
      ),
    [list, q]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Supplier Accounts</h2>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 border rounded">
            <RefreshCcw size={14} />
          </button>
          <Link
            href="/suppliers"
            className="px-3 py-2 bg-amber-500 text-white rounded"
          >
            Open Suppliers
          </Link>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          className="pl-10 p-2 w-full rounded border"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search supplier..."
        />
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Supplier</th>
              <th>Outstanding</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{s.name}</td>
                <td className="p-2">₹{(s.balance || 0).toFixed(2)}</td>
                <td className="p-2 text-right">
                  <Link href={`/suppliers/${s._id}`} className="text-amber-600">
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
