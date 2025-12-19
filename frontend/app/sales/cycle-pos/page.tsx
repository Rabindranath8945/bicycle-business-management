"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast, Toaster } from "sonner";
import {
  Receipt,
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
  RotateCcw,
  Bike, // Icon for Cycle POS
  ClipboardList, // Icon for warranty/service
  CreditCard, // Icon for EMI
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES (Using placeholders for simplicity) ================= */
type Customer = { _id: string; name: string; phone: string; balance: number };
// The product type needs a place for the frame number
type Product = {
  _id: string;
  name: string;
  salePrice: number;
  taxPercent: number;
  stock: number;
  category?: string;
  sku?: string;
  barcode?: string;
  isCycle?: boolean;
};
type CartItem = {
  _id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  stock: number;
  serialNumber?: string;
};

// Placeholder components (kept for context/consistency)
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
  // Filter to only show cycles and accessories
  const filteredProducts = products.filter(
    (p) => p.isCycle || p.category === "Accessories"
  );
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredProducts.map((product) => (
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

export default function CyclePOSPage() {
  const router = useRouter();
  const [offline, setOffline] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  // Mock data for cycles and accessories
  const [products] = useState<Product[]>([
    {
      _id: "C1",
      name: "Mountain Bike Pro XL (New)",
      salePrice: 15000,
      taxPercent: 12,
      stock: 5,
      isCycle: true,
    },
    {
      _id: "C2",
      name: "Kids Cycle (New)",
      salePrice: 4500,
      taxPercent: 12,
      stock: 20,
      isCycle: true,
    },
    {
      _id: "A1",
      name: "Helmet (Accessories)",
      salePrice: 800,
      taxPercent: 18,
      stock: 50,
      category: "Accessories",
    },
    {
      _id: "A2",
      name: "Bell (Accessories)",
      salePrice: 150,
      taxPercent: 18,
      stock: 100,
      category: "Accessories",
    },
  ]);

  // Specific state for cycle sale details
  const [frameSerialNumber, setFrameSerialNumber] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("12 Months"); // e.g., 12 Months
  const [serviceSchedule, setServiceSchedule] = useState(
    "3 Free Services (1, 6, 12 Months)"
  ); // e.g., first service at 1 month
  const [invoiceIdentifier] = useState(Math.floor(Math.random() * 100000));

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const totalGst = useMemo(
    () => cart.reduce((s, i) => s + (i.price * i.qty * i.tax) / 100, 0),
    [cart]
  );

  const rawTotal = subtotal + totalGst; // Simple total for this example
  const roundedTotal = Math.round(rawTotal);

  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined ? `₹${amount.toLocaleString("en-IN")}` : "—";

  /* ================= HANDLERS ================= */
  const handleCustomerSelect = (customer: Customer) =>
    setSelectedCustomer(customer); // Simplified selection
  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty <= 0) setCart((prev) => prev.filter((item) => item._id !== id));
    else
      setCart((prev) =>
        prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
      );
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
          price: product.salePrice,
          tax: product.taxPercent,
          stock: product.stock,
        },
      ];
    });
  };

  const saveSale = (actionType: "printA4" | "printWarranty" | "tagEMI") => {
    if (!selectedCustomer) {
      toast.error("Customer selection is mandatory for a cycle sale.");
      return;
    }
    const cycleItem = cart.find(
      (item) => products.find((p) => p._id === item._id)?.isCycle
    );
    if (!cycleItem && actionType !== "tagEMI") {
      toast.error(
        "A cycle must be in the cart to print an A4 invoice or warranty card."
      );
      return;
    }
    if (
      !frameSerialNumber &&
      (actionType === "printA4" || actionType === "printWarranty")
    ) {
      toast.error("Serial number is required to finalize sale documentation.");
      return;
    }

    // Placeholder for API call and subsequent actions
    const payload = {
      customer: selectedCustomer._id,
      items: cart,
      frameSerialNumber,
      warrantyPeriod,
      serviceSchedule,
      total: roundedTotal,
      action: actionType,
    };
    console.log("Saving Cycle Sale:", payload);

    if (actionType === "printA4") {
      toast.success("A4 Invoice saved and printing...");
    } else if (actionType === "printWarranty") {
      toast.success("Warranty card printing...");
    } else if (actionType === "tagEMI") {
      toast.info("Opening EMI payment modal...");
      // This is where a PaymentDrawer would be used for EMI specific logic
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  /* ================= UI COMPONENTS ================= */
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Toaster position="bottom-center" />

      {/* HEADER */}
      <header className="bg-white px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md">
              <Bike size={18} />
            </div>
            New Cycle Sale
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {offline && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              <WifiOff size={14} /> OFFLINE
            </span>
          )}

          <button
            onClick={() => navigateTo("/sales/retail-pos")}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Receipt size={14} /> Retail POS
          </button>
          <button
            onClick={() => navigateTo("/sales/wholesale/create")}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Handshake size={14} /> Wholesale POS
          </button>

          <div className="flex items-center gap-3">
            <Users size={18} className="text-gray-500" />
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Invoice No.</p>
              <p className="text-sm font-bold text-gray-900">
                INV-CYC-{new Date().toISOString().slice(0, 10)}-
                {invoiceIdentifier}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT PANEL: Cycles & Accessories Grid */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-xl p-4 shadow-lg flex justify-between items-center">
            <h2 className="font-bold text-gray-700">
              Select New Cycles & Accessories
            </h2>
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Search product..."
                className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white rounded-xl p-4 shadow-lg">
            <ProductGrid
              products={products}
              cart={cart}
              onAdd={addItemToCart}
              onInc={() => {}}
              onDec={() => {}}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Cart & Sale Details */}
        <div className="w-[500px] flex flex-col gap-4">
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
                    {selectedCustomer.name} ({selectedCustomer.phone})
                  </p>
                ) : (
                  <p className="text-sm text-red-500">
                    Please select a customer.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                handleCustomerSelect({
                  _id: "cust456",
                  name: "John Doe",
                  phone: "1234567890",
                  balance: 0,
                })
              } // Simulate customer selection
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Search size={16} /> Select Customer
            </button>
          </div>

          {/* CART & DETAILS */}
          <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
              <span className="font-bold text-gray-700">Sale Details</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">
                {cart.length} Items
              </span>
            </div>

            {/* Cycle Specific Inputs */}
            <div className="p-4 border-b space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Frame / Serial Number
                </label>
                <input
                  type="text"
                  value={frameSerialNumber}
                  onChange={(e) => setFrameSerialNumber(e.target.value)}
                  placeholder="Enter unique frame/serial number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Warranty Period
                  </label>
                  <input
                    type="text"
                    value={warrantyPeriod}
                    onChange={(e) => setWarrantyPeriod(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Free Service Schedule
                  </label>
                  <input
                    type="text"
                    value={serviceSchedule}
                    onChange={(e) => setServiceSchedule(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex text-xs font-semibold text-gray-500 pb-2 border-b">
                <span className="flex-1">Description</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-16 text-right">Qty</span>
                <span className="w-16 text-right">Total</span>
              </div>
              {cart.map((item) => (
                <div key={item._id} className="flex text-sm items-center">
                  <span className="flex-1 pr-2">{item.name}</span>
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
              {/* Totals */}
              <div className="pt-2 space-y-1 text-sm border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total GST Amount</span>
                  <span>{formatCurrency(totalGst)}</span>
                </div>

                <div className="flex justify-between text-xl font-black text-gray-900 pt-1">
                  <span>Grand Total</span>
                  <span className="text-blue-600">
                    {formatCurrency(roundedTotal)}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS (A4 Invoice, EMI, Warranty Card Print) */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => saveSale("printA4")}
                  className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Printer size={18} /> SAVE & PRINT (A4 INVOICE)
                </button>
                <button
                  onClick={() => saveSale("tagEMI")}
                  className="flex items-center justify-center gap-2 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-900 transition-colors"
                >
                  <CreditCard size={14} /> TAG EMI
                </button>
                <button
                  onClick={() => saveSale("printWarranty")}
                  className="flex items-center justify-center gap-2 py-2 bg-gray-500/10 text-gray-700 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-500/20"
                >
                  <FileText size={14} /> PRINT WARRANTY CARD
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
