"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Printer, Save } from "lucide-react";

type SaleItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  gst: number;
};

export default function WholesaleSalePage() {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  // ---------------- calculations ----------------
  const subTotal = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.price, 0),
    [items]
  );

  const gstTotal = useMemo(
    () => items.reduce((s, i) => s + (i.qty * i.price * i.gst) / 100, 0),
    [items]
  );

  const grandTotal = subTotal + gstTotal;

  // ---------------- handlers ----------------
  const addMockProduct = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Wholesale Tyre",
        qty: 1,
        price: 240,
        gst: 5,
      },
    ]);
  };

  const updateQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ------------------------------------------------

  return (
    <div className="p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center border-b pb-2">
        <h1 className="text-xl font-semibold text-blue-600">
          Wholesale Invoice
        </h1>

        <div className="text-sm text-muted-foreground">
          Invoice No: <b>WH-0001</b>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="Customer Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone Number"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT: Product Table */}
        <div className="col-span-8 border rounded-lg p-3">
          <div className="flex justify-between mb-2">
            <h2 className="font-medium">Products</h2>
            <button
              onClick={addMockProduct}
              className="btn-primary flex items-center gap-1"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th>Item</th>
                <th className="w-24">Qty</th>
                <th>Price</th>
                <th>GST%</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td>{item.name}</td>

                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id, Number(e.target.value))
                      }
                      className="w-16 input"
                    />
                  </td>

                  <td>₹{item.price}</td>
                  <td>{item.gst}%</td>

                  <td>₹{(item.qty * item.price).toFixed(2)}</td>

                  <td>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No products added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Summary */}
        <div className="col-span-4 border rounded-lg p-4 space-y-3 sticky top-20">
          <h2 className="font-medium">Bill Summary</h2>

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>GST</span>
            <span>₹{gstTotal.toFixed(2)}</span>
          </div>

          <hr />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="btn-outline flex-1 flex items-center justify-center gap-1">
              <Save size={16} /> Save
            </button>
            <button className="btn-primary flex-1 flex items-center justify-center gap-1">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
