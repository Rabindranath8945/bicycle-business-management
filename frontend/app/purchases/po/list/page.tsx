"use client";

import { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import {
  FileDown,
  RefreshCcw,
  Plus,
  Search,
  Printer,
  MoreVertical,
  ExternalLink,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function POListPremium() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher("/api/purchase-orders");
      setList(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return list.filter((po) => {
      if (statusFilter !== "all" && po.status !== statusFilter) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        return (
          (po.poNumber || "").toLowerCase().includes(s) ||
          (po.supplier?.name || "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [list, statusFilter, q]);

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "draft":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "partially_received":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "complete":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen pb-10">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Purchase Orders
          </h1>
          <p className="text-gray-500">
            Manage procurement cycles and vendor shipments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-600 transition-all"
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-sm text-gray-700 transition-all"
          >
            <Printer size={18} /> Export List
          </button>
          <Link
            href="/purchases/create-po"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 shadow-indigo-200 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Create New PO
          </Link>
        </div>
      </div>

      {/* 2. SMART FILTERS BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="lg:col-span-6 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search by PO number or supplier name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        <div className="lg:col-span-3 relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft Orders</option>
            <option value="confirmed">Confirmed</option>
            <option value="partially_received">Partially Received</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="lg:col-span-3 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
          Results: <span className="text-indigo-600">{filtered.length}</span> /{" "}
          {list.length}
        </div>
      </div>

      {/* 3. PREMIUM TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[11px] tracking-wider">
                PO Number
              </th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[11px] tracking-wider">
                Supplier Details
              </th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[11px] tracking-wider text-center">
                Lines
              </th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[11px] tracking-wider text-center">
                Status
              </th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[11px] tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[11px] tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((po) => (
              <tr
                key={po._id}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {po.poNumber}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {po.supplier?.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {po.supplier?._id?.slice(-6).toUpperCase()}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium text-xs">
                    {po.items?.length || 0} SKU(s)
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tighter",
                      getStatusStyles(po.status)
                    )}
                  >
                    {po.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {new Date(po.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Link
                      href={`/purchases/po/${po._id}`}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                      title="View Details"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button
                      onClick={() => {}}
                      className="p-2 text-gray-400 hover:text-gray-900 rounded-lg transition-all"
                    >
                      <FileDown size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="max-w-xs mx-auto space-y-3 opacity-40">
                    <Search size={48} className="mx-auto text-gray-300" />
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                      No Records Found
                    </p>
                    <p className="text-xs">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
