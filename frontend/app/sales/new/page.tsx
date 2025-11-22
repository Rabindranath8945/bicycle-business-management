// app/(sales)/new/page.tsx
// PART A of 3 — Header, imports, types, top-level state, ProductDrawer + Scan Mode, Analytics bar, Ripple import
// Paste Part B then Part C in order to complete the file.

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Receipt,
  CreditCard,
  User,
  Phone,
  Search as SearchIcon,
  Plus,
  Minus,
  X,
  FileText,
  Download,
} from "lucide-react";

// local components (must exist in /components)
import ProductDrawer from "@/components/ProductDrawer";
import PaymentDrawer from "@/components/PaymentDrawer";
import Ripple from "@/components/Ripple";

// -------------------------
// Types
// -------------------------
type Product = {
  _id: string;
  name: string;
  salePrice: number;
  costPrice?: number;
  taxPercent?: number;
  stock?: number;
  categoryName?: string;
  hsn?: string;
  photo?: string | null;
  sku?: string;
};

type CartItem = {
  _id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  costPrice?: number;
  stock?: number;
};

// -------------------------
// Component (start)
// -------------------------
export default function NewSalePage() {
  // ----- UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // ----- cart & customer
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState<
    "Cash" | "UPI" | "Card" | "Other"
  >("Cash");
  const [discount, setDiscount] = useState<number>(0);

  // ----- analytics / summary (top bar)
  const [analytics, setAnalytics] = useState({
    todaySales: 0,
    monthSales: 0,
    avgOrder: 0,
    itemsSold: 0,
  });

  // ----- suggestions & last-items
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // ----- scan mode buffer
  const [scanBuffer, setScanBuffer] = useState("");
  const scanTimeout = useRef<number | null>(null);

  // ----- UI refs
  const searchRef = useRef<HTMLInputElement | null>(null);

  // ----- fly-to-cart animation state
  const [flyAnim, setFlyAnim] = useState<{ x: number; y: number } | null>(null);

  // ----- pagination / sales history (used later in part B/C)
  const [page, setPage] = useState(1);

  // -------------------------
  // Helper: fetch analytics (top summary)
  // -------------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/api/analytics/summary");
        if (!mounted) return;
        const d = res.data || {};
        setAnalytics({
          todaySales: d.todaySales ?? 0,
          monthSales: d.monthSales ?? 0,
          avgOrder: d.avgOrder ?? 0,
          itemsSold: d.itemsSold ?? 0,
        });
      } catch (err) {
        // silently ignore; analytics optional
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------
  // Offline detection
  // -------------------------
  useEffect(() => {
    const onOffline = () => setOfflineMode(true);
    const onOnline = () => setOfflineMode(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    setOfflineMode(!navigator.onLine);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  // -------------------------
  // Suggestions: last purchased items by phone
  // -------------------------
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!phone) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(
          `/api/customers/last-items/${encodeURIComponent(phone)}`
        );
        setSuggestions(res.data || []);
      } catch (err) {
        // ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [phone]);

  // -------------------------
  // Scan Mode: keyboard listener (barcode scanners emulate keyboard)
  // - When scanMode=true, we capture fast keystrokes globally.
  // - This listener will call backend /api/products/barcode/:code to fetch product.
  // -------------------------
  useEffect(() => {
    if (!scanMode) return;

    const handler = (e: KeyboardEvent) => {
      // ignore modifier-only keys
      if (
        e.key === "Shift" ||
        e.key === "Alt" ||
        e.key === "Control" ||
        e.key === "Meta"
      )
        return;

      // accumulate buffer
      setScanBuffer((prev) => prev + e.key);

      if (scanTimeout.current) {
        window.clearTimeout(scanTimeout.current);
      }

      scanTimeout.current = window.setTimeout(async () => {
        const code = scanBuffer.trim();
        setScanBuffer("");
        if (!code || code.length < 4) {
          // ignore short manual typing
          return;
        }
        try {
          const res = await axios.get(
            `/api/products/barcode/${encodeURIComponent(code)}`
          );
          const product: Product = res.data;
          if (product) {
            // add product (function implemented in Part B)
            handleAddProduct(product);
            toast.success(`Added: ${product.name}`);
            // small fly animation trigger handled inside handleAddProduct if available
          } else {
            toast.error("Product not found");
          }
        } catch (err) {
          toast.error("Barcode not matched");
        }
      }, 120);
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (scanTimeout.current) {
        window.clearTimeout(scanTimeout.current);
      }
      setScanBuffer("");
    };
    // intentionally depend on scanMode and scanBuffer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanMode, scanBuffer]);

  // -------------------------
  // Keyboard shortcuts (F1-F4, Ctrl+P)
  // -------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setDrawerOpen(true);
      }
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "F3") {
        e.preventDefault();
        setPaymentOpen(true);
      }
      if (e.key === "F4") {
        e.preventDefault();
        setScanMode((s) => !s);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPaymentOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // -------------------------
  // Fly-to-cart helper (will be used when adding product from drawer)
  // call startFlyAnimation({left, top})
  // -------------------------
  const startFlyAnimation = (pos: { x: number; y: number }) => {
    setFlyAnim({ x: pos.x, y: pos.y });
    window.setTimeout(() => setFlyAnim(null), 700);
  };

  // -----------------------------------------------------------
  // REAL IMPLEMENTATION OF FUNCTIONS (Replace placeholders)
  // -----------------------------------------------------------

  // Add item to cart
  function handleAddProduct(p: Product) {
    setDrawerOpen(false);

    setCart((prev) => {
      const found = prev.find((i) => i._id === p._id);
      if (found) {
        // increase qty
        return prev.map((i) =>
          i._id === p._id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      // add new
      return [
        ...prev,
        {
          _id: p._id,
          name: p.name,
          qty: 1,
          price: p.salePrice,
          tax: p.taxPercent ?? 0,
          costPrice: p.costPrice ?? 0,
        },
      ];
    });
  }

  // Update quantity
  function updateQty(id: string, qty: number) {
    if (qty <= 0) return removeItem(id);

    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, qty } : i)));
  }

  // Remove an item
  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }

  // SAVE & PRINT FUNCTION
  async function saveAndPrint(payment: any) {
    try {
      const payload = {
        customerName,
        phone,
        discount,
        paymentMode: payment?.method || "Cash",
        paymentDetails: payment || null,
        items: cart.map((c) => ({
          productId: c._id,
          qty: c.qty,
        })),
      };

      // save sale
      const res = await axios.post("/api/sales", payload);

      const saleId = res.data?._id;

      toast.success("Sale saved!");

      // open PDF invoice
      window.open(`/api/sales/${saleId}/invoice`, "_blank");

      setCart([]);
      setPaymentOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Save failed");
    }
  }

  // PAYMENT CONFIRM
  async function handlePaymentConfirm(p: any) {
    await saveAndPrint(p);
    toast.success("Payment Completed");
  }

  // -------------------------
  // totals & derived values (defined here so PaymentDrawer can read them in Part B/C)
  // -------------------------
  const totals = useMemo(() => {
    return cart.reduce(
      (acc, it) => {
        const line = it.price * it.qty;
        const tax = (line * (it.tax || 0)) / 100;
        acc.subtotal += line;
        acc.tax += tax;
        acc.total += line + tax;
        return acc;
      },
      { subtotal: 0, tax: 0, total: 0 }
    );
  }, [cart]);

  const grandTotal = useMemo(
    () => Math.max(0, totals.total - Number(discount || 0)),
    [totals, discount]
  );

  // GST split & cost/profit placeholders (costPrice may be undefined until backend provides it)
  const cgst = useMemo(() => totals.tax / 2, [totals]);
  const sgst = useMemo(() => totals.tax / 2, [totals]);
  const costEstimate = useMemo(() => {
    return cart.reduce(
      (acc, it) => acc + (Number(it.costPrice || 0) * it.qty || 0),
      0
    );
  }, [cart]);
  const profitEstimate = useMemo(
    () => grandTotal - costEstimate,
    [grandTotal, costEstimate]
  );

  // -------------------------
  // UI: Analytics bar + top-level scaffolding (part of layout)
  // This section renders the top analytics summary and the page container.
  // Part B will continue the layout (cart table, drawer button, suggestions).
  // -------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen p-6 text-slate-100"
    >
      {/* Product Drawer + Payment Drawer */}
      <ProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={(p: Product) => handleAddProduct(p)}
      />
      <PaymentDrawer
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={Number(grandTotal)}
        onConfirm={(pay: any) => handlePaymentConfirm(pay)}
      />

      {/* Fly anim ghost */}
      {flyAnim && (
        <motion.div
          initial={{ opacity: 1, scale: 1, x: flyAnim.x, y: flyAnim.y }}
          animate={{
            opacity: 0,
            scale: 0.35,
            x: flyAnim.x + 420,
            y: flyAnim.y - 220,
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="fixed w-10 h-10 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.6)] z-[1200]"
          style={{ left: flyAnim.x, top: flyAnim.y }}
        />
      )}

      {/* Analytics / Summary Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg">
            <p className="text-xs text-slate-400">Today Sales</p>
            <p className="text-xl font-bold text-emerald-400">
              ₹{Number(analytics.todaySales).toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg">
            <p className="text-xs text-slate-400">Monthly Sales</p>
            <p className="text-xl font-bold text-sky-400">
              ₹{Number(analytics.monthSales).toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg">
            <p className="text-xs text-slate-400">Avg Order</p>
            <p className="text-xl font-bold text-purple-400">
              ₹{Number(analytics.avgOrder).toFixed(0)}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg">
            <p className="text-xs text-slate-400">Items Sold</p>
            <p className="text-xl font-bold text-orange-400">
              {Number(analytics.itemsSold).toLocaleString()}
            </p>
          </div>
        </div>

        {/* offline indicator */}
        {offlineMode && (
          <div className="mb-4 p-2 bg-yellow-600 text-black rounded-lg text-sm">
            ⚠ Offline mode: sales will be cached and synced when online
          </div>
        )}
      </div>

      {/* Container for rest of layout (Part B will render left/right columns, cart table, totals etc.) */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        {/* left + right columns begin in Part B */}
        {/* ------------------------------------ */}
        {/* LEFT PANEL (Search, Suggestions, Cart Table) */}
        {/* ------------------------------------ */}
        <div
          className={`col-span-12 lg:col-span-8 bg-slate-900/80 backdrop-blur-lg p-6 rounded-2xl border transition-all duration-300 shadow-lg
            ${
              scanMode
                ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.45)]"
                : "border-slate-700 shadow-black/30"
            }
          `}
        >
          {/* HEADER AREA */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="text-emerald-400" />
              New Sale
            </h1>

            <div className="flex items-center gap-2">
              {/* SCAN MODE TOGGLE */}
              <button
                onClick={() => setScanMode((s) => !s)}
                className={`px-3 py-2 rounded-lg text-sm border 
                  ${
                    scanMode
                      ? "bg-emerald-600 border-emerald-400 text-black font-semibold"
                      : "bg-slate-800 border-slate-700 text-slate-200"
                  }
                `}
              >
                {scanMode ? "Scan Mode ON" : "Scan Mode"}
              </button>

              {/* OPEN PRODUCT DRAWER */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 flex items-center gap-2 hover:bg-slate-700"
              >
                <SearchIcon size={16} />
                Add Item
              </button>
            </div>
          </div>

          {/* CUSTOMER SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-slate-300 flex items-center gap-1">
                <User size={14} /> Customer Name
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none mt-1"
                placeholder="Walk-in Customer"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 flex items-center gap-1">
                <Phone size={14} /> Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none mt-1"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* LAST PURCHASED SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 mb-4">
              <p className="text-sm text-slate-400 mb-2">
                Last Purchased Items
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => handleAddProduct(s)}
                    className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs transition"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CART TABLE */}
          <div className="overflow-auto rounded-xl border border-slate-700 bg-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-700 text-slate-300">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Tax</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2"></th>
                </tr>
              </thead>

              <tbody>
                {cart.map((it) => (
                  <motion.tr
                    key={it._id}
                    initial={{ backgroundColor: "rgba(16,185,129,0.08)" }}
                    animate={{ backgroundColor: "transparent" }}
                    transition={{ duration: 0.8 }}
                    className="border-t border-slate-700"
                  >
                    <td className="p-3">{it.name}</td>

                    {/* QTY + / - buttons */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.75 }}
                          onClick={() => updateQty(it._id, it.qty - 1)}
                          className="p-1 bg-slate-700 border border-slate-600 rounded"
                        >
                          <Minus size={14} />
                        </motion.button>

                        <span>{it.qty}</span>

                        <motion.button
                          whileTap={{ scale: 0.75 }}
                          onClick={() => updateQty(it._id, it.qty + 1)}
                          className="p-1 bg-slate-700 border border-slate-600 rounded"
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                    </td>

                    <td className="p-3">₹{it.price}</td>
                    <td className="p-3">{it.tax}%</td>

                    <td className="p-3 text-right">
                      ₹
                      {(
                        it.price * it.qty +
                        (it.price * it.qty * it.tax) / 100
                      ).toFixed(2)}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeItem(it._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}

                {cart.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-slate-500">
                      Cart is empty — click **Add Item** or use **Scan Mode**
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------ */}
        {/* RIGHT PANEL BEGINS IN PART C */}
        {/* ------------------------------------ */}
        {/* ------------------------------------------------ */}
        {/* RIGHT PANEL (Totals, Discount, Insights, Pay Btn) */}
        {/* ------------------------------------------------ */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-xl">
            {/* TOTAL SECTION */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-emerald-400" />
              Bill Summary
            </h2>

            {/* SUBTOTAL */}
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>

            {/* TAX */}
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-slate-400">CGST</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3 text-sm">
              <span className="text-slate-400">SGST</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>

            {/* DISCOUNT */}
            <div className="mb-4">
              <label className="text-sm text-slate-300">Discount</label>
              <input
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value || 0))}
                type="number"
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
                placeholder="0"
              />
            </div>

            {/* GRAND TOTAL */}
            <div className="flex justify-between mb-6">
              <span className="text-lg font-medium">Grand Total</span>
              <span className="text-2xl font-bold text-emerald-400">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            {/* SMART INSIGHTS */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 mb-5">
              <p className="text-sm text-slate-400 mb-2">Insights</p>

              {/* Profit */}
              <div className="flex justify-between text-sm mb-1">
                <span>Estimated Profit</span>
                <span className="text-emerald-400">
                  ₹{profitEstimate.toFixed(2)}
                </span>
              </div>

              {profitEstimate < 50 && (
                <p className="text-xs text-red-400">⚠ Low profit margin</p>
              )}

              {/* Stock alerts */}
              {cart.some((i) => (i?.stock ?? 99) <= 3) && (
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠ Some items are low on stock
                </p>
              )}
            </div>

            {/* PAYMENT BUTTON */}
            <Ripple
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg text-black font-semibold 
              hover:shadow-[0_0_20px_rgba(16,185,129,0.7)] transition mb-3 flex items-center justify-center gap-2"
              onClick={() => {
                if (cart.length === 0) return toast.error("Cart is empty");
                setPaymentOpen(true);
              }}
            >
              <CreditCard size={18} />
              Pay ₹{grandTotal.toFixed(2)}
            </Ripple>

            {/* CLEAR CART */}
            <button
              onClick={() => setCart([])}
              className="w-full py-2 mt-2 text-slate-300 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
