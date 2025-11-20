"use client";

import React, { useState, useEffect } from "react";

// -------------------------------
// Types
// -------------------------------
interface Product {
  _id: string;
  name: string;
  salePrice: number;
  taxPercent?: number;
}

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
}

// -------------------------------
// Component
// -------------------------------
export default function NewSalePage() {
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const [productResults, setProductResults] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [discount, setDiscount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("Cash");

  // -------------------------------
  // Search Products
  // -------------------------------
  const searchProducts = async (q: string) => {
    if (!q) {
      setProductResults([]);
      return;
    }

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${base}/api/products/search?q=${q}`);
      const data: Product[] = await res.json();
      setProductResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      searchProducts(query);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // -------------------------------
  // Add to Cart
  // -------------------------------
  const addToCart = (product: Product) => {
    const exists = cart.find((c) => c.productId === product._id);

    if (exists) {
      setCart(
        cart.map((c) =>
          c.productId === product._id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      const newItem: CartItem = {
        productId: product._id,
        name: product.name,
        qty: 1,
        price: product.salePrice,
        tax: product.taxPercent || 0,
      };
      setCart([...cart, newItem]);
    }

    setQuery("");
    setProductResults([]);
  };

  const updateQty = (id: string, qty: number) => {
    setCart(
      cart.map((item) => (item.productId === id ? { ...item, qty } : item))
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  // -------------------------------
  // Totals
  // -------------------------------
  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;

    cart.forEach((item) => {
      const line = item.price * item.qty;
      const taxAmt = (line * item.tax) / 100;

      subtotal += line;
      taxTotal += taxAmt;
    });

    return {
      subtotal,
      tax: taxTotal,
      grandTotal: subtotal + taxTotal - discount,
    };
  };

  const totals = calculateTotals();

  // -------------------------------
  // Base64 → Blob
  // -------------------------------
  const b64toBlob = (b64: string) => {
    const byteChars = atob(b64);
    const byteNums = new Array(byteChars.length);

    for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNums)], { type: "application/pdf" });
  };

  // -------------------------------
  // Save + Print
  // -------------------------------
  const saveAndPrint = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      const payload = {
        customerName,
        phone,
        discount,
        paymentMode,
        items: cart.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
      };

      const res = await fetch(`${base}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const blob = b64toBlob(data.pdfBase64);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      alert("Sale Completed & Printing Started!");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">New Sale</h1>

      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <input
          className="border p-2"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="border p-2"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
          <option>Other</option>
        </select>
      </div>

      {/* Search */}
      <input
        className="border p-2 w-full"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Results */}
      {productResults.length > 0 && (
        <ul className="border mt-2 bg-white max-h-60 overflow-auto">
          {productResults.map((p) => (
            <li
              key={p._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              onClick={() => addToCart(p)}
            >
              <span>{p.name}</span>
              <span>₹{p.salePrice}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Cart */}
      <table className="w-full text-sm mt-4">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Tax</th>
            <th className="p-2">Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => (
            <tr key={item.productId} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">
                <input
                  type="number"
                  className="border p-1 w-16"
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.productId, Number(e.target.value))
                  }
                />
              </td>
              <td className="p-2">₹{item.price}</td>
              <td className="p-2">{item.tax}%</td>
              <td className="p-2">
                ₹
                {(
                  item.price * item.qty +
                  (item.price * item.qty * item.tax) / 100
                ).toFixed(2)}
              </td>
              <td>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-between mt-4">
        <div>
          <label>Discount: </label>
          <input
            type="number"
            className="border p-2 ml-2"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        <div className="text-right">
          <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
          <p>Tax: ₹{totals.tax.toFixed(2)}</p>
          <p className="font-bold">
            Grand Total: ₹{totals.grandTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={saveAndPrint}
        className="mt-5 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save + Print
      </button>
    </div>
  );
}
