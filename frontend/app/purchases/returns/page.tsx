"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import {
  Search,
  FileDown,
  RefreshCcw,
  MessageCircle,
  Download,
} from "lucide-react";

/**
 * Premium Purchase Return List (client-side pagination, CSV export of ALL records)
 *
 * Pagination: client-side (A)
 * CSV Export: all records (2)
 *
 * Notes:
 * - Exports the entire `list` to CSV (not only filtered page), as requested.
 * - Uses defensive helpers (safeString, safeNumber) to avoid runtime/TS issues.
 */

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
  const [list, setList] = useState<PurchaseReturn[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters / UI state
  const [q, setQ] = useState("");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // Pagination (client-side)
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
      console.error("Failed to load purchase returns", err);
      alert("Failed to load purchase returns");
    } finally {
      setLoading(false);
    }
  }

  // derive unique suppliers list for filter dropdown
  const suppliers: SupplierOption[] = useMemo(() => {
    const map = new Map<string, SupplierRef>();

    for (const r of list) {
      const sid = r.supplier?._id || safeString(r.supplier?.name);
      const supObj: SupplierRef = {
        _id: r.supplier?._id,
        name: r.supplier?.name,
        phone: r.supplier?.phone,
      };

      if (!map.has(sid)) map.set(sid, supObj);
    }

    return Array.from(map.entries()).map(([id, sup]) => ({ id, sup }));
  }, [list]);

  // Combined filtered results (applies all quick filters + search)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    return list.filter((r) => {
      // search match (returnNo or supplier name or amount)
      if (s) {
        const rn = (r.returnNo || "").toLowerCase();
        const sup = (r.supplier?.name || "").toLowerCase();
        const amt = String(safeNumber(r.totalAmount)).toLowerCase();
        if (!(rn.includes(s) || sup.includes(s) || amt.includes(s)))
          return false;
      }

      // supplier filter
      if (supplierFilter !== "all") {
        const matchId = r.supplier?._id || safeString(r.supplier?.name);
        if (matchId !== supplierFilter) return false;
      }

      // date range filter
      if (dateFrom) {
        const created = new Date(r.createdAt || "");
        const from = new Date(dateFrom);
        // normalize dates (ignore time)
        if (
          isFinite(created.getTime()) &&
          created < new Date(from.toDateString())
        )
          return false;
      }
      if (dateTo) {
        const created = new Date(r.createdAt || "");
        const to = new Date(dateTo);
        // include the whole day
        to.setHours(23, 59, 59, 999);
        if (isFinite(created.getTime()) && created > to) return false;
      }

      // amount range
      const amt = safeNumber(r.totalAmount);
      if (minAmount && amt < safeNumber(Number(minAmount))) return false;
      if (maxAmount && amt > safeNumber(Number(maxAmount))) return false;

      return true;
    });
  }, [list, q, supplierFilter, dateFrom, dateTo, minAmount, maxAmount]);

  // pagination logic (client-side)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Export CSV (ALL records as requested)
  function exportCSVAll() {
    if (!list || list.length === 0) {
      alert("No records to export");
      return;
    }

    const headers = [
      "Return No",
      "Supplier",
      "Total Amount",
      "Date",
      "Credit Note",
    ];
    const rows = list.map((r) => [
      safeString(r.returnNo),
      safeString(r.supplier?.name),
      safeNumber(r.totalAmount).toFixed(2),
      r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
      safeString(r.creditNoteRef || ""),
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase_returns_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setQ("");
    setSupplierFilter("all");
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
    setPage(1);
  }

  // small helper to compute status badge text & classes
  function statusBadgeFor(r: PurchaseReturn) {
    if (r.creditNoteRef)
      return { text: "Credit Note", cls: "bg-sky-100 text-sky-800" };
    // if totalAmount is 0 or negative (refunded) mark refunded
    if (safeNumber(r.totalAmount) <= 0)
      return { text: "Refunded", cls: "bg-emerald-100 text-emerald-800" };
    return { text: "Pending", cls: "bg-amber-100 text-amber-800" };
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Returns</h1>
          <div className="text-sm text-gray-500">
            Manage, view and export purchase returns
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAll}
            className="px-3 py-2 border rounded-lg inline-flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <button
            onClick={exportCSVAll}
            className="px-3 py-2 bg-slate-800 text-white rounded-lg inline-flex items-center gap-2"
          >
            <Download size={14} /> Export CSV (All)
          </button>

          <Link
            href="/purchases/returns/create"
            className="px-3 py-2 bg-amber-500 text-white rounded-lg shadow"
          >
            New Return
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 p-4 rounded-2xl shadow-sm border border-white/30 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search return no / supplier / amount..."
            className="pl-10 p-2 border rounded-lg w-full"
          />
        </div>

        <div className="flex gap-2">
          <select
            className="p-2 border rounded-lg w-full"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          >
            <option value="all">All Suppliers</option>
            {suppliers.map(({ id, sup }) => (
              <option key={id} value={id}>
                {sup?.name || id}
              </option>
            ))}
          </select>

          <div className="flex gap-2 w-full">
            <input
              type="date"
              className="p-2 border rounded-lg w-full"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded-lg w-full"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <input
            placeholder="Min amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="p-2 border rounded-lg w-1/2"
          />
          <input
            placeholder="Max amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="p-2 border rounded-lg w-1/2"
          />
          <button
            onClick={clearFilters}
            className="px-3 py-2 border rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-xl border border-white/30 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Return#</th>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Credit Note</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map((r) => {
              const badge = statusBadgeFor(r);
              return (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">
                      {safeString(r.returnNo) || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {r._id.slice(0, 8)}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-100 to-white flex items-center justify-center text-sm font-medium border border-white/30">
                        {safeString(r.supplier?.name).charAt(0) || "S"}
                      </div>

                      <div>
                        <div className="font-medium">
                          {safeString(r.supplier?.name) || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Contact: {safeString(r.supplier?.phone) || "—"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold">
                      ₹{safeNumber(r.totalAmount).toFixed(2)}
                    </div>
                  </td>

                  <td className="p-3 text-sm text-gray-600">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>

                  <td className="p-3">
                    {r.creditNoteRef ? (
                      <span
                        className={`px-2 py-1 rounded text-xs ${badge.cls}`}
                      >
                        {r.creditNoteRef}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button
                        title="Open PDF (new tab)"
                        onClick={() =>
                          window.open(
                            `/purchases/returns/pdf/${r._id}`,
                            "_blank"
                          )
                        }
                        className="text-slate-700 hover:text-black inline-flex items-center gap-1"
                      >
                        <FileDown size={16} /> PDF
                      </button>

                      <Link
                        href={`/purchases/returns/${r._id}`}
                        className="text-amber-600 font-medium"
                      >
                        View
                      </Link>

                      <button
                        title="Share via WhatsApp"
                        onClick={() =>
                          window.open(
                            `/purchases/returns/share/${r._id}`,
                            "_blank"
                          )
                        }
                        className="text-green-600 inline-flex items-center gap-1"
                      >
                        <MessageCircle size={16} /> Share
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* empty state */}
        {filtered.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">
            No purchase returns found
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Rows per page</div>
          <select
            className="p-2 border rounded"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="inline-flex items-center gap-1">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              {"<<"}
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {"<"}
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              {">"}
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
