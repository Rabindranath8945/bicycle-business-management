"use client";

import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";

type Product = { _id: string; name: string; rate?: number };

export default function PurchaseReturnPage() {
  const [supplier, setSupplier] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchProducts(q: string) {
    if (!q.trim()) return setSuggestions([]);
    const res = await fetcher(`/api/products/search?q=${q}`);
    setSuggestions(res.items);
  }

  async function saveReturn() {
    setLoading(true);
    try {
      await fetcher("/api/purchase-returns", {
        method: "POST",
        body: JSON.stringify({ supplier, purchase: purchaseId, items }),
      });
      alert("Purchase Return Completed!");
    } catch (err) {
      console.error(err);
      alert("Return failed");
    } finally {
      setLoading(false);
    }
  }

  function addItem(product: Product) {
    setItems([
      ...items,
      {
        product: product._id,
        name: product.name,
        qty: 1,
        rate: product.rate ?? 0,
        total: product.rate ?? 0,
      },
    ]);
    setSuggestions([]);
  }

  function updateQty(idx: number, qty: number) {
    const c = [...items];
    c[idx].qty = qty;
    c[idx].total = qty * c[idx].rate;
    setItems(c);
  }

  function updateRate(idx: number, rate: number) {
    const c = [...items];
    c[idx].rate = rate;
    c[idx].total = rate * c[idx].qty;
    setItems(c);
  }

  function deleteItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  const totalReturn = items.reduce((s, it) => s + it.total, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white/70 p-6 rounded-2xl shadow-xl border backdrop-blur-xl">
        <h1 className="text-xl font-semibold mb-6">Purchase Return</h1>

        {/* Supplier + Bill */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            className="p-3 border rounded-xl"
            placeholder="Supplier ID"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />

          <input
            className="p-3 border rounded-xl"
            placeholder="Purchase Bill ID (optional)"
            value={purchaseId}
            onChange={(e) => setPurchaseId(e.target.value)}
          />
        </div>

        {/* PRODUCT SEARCH */}
        <div className="relative mb-4">
          <input
            className="p-3 border rounded-xl w-full"
            placeholder="Search Products..."
            onChange={(e) => searchProducts(e.target.value)}
          />

          {suggestions.length > 0 && (
            <div className="absolute bg-white border rounded-xl w-full mt-1 shadow max-h-60 overflow-y-auto z-50">
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addItem(p)}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b">
              <th className="py-2">Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{it.name}</td>

                <td>
                  <input
                    type="number"
                    className="p-2 border rounded w-20"
                    value={it.qty}
                    onChange={(e) => updateQty(idx, Number(e.target.value))}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="p-2 border rounded w-24"
                    value={it.rate}
                    onChange={(e) => updateRate(idx, Number(e.target.value))}
                  />
                </td>

                <td>₹{it.total.toFixed(2)}</td>

                <td>
                  <button
                    onClick={() => deleteItem(idx)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SUMMARY */}
        <div className="flex justify-between items-center mt-6">
          <h3 className="text-lg font-semibold">
            Total Return: ₹{totalReturn}
          </h3>

          <button
            onClick={saveReturn}
            disabled={loading}
            className={`px-6 py-3 rounded-xl shadow text-white 
              ${loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Saving..." : "Submit Return"}
          </button>
        </div>
      </div>
    </div>
  );
}
