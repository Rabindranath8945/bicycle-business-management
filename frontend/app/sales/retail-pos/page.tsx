"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "@/lib/axios";
import { toast, Toaster } from "sonner";
import {
  Receipt,
  WifiOff,
  CreditCard,
  Phone,
  User,
  Search,
  Trash2,
  Plus,
  Minus,
  PauseCircle,
  XCircle,
  Printer,
  Save,
  Scissors,
  Users,
  Handshake,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn is a utility function like clsx/tailwind-merge

// Placeholder components (kept for context)
const CategoryStrip = ({
  categories,
  activeId,
  onSelect,
}: {
  categories: any[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) => {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-2 text-sm rounded-lg font-medium transition-colors",
          activeId === null
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat._id)}
          className={cn(
            "px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-colors",
            activeId === cat._id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {cat.name} ({cat.count || 0})
        </button>
      ))}
    </div>
  );
};

const ProductGrid = ({
  products,
  cart,
  onAdd,
  onInc,
  onDec,
}: {
  products: any[];
  cart: any[];
  onAdd: (p: any) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <button
          key={product._id}
          onClick={() => onAdd(product)}
          className="flex flex-col p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
        >
          <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500 text-xs">
            Image Placeholder
          </div>
          <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
            {product.name}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            SKU: {product.sku || "N/A"}
          </p>
          <p className="text-lg font-bold text-blue-600">
            ₹{product.salePrice.toFixed(2)}
          </p>
        </button>
      ))}
    </div>
  );
};

const PaymentDrawer = ({
  open,
  onClose,
  total,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (payment: any) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>
        <p className="text-lg mb-6">
          Total Amount:{" "}
          <span className="font-extrabold text-blue-600">
            ₹{total.toLocaleString()}
          </span>
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              onConfirm({ type: "cash", amount: total });
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Cash
          </button>
          <button
            onClick={() => {
              onConfirm({ type: "card", amount: total });
              onClose();
            }}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Card
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
// End Placeholder components

/* ================= TYPES ================= */
type Category = { _id: string; name: string; count?: number };
type Product = {
  _id: string;
  name: string;
  salePrice: number;
  taxPercent?: number;
  stock?: number;
  category?: string;
  sku?: string;
  barcode?: string;
};
type CartItem = {
  _id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  stock?: number;
};

export default function RetailPOSPage() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [offline, setOffline] = useState(false);
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerDue, setCustomerDue] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [fitting, setFitting] = useState<number>(0);
  // State to hold a static random number for the session
  const [invoiceIdentifier] = useState(Math.floor(Math.random() * 100000));

  const searchRef = useRef<HTMLInputElement | null>(null);

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const productGst = useMemo(
    () => cart.reduce((s, i) => s + (i.price * i.qty * i.tax) / 100, 0),
    [cart]
  );
  const fittingGST = (fitting * 18) / 100;
  const rawTotal =
    subtotal + productGst + fitting + fittingGST - (discount || 0);
  const roundedTotal = Math.round(rawTotal);
  const roundOff = roundedTotal - rawTotal;

  /* ================= HANDLERS ================= */
  const addItem = (p: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i._id === p._id);
      if (found)
        return prev.map((i) =>
          i._id === p._id ? { ...i, qty: i.qty + 1 } : i
        );
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
  };
  const updatePrice = (id: string, newPrice: number) =>
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, price: newPrice } : i))
    );
  const holdBill = () => {
    toast.info("Bill held successfully");
  };
  const cancelBill = () => {
    if (confirm("Clear cart?")) setCart([]);
    setFitting(0);
    setDiscount(0);
  };

  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined ? `₹${amount.toLocaleString("en-IN")}` : "—";

  const navigateTo = (path: string) => toast.info(`Navigating to ${path}`);

  /* ================= UI COMPONENTS ================= */
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Toaster position="bottom-center" />

      <header className="bg-white px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md">
              <Receipt size={18} />
            </div>
            Retail POS
          </h1>
          <div className="relative w-64 md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={searchRef}
              placeholder="Search Barcode, Name or SKU (F1)"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {offline && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              <WifiOff size={14} /> OFFLINE
            </span>
          )}

          <button
            onClick={() => navigateTo("/sales/wholesale-pos")}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Handshake size={14} /> Wholesale POS
          </button>
          <button
            onClick={() => navigateTo("/sales/cycle-pos")}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <RotateCcw size={14} /> Cycle POS
          </button>

          <div className="flex items-center gap-3">
            <Users size={18} className="text-gray-500" />
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Invoice No.</p>
              {/* Updated the format string as requested */}
              <p className="text-sm font-bold text-gray-900">
                INV-POS-R-{invoiceIdentifier}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT: PRODUCTS & CATEGORIES */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <CategoryStrip
              categories={categories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
          <div className="flex-1 overflow-y-auto bg-white rounded-xl p-4 shadow-lg">
            <ProductGrid
              products={products}
              cart={cart}
              onAdd={addItem}
              onInc={() => {}}
              onDec={() => {}}
            />
          </div>
        </div>

        {/* RIGHT: CART & BILLING */}
        <div className="w-[400px] flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
              <User size={16} className="text-blue-600" /> Customer Info
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              />
              <input
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="text-xs p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
            {customerDue > 0 && (
              <p className="text-[10px] font-bold text-red-500 uppercase px-1">
                Previous Balance: ₹{customerDue}
              </p>
            )}
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
              <span className="font-bold text-gray-700">Current Cart</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">
                {cart.length} Items
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-800 line-clamp-1 w-2/3">
                      {item.name}
                    </span>
                    <button
                      onClick={() =>
                        setCart((c) => c.filter((i) => i._id !== item._id))
                      }
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                      <button className="px-2 py-1 hover:bg-gray-200">
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-bold">{item.qty}</span>
                      <button className="px-2 py-1 hover:bg-gray-200">
                        <Plus size={12} />
                      </button>
                    </div>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updatePrice(item._id, Number(e.target.value))
                      }
                      className="w-20 text-right text-sm font-bold bg-transparent outline-none text-blue-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t space-y-3 shadow-inner">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Scissors size={10} /> Fitting Charges
                  </label>
                  <input
                    type="number"
                    value={fitting}
                    onChange={(e) => setFitting(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm font-bold outline-none focus:border-blue-500 text-red-600 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-1 text-sm border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (Items + Fitting 18%)</span>
                  <span>{formatCurrency(productGst + fittingGST)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-1">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatCurrency(roundedTotal)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setPaymentOpen(true)}
                  className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <CreditCard size={18} /> PAY & PRINT (F2)
                </button>
                <button
                  onClick={holdBill}
                  className="flex items-center justify-center gap-2 py-2 bg-amber-500/10 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 hover:bg-amber-500/20"
                >
                  <PauseCircle size={14} /> HOLD
                </button>
                <button
                  onClick={cancelBill}
                  className="flex items-center justify-center gap-2 py-2 bg-rose-500/10 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 hover:bg-rose-500/20"
                >
                  <XCircle size={14} /> CANCEL
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 text-white rounded-lg text-xs font-bold col-span-2 hover:bg-gray-900 transition-colors">
                  <Save size={14} /> SAVE ONLY
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
