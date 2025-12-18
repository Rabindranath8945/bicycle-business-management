"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Receipt, WifiOff, CreditCard, Phone, User } from "lucide-react";

import CategoryStrip from "@/components/CategoryStrip";
import ProductGrid from "@/components/ProductGrid";
import PaymentDrawer from "@/components/PaymentDrawer";
import { usePOSKeyboard } from "@/lib/hooks/usePOSKeyboard";

/* ================= TYPES ================= */

type Category = {
  _id: string;
  name: string;
  count?: number;
};

type Product = {
  _id: string;
  name: string;
  salePrice: number;
  taxPercent?: number;
  stock?: number;
  category?: string;
};

type CartItem = {
  _id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  stock?: number;
};

/* ================= PAGE ================= */

export default function RetailPOSPage() {
  /* ---------- UI ---------- */
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  /* ---------- customer (mobile = identity) ---------- */
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerDue, setCustomerDue] = useState(0);

  /* ---------- category & products ---------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  /* ---------- cart ---------- */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [fitting, setFitting] = useState(0);

  const searchRef = useRef<HTMLInputElement | null>(null);

  /* ================= OFFLINE ================= */
  useEffect(() => {
    const off = () => setOffline(true);
    const on = () => setOffline(false);
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
    };
  }, []);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    axios
      .get("/api/products", {
        params: {
          category: activeCategory || undefined,
        },
      })
      .then((res) => setProducts(res.data || []));
  }, [activeCategory]);

  /* ================= CUSTOMER BY MOBILE ================= */
  useEffect(() => {
    if (phone.length < 10) {
      setCustomerName("");
      setCustomerDue(0);
      return;
    }

    axios
      .get(`/api/customers/by-phone/${phone}`)
      .then((res) => {
        if (res.data) {
          setCustomerName(res.data.name || "");
          setCustomerDue(res.data.balance || 0);
        }
      })
      .catch(() => {
        setCustomerName("");
        setCustomerDue(0);
      });
  }, [phone]);

  /* ================= KEYBOARD SHORTCUTS ================= */
  usePOSKeyboard({
    onSearch: () => searchRef.current?.focus(),
    onPay: () => cart.length && setPaymentOpen(true),
    onEscape: () => setActiveCategory(null),
  });

  /* ================= CART OPS ================= */

  function addItem(p: Product) {
    setCart((prev) => {
      const found = prev.find((i) => i._id === p._id);
      if (found) {
        return prev.map((i) =>
          i._id === p._id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [
        ...prev,
        {
          _id: p._id,
          name: p.name,
          qty: 1,
          price: p.salePrice,
          tax: p.taxPercent ?? 5,
          stock: p.stock,
        },
      ];
    });
  }

  function incQty(id: string) {
    setCart((p) => p.map((i) => (i._id === id ? { ...i, qty: i.qty + 1 } : i)));
  }

  function decQty(id: string) {
    setCart((p) =>
      p
        .map((i) => (i._id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }

  /* ================= TOTALS ================= */

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );

  const gst = useMemo(
    () => cart.reduce((s, i) => s + (i.price * i.qty * i.tax) / 100, 0),
    [cart]
  );

  const fittingGST = (fitting * 18) / 100;

  const rawTotal = subtotal + gst + fitting + fittingGST - discount;
  const roundedTotal = Math.round(rawTotal);
  const roundOff = roundedTotal - rawTotal;

  /* ================= SAVE ================= */

  async function saveAndPay(payment: any) {
    try {
      const payload = {
        phone,
        customerName,
        discount,
        fitting,
        roundOff,
        payment,
        items: cart.map((i) => ({
          productId: i._id,
          qty: i.qty,
          price: i.price,
          tax: i.tax,
        })),
      };

      const res = await axios.post("/api/sales", payload);
      window.open(`/api/sales/${res.data._id}/invoice?type=thermal`, "_blank");

      toast.success("Sale completed");
      setCart([]);
      setPaymentOpen(false);
    } catch {
      toast.error("Failed to save sale");
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PaymentDrawer
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={roundedTotal}
        onConfirm={saveAndPay}
      />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Receipt className="text-emerald-600" />
          Retail POS
        </h1>

        {offline && (
          <span className="text-orange-600 flex items-center gap-1 text-sm">
            <WifiOff size={14} /> Offline
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border p-4">
          {/* CUSTOMER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1">
                <Phone size={14} /> Mobile Number
              </label>
              <input
                ref={searchRef}
                className="input mt-1"
                placeholder="Customer mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {customerDue > 0 && (
                <div className="text-sm text-red-600 mt-1">
                  Previous Due: ₹{customerDue.toFixed(2)}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1">
                <User size={14} /> Customer Name
              </label>
              <input
                className="input mt-1"
                placeholder="Auto-filled"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY STRIP */}
          <CategoryStrip
            categories={categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* PRODUCT GRID */}
          <ProductGrid
            products={products}
            cart={cart}
            onAdd={addItem}
            onInc={incQty}
            onDec={decQty}
          />
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border p-4">
          <Row label="Subtotal" value={subtotal} />
          <Row label="GST" value={gst} />

          <InputRow
            label="Fitting Charges (18%)"
            value={fitting}
            onChange={setFitting}
          />

          <InputRow label="Discount" value={discount} onChange={setDiscount} />

          <Row label="Round Off" value={roundOff} />

          <div className="flex justify-between font-bold text-lg my-3">
            <span>Total</span>
            <span className="text-emerald-600">₹{roundedTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              if (!cart.length) return toast.error("Cart empty");
              setPaymentOpen(true);
            }}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            Pay ₹{roundedTotal.toFixed(2)}
          </button>

          <button
            onClick={() => saveAndPay({ method: "DUE", amount: roundedTotal })}
            className="w-full mt-2 border border-red-500 text-red-600 py-2 rounded-lg"
          >
            Save as Due
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-600">{label}</span>
      <span>₹{value.toFixed(2)}</span>
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="my-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="input mt-1 w-full"
      />
    </div>
  );
}
