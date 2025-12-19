"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "@/lib/axios";
import { toast, Toaster } from "sonner";
import {
  Receipt, // Added Receipt for Retail POS button
  WifiOff,
  User,
  Search,
  Plus,
  Save,
  Printer,
  FileText,
  Truck,
  Calendar,
  DollarSign,
  Info,
  Package,
  Users,
  Handshake,
  RotateCcw, // Added RotateCcw for Cycle POS button
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn is a utility function like clsx/tailwind-merge

/* ================= TYPES (Using placeholders for simplicity) ================= */

type Customer = {
  _id: string;
  name: string;
  phone: string;
  balance: number;
};

type Product = {
  _id: string;
  name: string;
  wholesalePrice: number; // Use wholesale price here
  taxPercent: number;
  stock: number;
};

type CartItem = {
  _id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  stock: number;
};

export default function WholesalePOSPage() {
  const [offline, setOffline] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // List of available products
  const [transportCharges, setTransportCharges] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [invoiceIdentifier] = useState(Math.floor(Math.random() * 100000));

  // Placeholder function for customer search/select modal
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    toast.success(`Customer ${customer.name} selected.`);
  };

  const addItemToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          qty: 1,
          price: product.wholesalePrice,
          tax: product.taxPercent,
          stock: product.stock,
        },
      ];
    });
  };

  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item._id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
    );
  };

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const totalGst = useMemo(
    () => cart.reduce((s, i) => s + (i.price * i.qty * i.tax) / 100, 0),
    [cart]
  );

  const rawTotal = subtotal + totalGst + transportCharges;
  const roundedTotal = Math.round(rawTotal);
  const roundOff = roundedTotal - rawTotal;

  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined ? `₹${amount.toLocaleString("en-IN")}` : "—";

  /* ================= ACTIONS ================= */
  const saveInvoice = (type: "draft" | "save" | "print") => {
    if (!selectedCustomer) {
      toast.error("Customer selection is mandatory for wholesale invoices.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cannot save an empty invoice.");
      return;
    }

    // Placeholder for API call
    console.log("Saving invoice with data:", {
      customer: selectedCustomer._id,
      cart,
      dueDate,
      transportCharges,
      type,
    });
    toast.success(`Invoice saved as ${type === "draft" ? "draft" : "final"}.`);

    if (type === "print") {
      // window.open('/api/invoice-a4-print', '_blank'); // Placeholder for A4 print logic
    }
  };

  const navigateTo = (path: string) => toast.info(`Navigating to ${path}`);

  /* ================= UI COMPONENTS ================= */
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Toaster position="bottom-center" />

      {/* HEADER */}
      <header className="bg-white px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md">
              <FileText size={18} />
            </div>
            Wholesale Invoice (B2B)
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {offline && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              <WifiOff size={14} /> OFFLINE
            </span>
          )}

          {/* Added new navigation buttons here */}
          <button
            onClick={() => navigateTo("/sales/retail-pos")}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Receipt size={14} /> Retail POS
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
              <p className="text-sm font-bold text-gray-900">
                INV-WHS-{new Date().toISOString().slice(0, 10)}-
                {invoiceIdentifier}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT PANEL: Product Search & Customer Selection (Takes up more space) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Customer Selection (Mandatory) */}
          <div className="bg-white rounded-xl p-4 shadow-lg flex justify-between items-center border border-blue-500/30">
            <div className="flex items-center gap-4">
              <User
                size={24}
                className={cn(
                  "text-gray-500",
                  selectedCustomer ? "text-blue-600" : "text-red-500"
                )}
              />
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Customer Details (Mandatory)
                </p>
                {selectedCustomer ? (
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.name} ({selectedCustomer.phone}) | Due:{" "}
                    {formatCurrency(selectedCustomer.balance)}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">
                    Please select a customer before billing.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                handleCustomerSelect({
                  _id: "cust123",
                  name: "Bulk Buyers Inc.",
                  phone: "9876543210",
                  balance: 5000,
                })
              } // Simulate customer selection
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Search size={16} /> Select Customer
            </button>
          </div>

          {/* Product Search and Grid Placeholder */}
          <div className="bg-white rounded-xl p-4 shadow-lg flex-1 flex flex-col overflow-hidden">
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Search Barcode, Name or SKU to add to cart..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                onKeyDown={(e) => {
                  // Simulate adding a product on enter key press for demo
                  if (e.key === "Enter") {
                    const demoProduct: Product = {
                      _id: `prod${Math.random()}`,
                      name: `Bulk Product ${Math.random().toFixed(2)}`,
                      wholesalePrice: 150.0,
                      taxPercent: 18,
                      stock: 999,
                    };
                    addItemToCart(demoProduct);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-xs text-gray-500">
                Available products grid or list would appear here. Use search
                bar above to add items.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Cart & Billing Details */}
        <div className="w-[500px] flex flex-col gap-4">
          {/* CART TABLE */}
          <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
              <span className="font-bold text-gray-700">Invoice Items</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">
                {cart.length} Items
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Product Table Header (simple inline style for demo) */}
              <div className="flex text-xs font-semibold text-gray-500 pb-2 border-b">
                <span className="flex-1">Description</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-16 text-right">Qty</span>
                <span className="w-16 text-right">Total</span>
              </div>
              {cart.map((item) => (
                <div key={item._id} className="flex text-sm items-center">
                  <span className="flex-1 pr-2">
                    {item.name}{" "}
                    <span className="text-xs text-gray-400">
                      (GST {item.tax}%)
                    </span>
                  </span>
                  <span className="w-16 text-right">
                    {item.price.toFixed(2)}
                  </span>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleQtyChange(item._id, Number(e.target.value))
                    }
                    className="w-16 text-right outline-none border-b border-blue-400 focus:border-blue-600 bg-transparent px-1"
                  />
                  <span className="w-16 text-right font-semibold">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* BILLING FOOTER & ACTIONS */}
            <div className="p-4 bg-white border-t space-y-3 shadow-inner">
              {/* Additional Wholesale Fields: Transport & Due Date */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Truck size={10} /> Transport Charges
                  </label>
                  <input
                    type="number"
                    value={transportCharges}
                    onChange={(e) =>
                      setTransportCharges(Number(e.target.value))
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Calendar size={10} /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Totals & GST Breakup */}
              <div className="pt-2 space-y-1 text-sm border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {/* Requirement: GST Breakup visibility */}
                <div className="flex justify-between text-gray-600">
                  <span>Total GST Amount</span>
                  <span>{formatCurrency(totalGst)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Transport</span>
                  <span>{formatCurrency(transportCharges)}</span>
                </div>

                <div className="flex justify-between text-xl font-black text-gray-900 pt-1">
                  <span>Grand Total</span>
                  <span className="text-blue-600">
                    {formatCurrency(roundedTotal)}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => saveInvoice("print")}
                  className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Printer size={18} /> SAVE & PRINT (A4)
                </button>
                <button
                  onClick={() => saveInvoice("save")}
                  className="flex items-center justify-center gap-2 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-900 transition-colors"
                >
                  <Save size={14} /> SAVE INVOICE
                </button>
                <button
                  onClick={() => saveInvoice("draft")}
                  className="flex items-center justify-center gap-2 py-2 bg-gray-500/10 text-gray-700 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-500/20"
                >
                  <FileText size={14} /> SAVE AS DRAFT
                </button>
                <button
                  onClick={() => toast.info("Bill Cancelled")}
                  className="flex items-center justify-center gap-2 py-2 bg-rose-500/10 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 hover:bg-rose-500/20"
                >
                  CANCEL BILL
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
