"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  Save,
  ArrowLeft,
  Package,
  Truck,
  ReceiptIndianRupee,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Supplier = { _id: string; name: string };
type Purchase = { _id: string; billNo: string; supplier: Supplier };
type Product = { _id: string; name: string; rate: number };

export default function CreatePurchaseReturn() {
  const router = useRouter();
  const [supplier, setSupplier] = useState("");
  const [purchase, setPurchase] = useState("");
  const [items, setItems] = useState([
    { product: "", qty: 1, rate: 0, tax: 0 },
  ]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const totalTax = items.reduce(
    (s, it) => s + (it.qty * it.rate * it.tax) / 100,
    0
  );
  const totalAmount = subtotal + totalTax;

  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  useEffect(() => {
    if (!supplier) return;
    loadPurchases();
  }, [supplier]);

  async function loadSuppliers() {
    const res = await fetcher("/api/suppliers");
    setSuppliers(Array.isArray(res) ? res : []);
  }

  async function loadProducts() {
    const res = await fetcher("/api/products");
    setProducts(Array.isArray(res) ? res : []);
  }

  async function loadPurchases() {
    const res = await fetcher(`/api/purchases?supplier=${supplier}`);
    setPurchases(Array.isArray(res) ? res : []);
  }

  const updateItem = (i: number, field: string, value: any) => {
    const rows = [...items];
    (rows[i] as any)[field] = value;
    if (field === "product") {
      const p = products.find((x) => x._id === value);
      if (p) rows[i].rate = p.rate || 0;
    }
    setItems(rows);
  };

  const addItemRow = () =>
    setItems([...items, { product: "", qty: 1, rate: 0, tax: 0 }]);
  const removeItem = (i: number) =>
    items.length > 1 && setItems(items.filter((_, idx) => idx !== i));

  async function saveReturn() {
    if (!supplier) return alert("Please select a supplier");
    if (items.some((it) => !it.product))
      return alert("One or more items have no product selected");

    try {
      await fetcher("/api/purchase-returns", {
        method: "POST",
        body: JSON.stringify({ supplier, purchase: purchase || null, items }),
      });
      router.push("/purchases/returns");
    } catch (err) {
      alert("Failed to create return");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Returns
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create Purchase Return
            </h1>
            <p className="text-slate-500 text-sm">
              Process debit notes and return goods to suppliers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveReturn}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <Save size={18} /> Complete Return
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Package size={16} /> Return Line Items
                </span>
                <button
                  onClick={addItemRow}
                  className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <PlusCircle size={16} /> Add Row
                </button>
              </div>

              <div className="p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[11px] uppercase tracking-wider">
                      <th className="pb-3 pl-2 font-medium">Product Name</th>
                      <th className="pb-3 font-medium w-24">Qty</th>
                      <th className="pb-3 font-medium w-32">Rate (₹)</th>
                      <th className="pb-3 font-medium w-24">Tax %</th>
                      <th className="pb-3 text-right pr-2 font-medium">
                        Total
                      </th>
                      <th className="pb-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence initial={false}>
                      {items.map((row, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="group"
                        >
                          <td className="py-3 pr-2">
                            <select
                              value={row.product}
                              onChange={(e) =>
                                updateItem(i, "product", e.target.value)
                              }
                              className="w-full bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 py-2"
                            >
                              <option value="">Search Product...</option>
                              {products.map((p) => (
                                <option key={p._id} value={p._id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 pr-2">
                            <input
                              type="number"
                              className="w-full bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 py-2"
                              value={row.qty}
                              onChange={(e) =>
                                updateItem(i, "qty", Number(e.target.value))
                              }
                            />
                          </td>
                          <td className="py-3 pr-2">
                            <input
                              type="number"
                              className="w-full bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 py-2"
                              value={row.rate}
                              onChange={(e) =>
                                updateItem(i, "rate", Number(e.target.value))
                              }
                            />
                          </td>
                          <td className="py-3 pr-2">
                            <input
                              type="number"
                              className="w-full bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 py-2"
                              value={row.tax}
                              onChange={(e) =>
                                updateItem(i, "tax", Number(e.target.value))
                              }
                            />
                          </td>
                          <td className="py-3 text-right pr-2 text-sm font-semibold text-slate-700">
                            ₹
                            {(row.qty * row.rate * (1 + row.tax / 100)).toFixed(
                              2
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => removeItem(i)}
                              className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT: Sidebar Info & Summary */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-2">
                Return Details
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Truck size={12} /> Supplier
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500"
                >
                  <option value="">Select Vendor</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <ShoppingBag size={12} /> Reference Bill
                </label>
                <select
                  value={purchase}
                  onChange={(e) => setPurchase(e.target.value)}
                  disabled={!supplier}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="">Direct Return (No Bill)</option>
                  {purchases.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.billNo}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Summary Card */}
            <section className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ReceiptIndianRupee size={80} />
              </div>
              <h3 className="text-indigo-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                Financial Summary
              </h3>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Total Tax</span>
                  <span>₹{totalTax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-800 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-300 font-medium">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-white">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
