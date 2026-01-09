"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import {
  Search,
  FileDown,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Wallet,
  ArrowUpRight,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillListPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher(`/api/purchases`);
      setList(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let data = [...list];
    const s = search.toLowerCase();

    return data.filter((b) => {
      const billNo = (b.billNo || "").toLowerCase();
      const supplier = (b.supplier?.name || "").toLowerCase();
      const total = Number(b.totalAmount || 0);
      const date = new Date(b.createdAt!);

      if (s && !billNo.includes(s) && !supplier.includes(s)) return false;
      if (statusFilter === "paid" && Number(b.dueAmount) !== 0) return false;
      if (statusFilter === "due" && Number(b.dueAmount) === 0) return false;
      if (minAmount && total < Number(minAmount)) return false;
      if (maxAmount && total > Number(maxAmount)) return false;
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;

      return true;
    });
  }, [list, search, minAmount, maxAmount, startDate, endDate, statusFilter]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen pb-10">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Purchase Ledger
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Track supplier liabilities and payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 text-gray-500 transition-all"
          >
            <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
          </button>

          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 font-bold text-xs text-gray-700 uppercase tracking-widest"
          >
            <FileDown size={16} /> Export
          </button>

          <Link
            href="/purchases/create-bill"
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl shadow-lg hover:bg-amber-700 shadow-amber-100 transition-all font-bold text-sm"
          >
            Create New Bill
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
            onClick={() => {
              setSearch("");
              setMinAmount("");
              setMaxAmount("");
              setStartDate("");
              setEndDate("");
              setStatusFilter("all");
            }}
            className="text-[10px] font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-all flex items-center gap-1"
          >
            <XCircle size={12} /> CLEAR ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <div className="md:col-span-2 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              placeholder="Bill No or Vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 text-sm transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs font-bold text-gray-600 appearance-none focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Settled (Paid)</option>
            <option value="due">Outstanding (Due)</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs text-gray-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs text-gray-500"
          />

          <input
            placeholder="Min Amt"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs"
          />
          <input
            placeholder="Max Amt"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs"
          />
        </div>
      </div>

      {/* 3. FINANCIAL TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Supplier Account</th>
              <th className="px-6 py-4 text-right">Total Billing</th>
              <th className="px-6 py-4 text-right">Settled Amount</th>
              <th className="px-6 py-4 text-center">Liability Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-amber-50/20 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-mono font-bold text-amber-600">
                    {b.billNo}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {new Date(b.createdAt!).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <Wallet size={16} />
                    </div>
                    <span className="font-bold text-gray-900">
                      {b.supplier?.name || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{Number(b.totalAmount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                  ₹{Number(b.paidAmount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div
                    className={cn(
                      "inline-flex flex-col items-center px-3 py-1 rounded-xl border w-24",
                      b.dueAmount! > 0
                        ? "bg-rose-50 border-rose-100"
                        : "bg-emerald-50 border-emerald-100"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-tighter",
                        b.dueAmount! > 0 ? "text-rose-600" : "text-emerald-600"
                      )}
                    >
                      {b.dueAmount! > 0 ? "Outstanding" : "Settled"}
                    </span>
                    <span className="text-[11px] font-bold">
                      ₹{b.dueAmount?.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/purchases/bills/${b._id}`}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                    <button className="p-2 text-gray-300 hover:text-gray-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
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
            <span className="text-[10px] font-black text-amber-600 px-4">
              PAGE {page} OF {totalPages || 1}
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
