"use client";

import { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import {
  FileDown,
  RefreshCcw,
  PlusCircle,
  Search,
  Printer,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PO = {
  _id: string;
  poNumber: string;
  supplier: any;
  status: string;
  createdAt: string;
  items: any[];
};

export default function POListPremium() {
  const [list, setList] = useState<PO[]>([]);
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
      alert("Failed to fetch POs");
    } finally {
      setLoading(false);
    }
  }

  // 🔍 FILTER LOGIC
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

  // 🧾 EXPORT SINGLE PO TO PDF
  function exportSinglePO(po: PO) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Purchase Order: ${po.poNumber}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Supplier: ${po.supplier?.name}`, 14, 30);
    doc.text(`Created: ${new Date(po.createdAt).toLocaleString()}`, 14, 38);
    doc.text(`Status: ${po.status}`, 14, 46);

    autoTable(doc, {
      startY: 55,
      head: [["Product", "Qty", "Rate"]],
      body: po.items.map((i: any) => [
        i.product?.name || "",
        i.quantity,
        `₹${i.rate}`,
      ]),
    });

    doc.save(`${po.poNumber}.pdf`);
  }

  // 🧾 EXPORT FULL LIST AS PDF
  function exportAllPO() {
    const doc = new jsPDF();
    doc.text("Purchase Order List", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["PO#", "Supplier", "Items", "Status", "Date"]],
      body: filtered.map((po) => [
        po.poNumber,
        po.supplier?.name,
        (po.items || []).length,
        po.status,
        new Date(po.createdAt).toLocaleDateString(),
      ]),
    });

    doc.save("purchase-orders.pdf");
  }

  return (
    <div className="p-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-wide">
          Purchase Orders
        </h2>

        <div className="flex gap-2">
          <button
            onClick={exportAllPO}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg shadow flex items-center gap-2 hover:bg-slate-800"
          >
            <Printer size={16} /> Export PDF
          </button>

          <button
            onClick={load}
            className="px-3 py-2 border rounded-lg shadow hover:bg-gray-100 flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <Link
            href="/purchases/create-po"
            className="px-3 py-2 bg-amber-500 text-white rounded-lg shadow flex items-center gap-2"
          >
            <PlusCircle size={18} /> New PO
          </Link>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            placeholder="Search PO or Supplier..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 p-2 border rounded-lg w-full shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="confirmed">Confirmed</option>
          <option value="partially_received">Partially Received</option>
          <option value="complete">Complete</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="text-right text-gray-500 text-sm">
          Showing {filtered.length} of {list.length}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/40">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr className="text-left border-b">
              <th className="py-2 px-2">PO#</th>
              <th>Supplier</th>
              <th>Items</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right pr-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((po) => (
              <tr
                key={po._id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-2 font-medium">{po.poNumber}</td>
                <td>{po.supplier?.name}</td>
                <td>{po.items.length}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusBadge(
                      po.status
                    )}`}
                  >
                    {po.status.replace("_", " ")}
                  </span>
                </td>

                <td>{new Date(po.createdAt).toLocaleDateString()}</td>

                <td className="text-right flex justify-end gap-3 py-2 pr-2">
                  <Link
                    href={`/purchases/po/${po._id}`}
                    className="text-amber-600 font-medium"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => exportSinglePO(po)}
                    className="text-slate-600 hover:text-black flex items-center gap-1"
                  >
                    <FileDown size={16} /> PDF
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusBadge(s: string) {
  switch (s) {
    case "draft":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "partially_received":
      return "bg-amber-100 text-amber-700";
    case "complete":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
