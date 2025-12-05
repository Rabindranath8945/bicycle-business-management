"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

export default function POViewPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [po, setPO] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher(`/api/purchase-orders/${id}`);
      setPO(res);
    } catch (e) {
      console.error(e);
      alert("Failed to load PO");
    } finally {
      setLoading(false);
    }
  }

  async function confirmPO() {
    if (!confirm("Confirm this PO?")) return;
    try {
      await fetcher(`/api/purchase-orders/${id}/confirm`, { method: "POST" });
      alert("PO confirmed");
      load();
    } catch (e) {
      console.error(e);
      alert("Failed to confirm");
    }
  }

  async function cancelPO() {
    if (!confirm("Cancel this PO?")) return;
    try {
      await fetcher(`/api/purchase-orders/${id}/cancel`, { method: "POST" });
      alert("PO cancelled");
      load();
    } catch (e) {
      console.error(e);
      alert("Failed to cancel");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Purchase Order</h2>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/purchases/po/list")}
            className="px-3 py-2 border rounded"
          >
            Back
          </button>
          <button
            onClick={confirmPO}
            className="px-3 py-2 bg-emerald-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={cancelPO}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <strong>PO#:</strong> {po?.poNumber}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className="text-gray-600">{po?.status}</span>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="font-medium">Items</h4>
              <div className="mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th>Product</th>
                      <th>Ordered</th>
                      <th>Received</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(po?.items || []).map((it: any, i: number) => (
                      <tr key={i} className="border-b">
                        <td>{it.productName || it.product}</td>
                        <td>{it.qtyOrdered}</td>
                        <td>{it.qtyReceived || 0}</td>
                        <td>{it.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
