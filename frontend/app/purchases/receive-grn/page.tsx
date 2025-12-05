"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";

/**
 * Receive GRN - Premium UI
 * - Supplier search + select
 * - Optional: load items from Purchase Order (PO)
 * - Per-row product autocomplete
 * - Inline qty / rate / batch editing
 * - Summary & submit
 */

type Supplier = { _id: string; name: string; phone?: string };
type ProductLite = {
  _id: string;
  name: string;
  sku?: string;
  costPrice?: number;
  stock?: number;
};

export default function ReceiveGRNPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierResults, setSupplierResults] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const [poId, setPoId] = useState("");
  const [loadingPO, setLoadingPO] = useState(false);

  const [items, setItems] = useState<
    {
      id: string;
      product?: ProductLite | null;
      productText?: string;
      receivedQty: number;
      rate: number;
      batchNo?: string;
      expiry?: string;
    }[]
  >([
    {
      id: String(Date.now()),
      product: null,
      productText: "",
      receivedQty: 1,
      rate: 0,
      batchNo: "",
    },
  ]);

  const [productResultsByRow, setProductResultsByRow] = useState<
    Record<string, ProductLite[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const smartRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // load suppliers list (small set). For large data, implement server-side search.
    fetcher("/api/suppliers")
      .then((res) => setSuppliers(Array.isArray(res) ? res : res.items || []))
      .catch(() => setSuppliers([]));
  }, []);

  // Supplier search locally (simple)
  useEffect(() => {
    if (!supplierQuery) {
      setSupplierResults([]);
      return;
    }
    const q = supplierQuery.toLowerCase();
    setSupplierResults(
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s._id || "").toLowerCase().includes(q)
      )
    );
  }, [supplierQuery, suppliers]);

  function newRow() {
    setItems((p) => [
      ...p,
      {
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        product: null,
        productText: "",
        receivedQty: 1,
        rate: 0,
        batchNo: "",
      },
    ]);
  }

  function updateRow(id: string, patch: Partial<(typeof items)[number]>) {
    setItems((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setItems((p) => p.filter((r) => r.id !== id));
  }

  async function searchProductsForRow(rowId: string, q: string) {
    if (!q) {
      setProductResultsByRow((s) => ({ ...s, [rowId]: [] }));
      return;
    }
    try {
      const res = await fetcher(`/api/products?q=${encodeURIComponent(q)}`);
      const arr = Array.isArray(res) ? res : res.items || [];
      setProductResultsByRow((s) => ({ ...s, [rowId]: arr }));
    } catch (err) {
      setProductResultsByRow((s) => ({ ...s, [rowId]: [] }));
    }
  }

  async function loadPO() {
    if (!poId) return alert("Enter Purchase Order ID to load.");
    setLoadingPO(true);
    try {
      const po = await fetcher(`/api/purchases/${poId}`);
      // po expected to have items: [{ product, quantity, rate }]
      if (!po || !po.items) return alert("PO not found or has no items");
      const mapped = po.items.map((it: any) => ({
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        product: it.product?.name
          ? {
              _id: it.product._id || it.product,
              name: it.product.name || it.product,
              sku: it.product.sku,
              costPrice: it.rate || it.product?.costPrice,
            }
          : null,
        productText: it.product?.name || "",
        receivedQty: it.quantity || it.qty || 1,
        rate: it.rate || it.cost || it.product?.costPrice || 0,
        batchNo: it.batchNo || "",
      }));
      setItems(mapped);
      if (po.supplier) {
        setSelectedSupplier(
          typeof po.supplier === "string"
            ? suppliers.find((s) => s._id === po.supplier) || null
            : po.supplier
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load PO");
    } finally {
      setLoadingPO(false);
    }
  }

  function chooseProductForRow(rowId: string, p: ProductLite) {
    updateRow(rowId, {
      product: p,
      productText: p.name,
      rate: p.costPrice || 0,
    });
    setProductResultsByRow((s) => ({ ...s, [rowId]: [] }));
  }

  function autoGenerateBatchesIfEmpty() {
    setItems((prev) =>
      prev.map((r) => ({
        ...r,
        batchNo:
          r.batchNo ||
          `B-${Date.now().toString().slice(-6)}-${Math.floor(
            Math.random() * 999
          )}`,
      }))
    );
  }

  const subtotal = items.reduce(
    (s, it) => s + (it.receivedQty || 0) * (it.rate || 0),
    0
  );
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  async function submitGRN() {
    if (!selectedSupplier) return alert("Select supplier");
    if (items.length === 0) return alert("Add items");
    for (const it of items) {
      if (!it.product && !it.productText)
        return alert("Every item must have a product selected or typed");
    }

    // ensure batches
    autoGenerateBatchesIfEmpty();

    const payload = {
      supplier: selectedSupplier._id,
      poId: poId || null,
      items: items.map((it) => ({
        product: it.product?._id || it.productText,
        receivedQty: it.receivedQty,
        rate: it.rate,
        batchNo: it.batchNo,
        expiry: it.expiry || null,
      })),
    };

    try {
      setSaving(true);
      const res = await fetcher("/api/grn", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("GRN created successfully");
      window.location.href = "/purchases/grn/list";
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to create GRN");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Receive Goods (GRN)</h1>
        <div className="flex gap-3">
          <Link href="/purchases/grn/list" className="text-sm text-amber-600">
            Back to GRN list
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Supplier card */}
          <div className="bg-white/70 p-5 rounded-2xl shadow border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-medium">Supplier</div>
              <div className="text-sm text-gray-500">
                Select supplier for this GRN
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="col-span-2 relative">
                <input
                  placeholder="Search supplier by name or paste id..."
                  className="w-full p-3 border rounded-lg"
                  value={supplierQuery}
                  onChange={(e) => {
                    setSupplierQuery(e.target.value);
                    setSelectedSupplier(null);
                  }}
                />
                {supplierResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-44 overflow-auto">
                    {supplierResults.map((s) => (
                      <div
                        key={s._id}
                        className="p-2 hover:bg-amber-50 cursor-pointer"
                        onClick={() => {
                          setSelectedSupplier(s);
                          setSupplierQuery("");
                          setSupplierResults([]);
                        }}
                      >
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Selected</div>
                <div className="p-3 rounded-lg border h-12 flex items-center">
                  {selectedSupplier ? (
                    <div>
                      <div className="font-medium">{selectedSupplier.name}</div>
                      <div className="text-xs text-gray-500">
                        {selectedSupplier.phone}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      No supplier selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PO loader */}
          <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
            <div className="flex items-center gap-3">
              <input
                placeholder="Purchase Order ID (optional)"
                className="p-3 border rounded-lg flex-1"
                value={poId}
                onChange={(e) => setPoId(e.target.value)}
              />
              <button
                onClick={loadPO}
                disabled={loadingPO}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg"
              >
                {loadingPO ? "Loading..." : "Load PO"}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Tip: enter PO id to import items and supplier automatically.
            </div>
          </div>

          {/* Items */}
          <div className="bg-white/70 p-5 rounded-2xl shadow border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-medium">Items</div>
              <div className="text-sm text-gray-500">{items.length} rows</div>
            </div>

            <div className="space-y-3">
              {items.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-12 gap-3 items-center bg-white/50 p-3 rounded-xl border"
                >
                  {/* product search */}
                  <div className="col-span-5 relative">
                    <input
                      placeholder="Search product name / sku / barcode"
                      className="w-full p-2 border rounded-lg"
                      value={row.productText}
                      onChange={(e) => {
                        updateRow(row.id, {
                          productText: e.target.value,
                          product: null,
                        });
                        searchProductsForRow(row.id, e.target.value);
                      }}
                      onFocus={(e) => {
                        if (row.productText)
                          searchProductsForRow(row.id, row.productText);
                      }}
                    />
                    {/* dropdown */}
                    {Array.isArray(productResultsByRow[row.id]) &&
                      productResultsByRow[row.id].length > 0 && (
                        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-44 overflow-auto">
                          {productResultsByRow[row.id].map((p) => (
                            <div
                              key={p._id}
                              className="p-2 hover:bg-amber-50 cursor-pointer"
                              onClick={() => chooseProductForRow(row.id, p)}
                            >
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-gray-500">
                                {p.sku} · ₹{p.costPrice || 0} · stock{" "}
                                {p.stock ?? "-"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* qty */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg text-right"
                      value={row.receivedQty}
                      onChange={(e) =>
                        updateRow(row.id, {
                          receivedQty: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                    />
                  </div>

                  {/* rate */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg text-right"
                      value={row.rate}
                      onChange={(e) =>
                        updateRow(row.id, {
                          rate: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                    />
                  </div>

                  {/* batch */}
                  <div className="col-span-2">
                    <input
                      className="w-full p-2 border rounded-lg"
                      placeholder="Batch no (optional)"
                      value={row.batchNo}
                      onChange={(e) =>
                        updateRow(row.id, { batchNo: e.target.value })
                      }
                    />
                  </div>

                  {/* actions */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-500 px-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => newRow()}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg"
              >
                + Add Row
              </button>
              <button
                onClick={() => autoGenerateBatchesIfEmpty()}
                className="px-4 py-2 border rounded-lg"
              >
                Auto-generate batches
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
            <label className="text-sm text-gray-600">Notes (optional)</label>
            <textarea className="w-full mt-2 p-2 border rounded-lg" rows={3} />
          </div>
        </div>

        {/* Right: summary & actions */}
        <aside className="space-y-4">
          <div className="bg-white/70 p-4 rounded-2xl shadow border border-white/30">
            <div className="text-sm text-gray-600">Summary</div>
            <div className="mt-3 text-2xl font-semibold">
              ₹{subtotal.toLocaleString()}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              GST (18%): ₹{gst.toLocaleString()}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Total:{" "}
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={submitGRN}
                disabled={saving}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl"
              >
                {saving ? "Saving…" : "Save & Receive"}
              </button>
              <button
                onClick={() => {
                  window.location.href = "/purchases/grn/list";
                }}
                className="w-full py-3 border rounded-xl"
              >
                Cancel
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Tip: Use Purchase Order ID to import items quickly. You can also
              paste barcodes into product field with a scanner.
            </div>
          </div>

          <div className="bg-white/70 p-3 rounded-2xl shadow border border-white/30">
            <div className="text-sm font-medium">Quick actions</div>
            <div className="mt-2 text-xs text-gray-600 space-y-2">
              <div>- Ctrl/Cmd + F to focus product input</div>
              <div>- Press Enter after selecting product to quickly add</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
