"use client";

import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import { Search, PlusCircle, Trash2 } from "lucide-react";

export default function CreateBill() {
  const [supplier, setSupplier] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  const [grn, setGrn] = useState("");
  const [grnList, setGrnList] = useState([]);

  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);

  const [paidAmount, setPaidAmount] = useState(0);

  const [items, setItems] = useState<any[]>([]);

  /** LOAD SUPPLIERS & GRN LIST */
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

  /** SEARCH PRODUCTS */
  useEffect(() => {
    if (productSearch.length > 1) searchProducts();
  }, [productSearch]);

  async function searchProducts() {
    try {
      const res = await fetcher(`/api/products/search?q=${productSearch}`);
      setProductResults(res.items);
    } catch (e) {
      console.error(e);
    }
  }

  /** ADD PRODUCT TO BILL */
  function addProduct(p: any) {
    setItems([
      ...items,
      {
        product: p._id,
        productName: p.name,
        quantity: 1,
        rate: p.costPrice || 0,
        tax: 0,
        batchNo: "",
      },
    ]);
    setProductResults([]);
    setProductSearch("");
  }

  /** REMOVE ROW */
  function removeItem(idx: number) {
    const c = [...items];
    c.splice(idx, 1);
    setItems(c);
  }

  /** CALCULATIONS */
  const subtotal = items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const totalTax = items.reduce(
    (s, it) => s + (it.tax / 100) * it.quantity * it.rate,
    0
  );
  const totalAmount = subtotal + totalTax;
  const dueAmount = totalAmount - paidAmount;

  /** SAVE BILL */
  async function saveBill() {
    if (!supplier) return alert("Supplier required");
    if (items.length === 0) return alert("Add at least one item");

    await fetcher("/api/purchases", {
      method: "POST",
      body: JSON.stringify({
        supplier,
        grn: grn || null,
        items,
        paidAmount,
      }),
    });

    alert("Purchase Bill Created Successfully!");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-wide">
          Create Purchase Bill
        </h1>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 space-y-6">
        {/* Supplier + GRN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SUPPLIER DROPDOWN */}
          <div>
            <label className="text-sm font-medium">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="p-2 border rounded-lg mt-1 w-full"
            >
              <option value="">Select Supplier</option>
              {supplierList.map((s: any) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* GRN OPTIONAL */}
          <div>
            <label className="text-sm font-medium">GRN (optional)</label>
            <select
              value={grn}
              onChange={(e) => setGrn(e.target.value)}
              className="p-2 border rounded-lg mt-1 w-full"
            >
              <option value="">No GRN</option>
              {grnList.map((g: any) => (
                <option key={g._id} value={g._id}>
                  {g.grnNumber}
                </option>
              ))}
            </select>
          </div>

          {/* PAID AMOUNT */}
          <div>
            <label className="text-sm font-medium">Paid Amount</label>
            <input
              type="number"
              className="p-2 border rounded-lg mt-1 w-full"
              placeholder="0"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />
          </div>
        </div>

        {/* PRODUCT SEARCH BOX */}
        <div className="relative">
          <label className="text-sm font-medium">Search Product</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="pl-10 p-3 border rounded-lg w-full shadow-sm"
              placeholder="Enter product name / SKU / barcode"
            />
          </div>

          {/* SEARCH DROPDOWN */}
          {productResults.length > 0 && (
            <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border z-20 max-h-60 overflow-auto">
              {productResults.map((p: any) => (
                <div
                  key={p._id}
                  onClick={() => addProduct(p)}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  <strong>{p.name}</strong>
                  <div className="text-xs text-gray-500">
                    Cost: ₹{p.costPrice} | SKU: {p.sku}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ITEMS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Product</th>
                <th className="p-2 w-20">Qty</th>
                <th className="p-2 w-24">Rate</th>
                <th className="p-2 w-20">Tax %</th>
                <th className="p-2 w-28">Batch</th>
                <th className="p-2 w-10"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2 font-medium">{it.productName}</td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={it.quantity}
                      onChange={(e) => {
                        const c = [...items];
                        c[idx].quantity = Number(e.target.value);
                        setItems(c);
                      }}
                      className="p-1 border rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={it.rate}
                      onChange={(e) => {
                        const c = [...items];
                        c[idx].rate = Number(e.target.value);
                        setItems(c);
                      }}
                      className="p-1 border rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={it.tax}
                      onChange={(e) => {
                        const c = [...items];
                        c[idx].tax = Number(e.target.value);
                        setItems(c);
                      }}
                      className="p-1 border rounded w-full"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      value={it.batchNo}
                      onChange={(e) => {
                        const c = [...items];
                        c[idx].batchNo = e.target.value;
                        setItems(c);
                      }}
                      className="p-1 border rounded w-full"
                    />
                  </td>

                  <td className="p-2 text-right">
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD ROW BUTTON */}
        <button
          onClick={() =>
            setItems([
              ...items,
              { product: "", quantity: 1, rate: 0, tax: 0, batchNo: "" },
            ])
          }
          className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Blank Row
        </button>

        {/* SUMMARY */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner space-y-1 mt-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Tax</span>
            <span>₹{totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600 font-semibold">
            <span>Due Amount</span>
            <span>₹{dueAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveBill}
          className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg text-lg"
        >
          Save Purchase Bill
        </button>
      </div>
    </div>
  );
}
