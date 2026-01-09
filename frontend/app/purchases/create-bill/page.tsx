"use client";

import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import {
  Search,
  Trash2,
  Save,
  ArrowLeft,
  Users,
  FileText,
  CreditCard,
  ShoppingBag,
  Percent,
  Calculator,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CreateBill() {
  const [supplier, setSupplier] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [grn, setGrn] = useState("");
  const [grnList, setGrnList] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadSuppliers();
    loadGRNs();
  }, []);

  async function loadSuppliers() {
    try {
      const res = await fetcher("/api/suppliers");
      setSupplierList(res);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadGRNs() {
    try {
      const res = await fetcher("/api/grn");
      setGrnList(res);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (productSearch.length > 1) searchProducts();
    else setProductResults([]);
  }, [productSearch]);

  async function searchProducts() {
    try {
      const res = await fetcher(`/api/products/search?q=${productSearch}`);
      setProductResults(res.items || []);
    } catch (e) {
      console.error(e);
    }
  }

  const addProduct = (p: any) => {
    setItems([
      ...items,
      {
        id: Date.now(),
        product: p._id,
        productName: p.name,
        quantity: 1,
        rate: p.costPrice || 0,
        tax: 0,
        batchNo: "",
      },
    ]);
    setProductSearch("");
  };

  const updateItem = (idx: number, patch: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], ...patch };
    setItems(updated);
  };

  const subtotal = items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const totalTax = items.reduce(
    (s, it) => s + (it.tax / 100) * it.quantity * it.rate,
    0
  );
  const totalAmount = subtotal + totalTax;
  const dueAmount = totalAmount - paidAmount;

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20">
      {/* 1. ENTERPRISE HEADER */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/purchases/list"
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              New Purchase Bill
            </h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[2px]">
              Financial Procurement Entry
            </p>
          </div>
        </div>
        <button
          onClick={() => {}} // saveBill logic
          className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all font-bold text-sm"
        >
          <Save size={18} /> Validate & Post Bill
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: MAIN FORM */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. CONTEXT CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} /> Supplier Account
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
              >
                <option value="">Select Vendor...</option>
                {supplierList.map((s: any) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Linked Documents (GRN)
              </label>
              <select
                value={grn}
                onChange={(e) => setGrn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="">Direct Billing (No GRN)</option>
                {grnList.map((g: any) => (
                  <option key={g._id} value={g._id}>
                    {g.grnNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* B. SEARCH & TABLE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 relative">
              <Search
                className="absolute left-7 top-7 text-gray-400"
                size={18}
              />
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
                placeholder="Search items to add to bill..."
              />
              {productResults.length > 0 && (
                <div className="absolute left-4 right-4 top-[70px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {productResults.map((p: any) => (
                    <div
                      key={p._id}
                      onClick={() => addProduct(p)}
                      className="p-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b last:border-0 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          SKU: {p.sku}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        ₹{p.costPrice}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <table className="w-full text-left">
              <thead className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Item Description</th>
                  <th className="px-4 py-4 text-center w-24">Qty</th>
                  <th className="px-4 py-4 text-right w-32">Rate</th>
                  <th className="px-4 py-4 text-center w-24">Tax %</th>
                  <th className="px-6 py-4 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <ShoppingBag
                        size={40}
                        className="mx-auto text-gray-200 mb-2"
                      />
                      <p className="text-xs font-bold text-gray-400 uppercase">
                        No items added to bill yet
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => (
                    <tr
                      key={it.id}
                      className="hover:bg-gray-50/50 group transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-sm">
                          {it.productName}
                        </p>
                        <input
                          placeholder="Batch No..."
                          value={it.batchNo}
                          onChange={(e) =>
                            updateItem(idx, { batchNo: e.target.value })
                          }
                          className="text-[10px] font-mono text-indigo-600 bg-transparent border-none p-0 focus:ring-0 w-full"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) =>
                            updateItem(idx, {
                              quantity: Number(e.target.value),
                            })
                          }
                          className="w-full text-center py-1 bg-gray-50 border-gray-100 rounded text-sm font-bold"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={it.rate}
                          onChange={(e) =>
                            updateItem(idx, { rate: Number(e.target.value) })
                          }
                          className="w-full text-right py-1 bg-gray-50 border-gray-100 rounded text-sm font-bold"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={it.tax}
                          onChange={(e) =>
                            updateItem(idx, { tax: Number(e.target.value) })
                          }
                          className="w-full text-center py-1 bg-gray-50 border-gray-100 rounded text-sm font-bold"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 font-black text-gray-900 text-sm">
                          ₹
                          {(
                            it.quantity *
                            it.rate *
                            (1 + it.tax / 100)
                          ).toLocaleString()}
                          <button
                            onClick={() => {
                              const c = [...items];
                              c.splice(idx, 1);
                              setItems(c);
                            }}
                            className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: BILLING SUMMARY */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calculator size={14} /> Settlement Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Paid In Advance
                </label>
                <div className="relative">
                  <CreditCard
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 rounded-xl text-lg font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-900 rounded-2xl text-white space-y-3 shadow-xl">
                <div className="flex justify-between text-xs opacity-60">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs opacity-60">
                  <span>Tax Calculation</span>
                  <span>₹{totalTax.toLocaleString()}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase opacity-60">
                    Net Bill Amount
                  </span>
                  <span className="text-2xl font-black text-indigo-300">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs font-bold text-rose-300">
                  <span>Balance Due</span>
                  <span>₹{dueAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-[10px] font-bold uppercase">
                <AlertCircle size={16} />
                <span>Unpaid balance will be added to vendor ledger</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                <CheckCircle size={16} />
                <span>Inventory will auto-link if GRN is selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
