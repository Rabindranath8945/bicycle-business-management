"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

export default function BillDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [bill, setBill] = useState<any>(null);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    try {
      const res = await fetcher(`/api/purchases/${id}`);
      setBill(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load bill");
    }
  }

  return (
    <div className="p-6">
      {!bill ? (
        <div>Loading…</div>
      ) : (
        <div className="bg-white/70 rounded-2xl p-6 shadow-xl border border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Purchase Bill – {bill.billNo}
            </h2>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={() => router.push(`/purchases/bills/pdf/${bill._id}`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
            >
              Download PDF
            </button>
          </div>

          <div className="mb-4">
            <strong>Supplier:</strong> {bill.supplier?.name || bill.supplier}
          </div>
          <div className="mb-4">
            <strong>Date:</strong> {new Date(bill.createdAt).toLocaleString()}
          </div>
          <div className="mb-4">
            <strong>GRN Linked:</strong> {bill.grn || "—"}
          </div>

          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b font-semibold">
                <th className="py-2">Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Tax%</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((it: any, idx: number) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{it.product?.name}</td>
                  <td>{it.quantity}</td>
                  <td>₹{it.rate}</td>
                  <td>{it.tax}%</td>
                  <td>₹{(it.rate * it.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="mt-6 border-t pt-4">
            <p>
              <strong>Subtotal:</strong> ₹{bill.subtotal}
            </p>
            <p>
              <strong>GST:</strong> ₹{bill.taxTotal}
            </p>
            <p>
              <strong>Total:</strong> ₹{bill.totalAmount}
            </p>
            <p>
              <strong>Paid:</strong> ₹{bill.paidAmount}
            </p>
            <p>
              <strong>Due:</strong> ₹{bill.dueAmount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
