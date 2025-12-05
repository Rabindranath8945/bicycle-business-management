"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { Search, FileDown, RefreshCcw } from "lucide-react";

export default function BillListPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher("/api/purchases");
      setList(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
      alert("Failed to load bills");
    } finally {
      setLoading(false);
    }
  }

  /** SAFE FILTER — prevents undefined.toLowerCase() crash */
  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    return list.filter((b) => {
      const billNo = (b.billNo || "").toLowerCase();
      const supplier = (b.supplier?.name || "").toLowerCase();
      return billNo.includes(s) || supplier.includes(s);
    });
  }, [list, search]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-wide">Purchase Bills</h2>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <Link
            href="/purchases/create-bill"
            className="px-3 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600"
          >
            New Bill
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bill or supplier..."
          className="pl-10 p-3 border rounded-lg w-full shadow-sm"
        />
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/40 overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr className="text-left">
                <th className="p-2">Bill#</th>
                <th>Supplier</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Date</th>
                <th className="text-right p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{b.billNo}</td>
                  <td>{b.supplier?.name || "—"}</td>
                  <td>₹{b.totalAmount}</td>

                  <td className={b.dueAmount > 0 ? "text-red-600" : ""}>
                    ₹{b.paidAmount}
                  </td>

                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>

                  <td className="text-right flex justify-end items-center gap-4 p-3">
                    {/* PDF Button */}
                    <button
                      onClick={() =>
                        window.open(`/purchases/bills/pdf/${b._id}`, "_blank")
                      }
                      className="text-slate-700 hover:text-black flex items-center gap-1"
                    >
                      <FileDown size={16} /> PDF
                    </button>

                    {/* View (opens PDF page) */}
                    <Link
                      href={`/purchases/bills/pdf/${b._id}`}
                      className="text-amber-600 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No bills found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
