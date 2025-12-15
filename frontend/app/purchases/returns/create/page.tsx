"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, Save } from "lucide-react";

/* ================================
   TYPES
================================ */
type Supplier = { _id: string; name: string };
type Purchase = { _id: string; billNo: string; supplier: Supplier };
type Product = { _id: string; name: string; rate: number };

export default function CreatePurchaseReturn() {
  // Form states
  const [supplier, setSupplier] = useState("");
  const [purchase, setPurchase] = useState("");

  const [items, setItems] = useState([
    { product: "", qty: 1, rate: 0, tax: 0 },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const totalAmount = items.reduce(
    (s, it) => s + it.qty * it.rate + (it.qty * it.rate * it.tax) / 100,
    0
  );

  /* ================================
     LOAD ALL DROPDOWN DATA
  ================================= */
  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  async function loadSuppliers() {
    const res = await fetcher("/api/suppliers");
    setSuppliers(Array.isArray(res) ? res : []);
  }

  async function loadProducts() {
    const res = await fetcher("/api/products");
    setProducts(Array.isArray(res) ? res : []);
  }

  // Load only purchases of selected supplier
  useEffect(() => {
    if (!supplier) return;
    loadPurchases();
  }, [supplier]);

  async function loadPurchases() {
    const res = await fetcher(`/api/purchases?supplier=${supplier}`);
    setPurchases(Array.isArray(res) ? res : []);
  }

  /* ================================
     ADD / REMOVE ITEM ROWS
  ================================= */
  const updateItem = (i: number, field: string, value: any) => {
    const rows = [...items];
    (rows[i] as any)[field] = value;

    // Auto-fill rate when product is selected
    if (field === "product") {
      const p = products.find((x) => x._id === value);
      if (p) rows[i].rate = p.rate || 0;
    }
    setItems(rows);
  };

  const addItemRow = () => {
    setItems([...items, { product: "", qty: 1, rate: 0, tax: 0 }]);
  };

  const removeItem = (i: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== i));
  };

  /* ================================
     SAVE PURCHASE RETURN
  ================================= */
  async function saveReturn() {
    if (!supplier) return alert("Select supplier");
    if (items.some((it) => !it.product)) return alert("Product missing");

    await fetcher("/api/purchase-returns", {
      method: "POST",
      body: JSON.stringify({
        supplier,
        purchase: purchase || null,
        items,
      }),
    });

    alert("Purchase Return Created Successfully!");
    window.location.href = "/purchases/returns";
  }

  /* ================================
     UI FORM
  ================================= */
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40"
      >
        <h1 className="text-2xl font-semibold mb-6">Create Purchase Return</h1>

        {/* TOP ROWS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Supplier */}
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="p-3 rounded-xl border bg-white"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Purchase Bill (Optional) */}
          <select
            value={purchase}
            onChange={(e) => setPurchase(e.target.value)}
            className="p-3 rounded-xl border bg-white"
          >
            <option value="">Select Purchase Bill (optional)</option>
            {purchases.map((p) => (
              <option key={p._id} value={p._id}>
                {p.billNo}
              </option>
            ))}
          </select>

          {/* Total */}
          <div className="p-3 rounded-xl border bg-white font-semibold text-lg flex items-center">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        {/* ITEM ROWS */}
        {items.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white/70 p-4 rounded-xl border shadow mb-3"
          >
            {/* Product */}
            <select
              value={row.product}
              onChange={(e) => updateItem(i, "product", e.target.value)}
              className="p-2 rounded-lg border bg-white"
            >
              <option value="">Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Qty"
              className="p-2 rounded-lg border"
              value={row.qty}
              onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
            />

            <input
              type="number"
              placeholder="Rate"
              className="p-2 rounded-lg border"
              value={row.rate}
              onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
            />

            <input
              type="number"
              placeholder="Tax %"
              className="p-2 rounded-lg border"
              value={row.tax}
              onChange={(e) => updateItem(i, "tax", Number(e.target.value))}
            />

            {/* Remove row */}
            <button
              onClick={() => removeItem(i)}
              className="text-red-500 hover:text-red-700 flex justify-center items-center"
            >
              <Trash2 size={20} />
            </button>
          </motion.div>
        ))}

        {/* ADD ITEM BUTTON */}
        <button
          onClick={addItemRow}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl flex items-center gap-2 hover:bg-purple-700 mb-6"
        >
          <PlusCircle size={18} /> Add Item
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={saveReturn}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg text-lg font-semibold flex justify-center gap-2"
        >
          <Save size={20} /> Submit Return
        </button>
      </motion.div>
    </div>
  );
}
