"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

type ReturnItem = {
  product?: { name?: string };
  qty: number;
  rate: number;
  tax: number;
  consumedBatches?: { batchNo?: string; qty?: number; cost?: number }[];
};

const safeNum = (v: any) => Number(v ?? 0);

export default function PurchaseReturnDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [ret, setRet] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher(`/api/purchase-returns/${id}`);
      setRet(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load return");
    } finally {
      setLoading(false);
    }
  }

  function openPdf() {
    if (!id) return;
    window.open(`/purchases/returns/pdf/${id}`, "_blank");
  }

  async function downloadPdf() {
    // reuse the PDF generator route but force download: we will fetch blob
    try {
      const resp = await fetch(`/purchases/returns/pdf/${id}`); // this path opens PDF in browser; serverless route may differ
      // If your pdf route is client-only, use the PDF generator page's logic to create/save
      // Here we'll navigate to generator which opens a new tab and user can download
      window.open(`/purchases/returns/pdf/${id}`, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  }

  function shareWhatsApp() {
    // opens a dedicated share route that will generate PDF (data URI) and open wa.me link
    if (!id) return;
    window.open(`/purchases/returns/share/${id}`, "_blank");
  }

  if (!ret && loading) return <div className="p-6 text-gray-500">Loading…</div>;
  if (!ret) return <div className="p-6">No return found.</div>;

  const items = (ret.items || []) as ReturnItem[];
  const subtotal = items.reduce(
    (s, it) => s + safeNum(it.qty) * safeNum(it.rate),
    0
  );
  const gst = safeNum(ret.totalAmount) - subtotal; // fallback if backend provides tax split, otherwise estimate
  const cgst = +(gst / 2).toFixed(2);
  const sgst = +(gst / 2).toFixed(2);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Return #{ret.returnNo}</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadPdf}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Download PDF
          </button>
          <button onClick={openPdf} className="px-3 py-2 border rounded-lg">
            Open PDF
          </button>
          <button
            onClick={shareWhatsApp}
            className="px-3 py-2 bg-green-600 text-white rounded-lg"
          >
            Share via WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 shadow-xl border border-white/30">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Supplier</div>
            <div className="font-medium">{ret.supplier?.name || "—"}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Date</div>
            <div className="font-medium">
              {new Date(ret.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-right">Tax%</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{it.product?.name || "—"}</td>
                  <td className="p-2 text-right">{safeNum(it.qty)}</td>
                  <td className="p-2 text-right">
                    ₹{safeNum(it.rate).toFixed(2)}
                  </td>
                  <td className="p-2 text-right">{safeNum(it.tax)}%</td>
                  <td className="p-2 text-right">
                    ₹{(safeNum(it.qty) * safeNum(it.rate)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right space-y-1">
          <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
          <div>CGST: ₹{cgst.toFixed(2)}</div>
          <div>SGST: ₹{sgst.toFixed(2)}</div>
          <div className="font-semibold">
            Total: ₹{safeNum(ret.totalAmount).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
