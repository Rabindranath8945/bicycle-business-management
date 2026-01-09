"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  Search,
  RefreshCcw,
  Download,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  ArrowUpDown,
  History,
  TrendingDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SupplierRef = { _id?: string; name?: string; phone?: string };
type PurchaseReturn = {
  _id: string;
  returnNo?: string;
  supplier?: SupplierRef;
  totalAmount?: number;
  createdAt?: string;
  creditNoteRef?: string | null;
};
type SupplierOption = { id: string; sup: SupplierRef };

const safeString = (v: any) => (v == null ? "" : String(v));
const safeNumber = (v: any) => Number(v ?? 0);

export default function PurchaseReturnListPremium() {
  const router = useRouter();
  const [list, setList] = useState<PurchaseReturn[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [q, setQ] = useState("");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await fetcher("/api/purchase-returns");
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      alert("Failed to load purchase returns");
    } finally {
      setLoading(false);
    }
  }

  const suppliers: SupplierOption[] = useMemo(() => {
    const map = new Map<string, SupplierRef>();
    list.forEach((r) => {
      const sid = r.supplier?._id || safeString(r.supplier?.name);
      if (!map.has(sid))
        map.set(sid, {
          _id: r.supplier?._id,
          name: r.supplier?.name,
          phone: r.supplier?.phone,
        });
    });
    return Array.from(map.entries()).map(([id, sup]) => ({ id, sup }));
  }, [list]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter((r) => {
      if (s) {
        const rn = (r.returnNo || "").toLowerCase();
        const sup = (r.supplier?.name || "").toLowerCase();
        const amt = String(safeNumber(r.totalAmount)).toLowerCase();
        if (!(rn.includes(s) || sup.includes(s) || amt.includes(s)))
          return false;
      }
      if (
        supplierFilter !== "all" &&
        (r.supplier?._id || safeString(r.supplier?.name)) !== supplierFilter
      )
        return false;
      if (dateFrom && new Date(r.createdAt || "") < new Date(dateFrom))
        return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59);
        if (new Date(r.createdAt || "") > to) return false;
      }
      const amt = safeNumber(r.totalAmount);
      if (minAmount && amt < safeNumber(minAmount)) return false;
      if (maxAmount && amt > safeNumber(maxAmount)) return false;
      return true;
    });
  }, [list, q, supplierFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const stats = useMemo(
    () => ({
      total: filtered.length,
      value: filtered.reduce(
        (acc, curr) => acc + safeNumber(curr.totalAmount),
        0
      ),
      withCredit: filtered.filter((r) => r.creditNoteRef).length,
    }),
    [filtered]
  );

  function exportCSVAll() {
    const headers = [
      "Return No",
      "Supplier",
      "Total Amount",
      "Date",
      "Credit Note",
    ];
    const rows = list.map((r) => [
      r.returnNo,
      r.supplier?.name,
      safeNumber(r.totalAmount).toFixed(2),
      r.createdAt,
      r.creditNoteRef,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Purchase_Returns_2026.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <History size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Inventory ERP 2026
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Purchase Returns
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage reverse logistics and credit settlements
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSVAll}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium text-sm"
            >
              <Download size={16} /> Export Data
            </button>
            <Link
              href="/purchases/returns/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 ring-offset-2 focus:ring-2 ring-indigo-500"
            >
              <Plus size={20} /> Create Return
            </Link>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Return Count",
              val: stats.total,
              sub: "Filtered Records",
              icon: <TrendingDown className="text-rose-500" />,
            },
            {
              label: "Total Refund Value",
              val: `₹${stats.value.toLocaleString("en-IN")}`,
              sub: "Debit Balance",
              icon: <ArrowUpDown className="text-emerald-500" />,
            },
            {
              label: "Settled w/ Credit",
              val: stats.withCredit,
              sub: "Note Reference Linked",
              icon: <Calendar className="text-indigo-500" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">
                  {item.label}
                </p>
                <p className="text-2xl font-black mt-1">{item.val}</p>
                <p className="text-[10px] text-slate-400 mt-1">{item.sub}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">{item.icon}</div>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Quick search by return no, supplier..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  showFilters
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Filter size={18} /> Filters{" "}
                {showFilters && <X size={14} className="ml-1" />}
              </button>
              <button
                onClick={loadAll}
                className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
              >
                <RefreshCcw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-100 bg-slate-50/50 p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Supplier
                  </label>
                  <select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="w-full bg-white border-slate-200 rounded-lg text-sm"
                  >
                    <option value="all">All Vendors</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.sup.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-white border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full bg-white border-slate-200 rounded-lg text-sm"
                    placeholder="₹ 0.00"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setQ("");
                      setSupplierFilter("all");
                      setDateFrom("");
                      setDateTo("");
                      setMinAmount("");
                      setMaxAmount("");
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 underline underline-offset-4"
                  >
                    Reset All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan={6}
                        className="px-6 py-4 bg-slate-50/20 h-12"
                      ></td>
                    </tr>
                  ))
                ) : pageData.length > 0 ? (
                  pageData.map((r) => {
                    const isCredit = !!r.creditNoteRef;
                    return (
                      <tr
                        key={r._id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                            {r.returnNo || "PR-PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700">
                            {r.supplier?.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {r.supplier?.phone || "No phone recorded"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {isCredit ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                              CREDIT NOTE
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-800">
                          ₹{safeNumber(r.totalAmount).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              router.push(`/purchases/returns/${r._id}`)
                            }
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center">
                        <History size={48} className="mb-2 opacity-20" />
                        <p className="font-bold">No return records found</p>
                        <p className="text-xs">
                          Adjust your filters or create a new return
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Showing{" "}
              <span className="text-slate-900 font-bold">
                {pageData.length}
              </span>{" "}
              of {filtered.length} results
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-slate-200 bg-white rounded-lg disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === i + 1
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-slate-200 bg-white rounded-lg disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
