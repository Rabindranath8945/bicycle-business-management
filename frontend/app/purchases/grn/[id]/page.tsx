"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Printer, Package, User, CalendarDays } from "lucide-react";

export default function GRNDetail() {
  const { id } = useParams() as any;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    try {
      const r = await fetcher(`/api/grn/${id}`);
      setData(r);
    } catch (err) {
      console.error(err);
      alert("Failed to load GRN");
    }
  }

  function handlePrint() {
    window.print();
  }

  if (!data)
    return (
      <div className="p-6 text-gray-600 text-lg">Loading GRN details…</div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h2 className="text-2xl font-semibold">GRN Details</h2>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 flex items-center gap-2"
          >
            <Printer size={18} /> Print
          </button>
          <Link
            href="/purchases/grn/list"
            className="px-3 py-2 bg-gray-200 rounded-lg"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white/70 p-6 rounded-2xl shadow-xl border border-white/40 backdrop-blur print:border-none print:shadow-none">
        {/* Top Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Package size={18} className="text-amber-600" />
              GRN Information
            </h3>
            <p>
              <strong>GRN Number:</strong> {data.grnNumber}
            </p>
            <p>
              <strong>Reference PO:</strong> {data.poId || "—"}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <User size={18} className="text-emerald-600" />
              Supplier Info
            </h3>
            <p>
              <strong>Name:</strong> {data.supplier?.name || "—"}
            </p>
            <p>
              <strong>Phone:</strong> {data.supplier?.phone || "—"}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 text-gray-600">
          <CalendarDays size={16} />
          Received on:{" "}
          {new Date(data.receivedAt || data.createdAt).toLocaleString()}
        </div>

        {/* Items Table */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 text-left px-3">Product</th>
                <th className="py-3 text-right px-3">Qty</th>
                <th className="py-3 text-right px-3">Cost</th>
                <th className="py-3 text-left px-3">Batch No</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.map((it: any, i: number) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-3">
                    {it.product?.name || it.product}
                    <div className="text-xs text-gray-500">
                      SKU: {it.product?.sku || "—"}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">{it.receivedQty}</td>
                  <td className="px-3 py-3 text-right">
                    ₹{(it.cost || 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">{it.batchNo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="mt-6 text-right pr-3">
          <div className="text-lg font-semibold">
            Total Items: {data.items.length}
          </div>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center mt-6">
        <h1 className="text-xl font-semibold">GRN #{data.grnNumber}</h1>
        <p>{new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
