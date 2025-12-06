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
} from "lucide-react";

type Bill = {
  _id: string;
  billNo?: string;
  supplier?: { name?: string };
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  createdAt?: string;
};

export default function BillListPage() {
  const [list, setList] = useState<Bill[]>([]);
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
      alert("Failed to load bills");
    } finally {
      setLoading(false);
    }
  }

  // FILTERED LIST
  const filtered = useMemo(() => {
    let data = [...list];

    const s = search.toLowerCase();

    data = data.filter((b) => {
      const billNo = (b.billNo || "").toLowerCase();
      const supplier = (b.supplier?.name || "").toLowerCase();
      const total = Number(b.totalAmount || 0);

      // search
      if (s && !billNo.includes(s) && !supplier.includes(s)) return false;

      // status filter
      if (statusFilter === "paid" && Number(b.dueAmount) !== 0) return false;
      if (statusFilter === "due" && Number(b.dueAmount) === 0) return false;

      // amount filter
      if (minAmount && total < Number(minAmount)) return false;
      if (maxAmount && total > Number(maxAmount)) return false;

      // date filter
      if (startDate) {
        if (new Date(b.createdAt!) < new Date(startDate)) return false;
      }
      if (endDate) {
        if (new Date(b.createdAt!) > new Date(endDate)) return false;
      }

      return true;
    });

    return data;
  }, [list, search, minAmount, maxAmount, startDate, endDate, statusFilter]);

  // PAGINATION DATA
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // CSV EXPORT
  function exportCSV() {
    const headers = ["Bill No", "Supplier", "Total", "Paid", "Due", "Date"];
    const rows = filtered.map((b) => [
      b.billNo,
      b.supplier?.name,
      b.totalAmount,
      b.paidAmount,
      b.dueAmount,
      new Date(b.createdAt!).toLocaleString(),
    ]);

    const csv =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase-bills.csv";
    a.click();
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Bills</h1>
          <div className="text-sm text-gray-500">
            Manage, view and export purchase bills
          </div>
        </div>

        <div className="flex gap-3">
          {/* Clear */}
          <button
            className="p-2 border rounded-lg hover:bg-gray-100"
            onClick={() => {
              setSearch("");
              setMinAmount("");
              setMaxAmount("");
              setStartDate("");
              setEndDate("");
              setStatusFilter("all");
            }}
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
            href="/purchases/create-bill"
            className="px-3 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600"
          >
            New Bill
          </Link>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/70 shadow p-4 rounded-xl mb-5 grid grid-cols-1 md:grid-cols-7 gap-3 border backdrop-blur">
        {/* Search */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3 text-gray-500" size={17} />
          <input
            className="pl-9 p-2.5 border rounded-lg w-full"
            placeholder="Search bill / supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status */}
        <select
          className="p-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Bills</option>
          <option value="paid">Fully Paid</option>
          <option value="due">Due Only</option>
        </select>

        {/* Date From */}
        <input
          type="date"
          className="p-2 border rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* Date To */}
        <input
          type="date"
          className="p-2 border rounded-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* Min Amount */}
        <input
          className="p-2 border rounded-lg"
          placeholder="Min amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />

        {/* Max Amount */}
        <input
          className="p-2 border rounded-lg"
          placeholder="Max amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white/70 p-4 rounded-2xl shadow-xl border backdrop-blur overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading…</div>
        ) : (
          <table className="w-full text-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Bill#</th>
                <th>Supplier</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{b.billNo}</td>
                  <td>{b.supplier?.name || "—"}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>₹{b.paidAmount}</td>
                  <td className={b.dueAmount! > 0 ? "text-red-600" : ""}>
                    ₹{b.dueAmount}
                  </td>
                  <td>{new Date(b.createdAt!).toLocaleDateString()}</td>

                  <td className="text-right pr-3 flex justify-end gap-4">
                    <button
                      onClick={() =>
                        window.open(
                          `/purchases/bills/pdf/${b._id}?t=${Date.now()}`,
                          "_blank"
                        )
                      }
                      className="text-slate-700 hover:text-black flex items-center gap-1"
                    >
                      <FileDown size={16} /> PDF
                    </button>

                    <Link
                      href={`/purchases/bills/${b._id}`}
                      prefetch={false}
                      className="text-amber-600 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No bills found
                  </td>
                </tr>
              )}
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
