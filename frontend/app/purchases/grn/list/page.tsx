"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import {
  Search,
  RefreshCcw,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Package,
} from "lucide-react";

type GRN = {
  _id: string;
  grnNumber?: string;
  supplier?: { name?: string } | string;
  items?: any[];
  receivedAt?: string;
  createdAt?: string;
};

export default function GRNListPage() {
  const [list, setList] = useState<GRN[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [q, setQ] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [minItems, setMinItems] = useState("");
  const [maxItems, setMaxItems] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher("/api/grn");
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load GRNs");
    } finally {
      setLoading(false);
    }
  }

  // FILTERS
  const filtered = useMemo(() => {
    const s = q.toLowerCase();

    const safeDate = (d: string | undefined) => (d ? new Date(d) : new Date(0));

    return list.filter((g) => {
      const grn = (g.grnNumber || "").toLowerCase();

      const supplier =
        typeof g.supplier === "string"
          ? g.supplier.toLowerCase()
          : (g.supplier?.name || "").toLowerCase();

      const count = g.items?.length || 0;

      const date = safeDate(g.receivedAt || g.createdAt);

      // Search filter
      if (s && !grn.includes(s) && !supplier.includes(s)) return false;

      // Min/max items
      if (minItems && count < Number(minItems)) return false;
      if (maxItems && count > Number(maxItems)) return false;

      // Date range
      if (start && date < new Date(start)) return false;
      if (end && date > new Date(end)) return false;

      return true;
    });
  }, [list, q, minItems, maxItems, start, end]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // CSV EXPORT
  function exportCSV() {
    const headers = ["GRN#", "Supplier", "Items", "Date"];
    const rows = filtered.map((g) => [
      g.grnNumber,
      typeof g.supplier === "string" ? g.supplier : g.supplier?.name,
      g.items?.length || 0,
      new Date(g.receivedAt || g.createdAt!).toLocaleString(),
    ]);

    const csv =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "grn-list.csv";
    link.click();
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Goods Received Notes</h1>
          <div className="text-sm text-gray-500">
            Manage, view and export goods received notes
          </div>
        </div>

        <div className="flex gap-2">
          {/* Clear */}
          <button
            onClick={() => {
              setQ("");
              setStart("");
              setEnd("");
              setMinItems("");
              setMaxItems("");
            }}
            className="p-2 border rounded-lg hover:bg-gray-100 col-span-1"
          >
            Clear
          </button>
          <button
            onClick={load}
            className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2"
          >
            <FileDown size={16} /> Export CSV
          </button>

          <Link
            href="/purchases/grn/receive-grn"
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700"
          >
            + Receive GRN
          </Link>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/70 p-4 rounded-xl shadow-lg border backdrop-blur grid grid-cols-1 md:grid-cols-6 gap-3 mb-5">
        {/* Search */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3 text-gray-500" size={17} />
          <input
            className="pl-10 p-2.5 border rounded-lg w-full"
            placeholder="Search GRN# / supplier..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Date From */}
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="p-2 border rounded-lg"
        />

        {/* Date To */}
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="p-2 border rounded-lg"
        />

        {/* Min Items */}
        <input
          placeholder="Min items"
          value={minItems}
          onChange={(e) => setMinItems(e.target.value)}
          className="p-2 border rounded-lg"
        />

        {/* Max Items */}
        <input
          placeholder="Max items"
          value={maxItems}
          onChange={(e) => setMaxItems(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white/70 p-4 rounded-2xl shadow-xl border backdrop-blur overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading…</div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No GRN found</div>
        ) : (
          <table className="w-full text-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">GRN#</th>
                <th className="text-left">Supplier</th>
                <th className="text-left">Items</th>
                <th className="text-left">Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((g) => (
                <tr key={g._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{g.grnNumber}</td>

                  {/* Supplier */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      {typeof g.supplier === "string"
                        ? g.supplier
                        : g.supplier?.name || "—"}
                    </div>
                  </td>

                  {/* Items count */}
                  <td>
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-gray-500" />
                      {(g.items || []).length} items
                    </div>
                  </td>

                  {/* Date */}
                  <td className="text-gray-600">
                    {new Date(g.receivedAt || g.createdAt!).toLocaleString()}
                  </td>

                  {/* Action */}
                  <td className="text-right">
                    <Link
                      href={`/purchases/grn/${g._id}`}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
        <div>Rows per page: {rowsPerPage}</div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border px-2 py-1 rounded disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border px-2 py-1 rounded disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
