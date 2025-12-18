"use client";

import { useEffect, useRef, useState } from "react";
import ProductSearchBox from "@/components/ProductSearchBox";

export type SaleMode = "RETAIL" | "WHOLESALE" | "CYCLE";

export type SaleItemRow = {
  id: string;
  productId?: string;
  name: string;
  sku?: string;
  qty: number;
  price: number;
  gst: number;
};

export default function FastSaleBase({
  mode,
  priceKey,
  allowFitting,
  productFilter,
}: {
  mode: SaleMode;
  priceKey: "sellingPrice" | "wholesalePrice";
  allowFitting?: boolean;
  productFilter?: (p: any) => boolean;
}) {
  const smartRef = useRef<HTMLInputElement | null>(null);
  const [smartValue, setSmartValue] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [items, setItems] = useState<SaleItemRow[]>([]);
  const [fitting, setFitting] = useState(0);

  useEffect(() => {
    smartRef.current?.focus();
  }, []);

  function normalizeId() {
    return String(Date.now()) + Math.floor(Math.random() * 9999);
  }

  function addOrIncrement(product: any) {
    setItems((prev) => {
      const idx = prev.findIndex((r) => r.productId === product._id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx].qty += 1;
        return cp;
      }
      return [
        {
          id: normalizeId(),
          productId: product._id,
          name: product.name,
          sku: product.sku,
          qty: 1,
          price: product[priceKey] ?? 0,
          gst: 5,
        },
        ...prev,
      ];
    });
  }

  /* ---------- totals ---------- */

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const gstTotal = items.reduce(
    (s, i) => s + (i.qty * i.price * i.gst) / 100,
    0
  );
  const fittingGST = allowFitting ? (fitting * 18) / 100 : 0;
  const grandTotal = subtotal + gstTotal + fitting + fittingGST;

  /* ---------- UI ---------- */

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {mode === "RETAIL" && "Retail Sale"}
              {mode === "WHOLESALE" && "Wholesale Invoice"}
              {mode === "CYCLE" && "New Cycle Sale"}
            </h2>
          </div>

          {/* Customer */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Customer Name"
                className="p-3 border rounded-lg"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="p-3 border rounded-lg"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Smart input */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="text-xs text-gray-500 mb-1">
              Scan barcode or type product name / SKU
            </div>

            <ProductSearchBox
              filter={productFilter}
              onSelect={(product) => addOrIncrement(product)}
            />
          </div>

          {/* Items table */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th>Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b">
                    <td>{it.name}</td>
                    <td className="text-right">
                      <input
                        type="number"
                        value={it.qty}
                        className="w-20 border rounded text-right"
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((r) =>
                              r.id === it.id
                                ? {
                                    ...r,
                                    qty: Math.max(1, Number(e.target.value)),
                                  }
                                : r
                            )
                          )
                        }
                      />
                    </td>
                    <td className="text-right">₹{it.price}</td>
                    <td className="text-right">
                      ₹{(it.qty * it.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="text-sm text-gray-500">Summary</div>
            <div className="text-2xl font-semibold mt-2">
              ₹{grandTotal.toLocaleString()}
            </div>

            {allowFitting && (
              <div className="mt-3">
                <label className="text-sm">Fitting Charges</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={fitting}
                  onChange={(e) => setFitting(Number(e.target.value) || 0)}
                />
              </div>
            )}

            <button className="mt-4 w-full px-4 py-3 bg-emerald-600 text-white rounded-lg">
              Save & Print
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
