"use client";

import { useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import ProductSearchBox from "@/components/ProductSearchBox";

/**
 * Hybrid Fast Create PO
 * - Smart input at top receives scan / sku / name
 * - On add: product lookup -> inserted into items table
 * - Repeated adds of same product increment qty
 * - Bulk import via modal (Ctrl+I)
 *
 * Note: expects backend product search: GET /api/products?search=<q>
 * and POST /api/purchase-orders for saving.
 */

type ProductLite = {
  _id?: string;
  name?: string;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  stock?: number;
  // any other fields your API returns
};

type ItemRow = {
  id: string;
  productId?: string;
  name: string;
  sku?: string;
  qty: number;
  cost: number;
};

export default function FastCreatePO() {
  const smartRef = useRef<HTMLInputElement | null>(null);
  const [smartValue, setSmartValue] = useState("");
  const [supplier, setSupplier] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [saving, setSaving] = useState(false);
  const lastAddedRef = useRef<string | null>(null);

  useEffect(() => {
    focusSmart();
    // keyboard for bulk import
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+I to toggle bulk import
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setBulkOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function focusSmart() {
    setTimeout(() => smartRef.current?.focus(), 50);
  }

  function normalizeId() {
    return String(Date.now()) + Math.floor(Math.random() * 9999);
  }

  // fast product lookup by barcode / sku / name
  async function lookupProduct(q: string): Promise<ProductLite | null> {
    if (!q || q.trim() === "") return null;
    try {
      const res = await fetcher(
        `/api/products?search=${encodeURIComponent(q.trim())}`
      );
      // backend may return array of matches — pick exact by barcode/sku first, else first result
      if (Array.isArray(res)) {
        // find exact barcode or sku match
        const lc = q.trim().toLowerCase();
        const exact = res.find(
          (p: any) =>
            (p.barcode && p.barcode.toLowerCase() === lc) ||
            (p.sku && p.sku.toLowerCase() === lc)
        );
        return exact || res[0] || null;
      }
      // if single object returned
      return res || null;
    } catch (err) {
      console.error("product lookup failed", err);
      return null;
    }
  }

  // add item (called by Enter or scan)
  async function handleAddSmart(raw: string) {
    const q = raw.trim();
    if (!q) return;
    setLoadingAdd(true);
    try {
      const product = await lookupProduct(q);
      // if found, add name, id, cost
      if (product) {
        addOrIncrement({
          productId: product._id,
          name: product.name || product.sku || q,
          sku: product.sku || product.barcode || "",
          cost: product.costPrice ?? 0,
        });
      } else {
        // fallback: treat raw text as SKU/name without id
        addOrIncrement({
          productId: undefined,
          name: q,
          sku: q,
          cost: 0,
        });
      }
      lastAddedRef.current = q;
      setSmartValue("");
      focusSmart();
    } finally {
      setLoadingAdd(false);
    }
  }

  // add or increment existing item with same productId or sku/name
  function addOrIncrement(payload: {
    productId?: string;
    name: string;
    sku?: string;
    cost?: number;
  }) {
    setItems((prev) => {
      // try match by productId first
      const foundIndex = prev.findIndex(
        (r) => payload.productId && r.productId === payload.productId
      );
      if (foundIndex >= 0) {
        const copy = [...prev];
        copy[foundIndex].qty += 1;
        if (payload.cost !== undefined) copy[foundIndex].cost = payload.cost;
        return copy;
      }
      // else match by sku or name (case-insensitive)
      const key = (payload.sku || payload.name).toLowerCase();
      const idx2 = prev.findIndex(
        (r) => (r.sku || r.name).toLowerCase() === key
      );
      if (idx2 >= 0) {
        const copy = [...prev];
        copy[idx2].qty += 1;
        if (payload.cost !== undefined) copy[idx2].cost = payload.cost;
        return copy;
      }
      // otherwise insert new row at top for quick editing
      const newRow: ItemRow = {
        id: normalizeId(),
        productId: payload.productId,
        name: payload.name,
        sku: payload.sku,
        qty: 1,
        cost: payload.cost ?? 0,
      };
      return [newRow, ...prev];
    });
  }

  // inline edits
  function updateRow(id: string, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  // bulk import: accepts lines like: sku,qty,cost  OR sku qty cost
  function handleBulkPaste() {
    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const toAdd: { skuOrName: string; qty: number; cost: number }[] = [];
    for (const ln of lines) {
      const comma = ln.split(",");
      if (comma.length >= 2) {
        const sku = comma[0].trim();
        const qty = Number(comma[1].trim()) || 1;
        const cost = Number((comma[2] || "0").trim()) || 0;
        toAdd.push({ skuOrName: sku, qty, cost });
        continue;
      }
      const parts = ln.split(/\s+/);
      if (parts.length >= 2) {
        toAdd.push({
          skuOrName: parts[0],
          qty: Number(parts[1]) || 1,
          cost: Number(parts[2] || 0) || 0,
        });
        continue;
      }
      // single word -> one qty
      toAdd.push({ skuOrName: ln, qty: 1, cost: 0 });
    }

    // for speed, add synchronously: try lookup per sku/name in parallel to resolve productId and cost
    (async () => {
      for (const t of toAdd) {
        const p = await lookupProduct(t.skuOrName).catch(() => null);
        if (p) {
          // add with Qty (not only increment)
          setItems((prev) => {
            const idx = p._id
              ? prev.findIndex((r) => r.productId === p._id)
              : prev.findIndex(
                  (r) =>
                    (r.sku || r.name).toLowerCase() ===
                    t.skuOrName.toLowerCase()
                );
            if (idx >= 0) {
              const cp = [...prev];
              cp[idx].qty += t.qty;
              cp[idx].cost = t.cost || cp[idx].cost || p.costPrice || 0;
              return cp;
            }
            return [
              {
                id: normalizeId(),
                productId: p._id,
                name: p.name || t.skuOrName,
                sku: p.sku,
                qty: t.qty,
                cost: t.cost || p.costPrice || 0,
              },
              ...prev,
            ];
          });
        } else {
          setItems((prev) => [
            {
              id: normalizeId(),
              name: t.skuOrName,
              sku: t.skuOrName,
              qty: t.qty,
              cost: t.cost,
            },
            ...prev,
          ]);
        }
      }
    })();

    setBulkOpen(false);
    setBulkText("");
    focusSmart();
  }

  // totals
  const subtotal = items.reduce((s, it) => s + it.qty * (it.cost || 0), 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // save PO
  async function handleSave(alsoCreateGRN = false) {
    if (!supplier) return alert("Please enter supplier ID or select supplier");
    if (items.length === 0) return alert("Add items first");

    const payload = {
      supplier,
      expectedDate: expectedDate || null,
      notes,
      items: items.map((it) => ({
        product: it.productId || null,
        productName: it.name,
        qtyOrdered: it.qty,
        cost: it.cost,
      })),
    };

    setSaving(true);
    try {
      const res = await fetcher("/api/purchase-orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("PO created");
      if (alsoCreateGRN) {
        // optional: open GRN creation with PO id param (front-end only)
        window.location.href = `/purchases/receive-grn?po=${res._id}`;
      } else {
        window.location.href = "/purchases/po/list";
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save purchase order");
    } finally {
      setSaving(false);
    }
  }

  // smart input handlers: Enter adds; paste (barcode scanners often send paste events)
  function onSmartKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = smartValue.trim();
      if (v) handleAddSmart(v);
    }
  }

  async function onSmartPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    // scanners often paste barcode; handle immediate add
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;
    // small heuristic: if pasted contains newline => bulk paste -> open bulk import
    if (pasted.includes("\n")) {
      setBulkText(pasted);
      setBulkOpen(true);
      e.preventDefault();
      return;
    }
    // otherwise treat as single barcode
    e.preventDefault();
    setSmartValue(pasted);
    await handleAddSmart(pasted);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / center: fast input + table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Quick Purchase Entry</h2>
            <div className="text-sm text-gray-500">
              Mode: Hybrid Fast Entry — Ctrl/⌘ + I to bulk import
            </div>
          </div>

          {/* Top: Supplier + Smart input */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                placeholder="Supplier ID or name"
                className="p-3 border rounded-lg"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
              <input
                type="date"
                className="p-3 border rounded-lg"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBulkOpen(true);
                  }}
                  className="px-3 py-2 bg-amber-500 text-white rounded-lg"
                >
                  Bulk Import (Ctrl+I)
                </button>
                <button
                  onClick={() => {
                    setItems([]);
                    setSupplier("");
                    setNotes("");
                  }}
                  className="px-3 py-2 border rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-1">
                Scan barcode or type product name / SKU and press Enter
              </div>
              <div className="flex gap-3">
                <ProductSearchBox
                  onSelect={(product) =>
                    handleAddSmart(
                      product.sku || product.barcode || product.name
                    )
                  }
                />

                <button
                  onClick={() => handleAddSmart(smartValue)}
                  disabled={loadingAdd}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  {loadingAdd ? "Adding…" : "Add"}
                </button>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-medium">Items ({items.length})</div>
              <div className="text-xs text-gray-500">
                Click Qty/Cost to edit inline. Use keyboard for speed.
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Product</th>
                    <th>SKU</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Cost</th>
                    <th className="text-right">Line</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{it.name}</td>
                      <td className="text-xs text-gray-500">{it.sku}</td>
                      <td className="text-right">
                        <input
                          type="number"
                          value={it.qty}
                          onChange={(e) =>
                            updateRow(it.id, {
                              qty: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-20 p-1 border rounded text-right"
                        />
                      </td>
                      <td className="text-right">
                        <input
                          type="number"
                          value={it.cost}
                          onChange={(e) =>
                            updateRow(it.id, {
                              cost: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-28 p-1 border rounded text-right"
                        />
                      </td>
                      <td className="text-right font-medium">
                        ₹{(it.qty * it.cost).toLocaleString()}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => removeRow(it.id)}
                          className="text-red-500 px-2"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        No items yet — scan or type to add
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <label className="text-sm text-gray-600">
              Notes / Instructions
            </label>
            <textarea
              rows={3}
              className="w-full mt-2 p-2 border rounded"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right column: summary + actions */}
        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-500">Summary</div>
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
                onClick={() => handleSave(false)}
                disabled={saving}
                className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg"
              >
                {saving ? "Saving…" : "Save PO"}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full px-4 py-3 border rounded-lg text-amber-600"
              >
                Save & Create GRN
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Tip: use a barcode scanner or mobile camera to add items quickly.
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-sm border">
            <div className="text-sm font-medium mb-2">Quick shortcuts</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Enter → Add product</li>
              <li>Ctrl / ⌘ + I → Bulk import</li>
              <li>Click cost/qty → edit</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Bulk import modal (simple) */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">Bulk Import Items</div>
              <button
                onClick={() => setBulkOpen(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Paste lines in format: <code>sku,qty,cost</code> OR{" "}
              <code>sku qty cost</code>. Example: <code>SKU123,5,120</code>
            </div>
            <textarea
              rows={8}
              className="w-full p-2 border rounded"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleBulkPaste}
                className="px-3 py-2 bg-amber-600 text-white rounded"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setBulkText("");
                  focusSmart();
                }}
                className="px-3 py-2 border rounded"
              >
                Clear & Focus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
