"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SaleRow = {
  _id: string;
  invoiceNo: string;
  customerName?: string;
  phone?: string;
  grandTotal: number;
  createdAt: string;
};

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalRows, setTotalRows] = useState<number | null>(null);

  // simple debounce for q
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchSales(1).catch(() => {});
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    fetchSales(page).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchSales(p = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(p));
      params.append("limit", String(limit));
      if (q) params.append("q", q);
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const res = await axios.get(`/api/sales?${params.toString()}`);
      // Expected: an array or { data: [], total }
      const data = res.data;
      if (Array.isArray(data)) {
        setSales(data);
        setTotalRows(
          data.length < limit ? (p - 1) * limit + data.length : null
        );
      } else if (data?.sales) {
        setSales(data.sales);
        setTotalRows(typeof data.total === "number" ? data.total : null);
      } else {
        setSales(data || []);
      }
    } catch (err: any) {
      console.error("fetchSales", err);
      toast.error(err?.response?.data?.message || "Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!q) return sales;
    const s = q.toLowerCase();
    return sales.filter(
      (r) =>
        (r.invoiceNo || "").toLowerCase().includes(s) ||
        (r.customerName || "").toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s)
    );
  }, [q, sales]);

  const viewPdf = async (id: string) => {
    try {
      const res = await axios.get(`/api/sales/pdf/${id}`);
      const data = res.data;
      if (!data?.pdfBase64) throw new Error("No PDF returned");
      const bytes = atob(data.pdfBase64);
      const arr = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob = new Blob([arr], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err: any) {
      console.error("viewPdf", err);
      toast.error(err?.response?.data?.message || "Failed to open invoice");
    }
  };

  const exportCsv = () => {
    try {
      if (!sales || sales.length === 0) {
        toast.error("No rows to export");
        return;
      }
      const rows = [["Invoice", "Customer", "Phone", "Total", "Date"]];
      sales.forEach((s) =>
        rows.push([
          s.invoiceNo,
          s.customerName ?? "",
          s.phone ?? "",
          String(Number(s.grandTotal).toFixed(2)),
          new Date(s.createdAt).toLocaleString(),
        ])
      );
      const csv = rows
        .map((r) =>
          r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (err) {
      console.error("exportCsv", err);
      toast.error("Export failed");
    }
  };

  const handleApplyFilters = async () => {
    setPage(1);
    await fetchSales(1);
  };

  const handleResetFilters = async () => {
    setQ("");
    setFrom("");
    setTo("");
    setPage(1);
    await fetchSales(1);
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Sales History</h1>
            <p className="text-sm text-slate-400 mt-1">
              View and manage past invoices
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/sales/new"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg"
            >
              <FileText size={16} />
              New Sale
            </a>

            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-700 rounded-lg text-slate-200 bg-slate-900/40"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/80 backdrop-blur p-4 rounded-2xl border border-slate-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search invoice, customer, phone..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />

            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
              >
                Apply
              </button>
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 border border-slate-700 rounded-lg text-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl overflow-auto">
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading...</div>
          ) : sales.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No sales found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-3 text-left">Invoice</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-slate-700 hover:bg-slate-800/30"
                  >
                    <td className="p-3">{s.invoiceNo}</td>
                    <td className="p-3">{s.customerName || "-"}</td>
                    <td className="p-3">{s.phone || "-"}</td>
                    <td className="p-3 text-right">
                      ₹{Number(s.grandTotal).toFixed(2)}
                    </td>
                    <td className="p-3">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => viewPdf(s._id)}
                        className="inline-flex items-center gap-2 text-emerald-400 hover:underline"
                      >
                        <FileText size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-400">
            Showing {sales.length} {totalRows ? `of ${totalRows}` : ""} rows
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="px-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-900/50">
              Page {page}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
