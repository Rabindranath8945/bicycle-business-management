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
  Plus,
  Package,
  Filter,
  Calendar,
  Layers,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GRNListPage() {
  const [list, setList] = useState<any[]>([]);
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
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return list.filter((g) => {
      const grn = (g.grnNumber || "").toLowerCase();
      const supplier =
        typeof g.supplier === "string"
          ? g.supplier.toLowerCase()
          : (g.supplier?.name || "").toLowerCase();
      const count = g.items?.length || 0;
      const date = new Date(g.receivedAt || g.createdAt);

      if (s && !grn.includes(s) && !supplier.includes(s)) return false;
      if (minItems && count < Number(minItems)) return false;
      if (maxItems && count > Number(maxItems)) return false;
      if (start && date < new Date(start)) return false;
      if (end && date > new Date(end)) return false;
      return true;
    });
  }, [list, q, minItems, maxItems, start, end]);

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const clearFilters = () => {
    setQ("");
    setStart("");
    setEnd("");
    setMinItems("");
    setMaxItems("");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen pb-10">
      {/* 1. ENTERPRISE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Inward Documents
          </h1>
          <p className="text-gray-500 text-sm">
            Goods Received Notes (GRN) History and Auditing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 text-gray-600 transition-all"
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
          </button>

          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 font-bold text-xs text-gray-700 transition-all uppercase tracking-wider"
          >
            <FileDown size={16} /> Export CSV
          </button>

          <Link
            href="/purchases/grn/receive-grn"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 shadow-indigo-100 transition-all font-bold text-sm"
          >
            <Plus size={18} /> Receive New GRN
          </Link>
        </div>
      </div>

      {/* 2. ADVANCED FILTER RIBBON */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
            <Filter size={14} /> Filter Parameters
          </h3>
          <button
            onClick={clearFilters}
            className="text-[10px] font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-all flex items-center gap-1"
          >
            <XCircle size={12} /> RESET FILTERS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search GRN# or Vendor..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs"
            />
          </div>

          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs"
            />
          </div>

          <div className="relative">
            <Layers
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              placeholder="Min SKUs"
              value={minItems}
              onChange={(e) => setMinItems(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs"
            />
          </div>

          <div className="relative">
            <Layers
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              placeholder="Max SKUs"
              value={maxItems}
              onChange={(e) => setMaxItems(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. LISTING TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">
                Document ID
              </th>
              <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">
                Supplier Name
              </th>
              <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">
                Item Density
              </th>
              <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">
                Received Date
              </th>
              <th className="px-6 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((g) => (
              <tr
                key={g._id}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                  {g.grnNumber || "GRN-PENDING"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                      {typeof g.supplier === "string"
                        ? g.supplier[0]
                        : g.supplier?.name?.[0] || "V"}
                    </div>
                    <span className="font-bold text-gray-900">
                      {typeof g.supplier === "string"
                        ? g.supplier
                        : g.supplier?.name || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-bold text-gray-600 shadow-sm">
                    {(g.items || []).length} SKUs
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {new Date(g.receivedAt || g.createdAt!).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/purchases/grn/${g._id}`}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                  >
                    View Details <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Showing <span className="text-gray-900">{paginated.length}</span> of{" "}
            {filtered.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-indigo-600 px-4">
              Page {page} / {totalPages || 1}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
