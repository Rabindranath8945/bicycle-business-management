"use client";

import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Package,
  RefreshCcw,
  Plus,
  Trash2,
  FileText,
  Wallet,
  AlertCircle,
  Undo2,
  User,
  Hash,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SalesReturnProcessPage() {
  // New State for Selection Requirements
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const [returnItems, setReturnItems] = useState([
    {
      id: 1,
      name: "Specialized Rockhopper Frame",
      price: 850.0,
      qty: 1,
      maxQty: 1,
      condition: "New",
    },
    {
      id: 2,
      name: "Shimano Deore XT Derailleur",
      price: 120.0,
      qty: 2,
      maxQty: 5,
      condition: "Opened",
    },
  ]);

  const [resolution, setResolution] = useState<
    "refund" | "credit" | "exchange"
  >("refund");

  const subtotal = returnItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const tax = subtotal * 0.15;
  const totalRefund = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 font-sans pb-12">
      {/* --- GLASS HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-blue-200/50 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Process Return
            </h1>
            <p className="text-xs font-medium text-blue-500 uppercase tracking-widest">
              RMA #8842-2025
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 transition-all">
            Save Draft
          </button>
          <button className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <ShieldCheck size={18} /> Complete Return
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* --- NEW SECTION: CUSTOMER & INVOICE SELECTION --- */}
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <User size={14} className="text-blue-500" /> 1. Select Customer /
              Supplier
            </label>
            <div className="relative">
              <select
                className="w-full bg-white/80 border border-blue-100 rounded-2xl p-4 pl-12 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm transition-all"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Choose a customer...</option>
                <option value="1">Ahmad Khan & Sons</option>
                <option value="2">Cycle Hub Wholesale</option>
                <option value="3">Modern Retailers</option>
              </select>
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-300",
              !selectedCustomer && "opacity-40 pointer-events-none"
            )}
          >
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <Hash size={14} className="text-blue-500" /> 2. Linked Invoice
              Number
            </label>
            <div className="relative">
              <select
                className="w-full bg-white/80 border border-blue-100 rounded-2xl p-4 pl-12 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm transition-all"
                value={selectedInvoice}
                onChange={(e) => setSelectedInvoice(e.target.value)}
              >
                <option value="">Select Invoice...</option>
                {selectedCustomer && (
                  <>
                    <option value="INV-9920">
                      INV-9920 (Total: $1,250.00)
                    </option>
                    <option value="INV-9850">INV-9850 (Total: $450.00)</option>
                  </>
                )}
              </select>
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* --- EXISTING CONTENT (Disabled until Invoice is selected) --- */}
        <div
          className={cn(
            "grid grid-cols-12 gap-8 transition-all duration-500",
            !selectedInvoice &&
              "opacity-20 blur-[2px] pointer-events-none select-none"
          )}
        >
          {/* --- LEFT COLUMN: ITEMS & CONDITION --- */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800">
                <Package className="text-blue-600" size={22} /> Return Items
                from {selectedInvoice || "Invoice"}
              </h2>

              <div className="space-y-4">
                {returnItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-blue-50 hover:border-blue-200 hover:bg-white/80 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Undo2 size={24} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <p className="text-xs text-slate-500">
                        Unit Price: ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Qty to Return
                        </p>
                        <input
                          type="number"
                          className="w-16 p-1.5 text-center bg-white border border-blue-100 rounded-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                          value={item.qty}
                          max={item.maxQty}
                          min={0}
                          onChange={(e) => {
                            const val = Math.min(
                              item.maxQty,
                              Math.max(0, parseInt(e.target.value) || 0)
                            );
                            setReturnItems(
                              returnItems.map((i) =>
                                i.id === item.id ? { ...i, qty: val } : i
                              )
                            );
                          }}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Condition
                        </p>
                        <select
                          className="bg-white border border-blue-100 rounded-lg p-1.5 text-xs font-semibold outline-none"
                          value={item.condition}
                          onChange={(e) => {
                            setReturnItems(
                              returnItems.map((i) =>
                                i.id === item.id
                                  ? { ...i, condition: e.target.value }
                                  : i
                              )
                            );
                          }}
                        >
                          <option value="New">New / Sealed</option>
                          <option value="Opened">Opened / Good</option>
                          <option value="Damaged">Damaged</option>
                        </select>
                      </div>

                      <div className="text-right w-24">
                        <p className="text-sm font-black text-blue-700">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>

                      <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-3 border-2 border-dashed border-blue-100 rounded-2xl text-blue-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all">
                <Plus size={18} /> Add More Items from Invoice
              </button>
            </div>

            <div className="bg-amber-50/50 backdrop-blur-md border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle
                className="text-amber-500 shrink-0 mt-0.5"
                size={18}
              />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Stock Adjustment:</strong> Items marked as "Damaged"
                will automatically move to the{" "}
                <strong>QC/Repair Location</strong> instead of Main Stock.
              </p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: RESOLUTION & SUMMARY --- */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                Resolution Type
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "refund",
                    label: "Instant Refund",
                    icon: Wallet,
                    desc: "Back to original payment",
                  },
                  {
                    id: "credit",
                    label: "Store Credit",
                    icon: FileText,
                    desc: "Add to customer wallet",
                  },
                  {
                    id: "exchange",
                    label: "Exchange",
                    icon: RefreshCcw,
                    desc: "Swap for other products",
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setResolution(type.id as any)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      resolution === type.id
                        ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-600/10"
                        : "border-slate-100 hover:border-blue-200"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        resolution === type.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      <type.icon size={20} />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-bold",
                          resolution === type.id
                            ? "text-blue-700"
                            : "text-slate-700"
                        )}
                      >
                        {type.label}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                        {type.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* FINANCIAL SUMMARY CARD */}
            <div className="bg-blue-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40">
              <div className="absolute top-[-20%] right-[-20%] h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute bottom-[-10%] left-[-10%] h-48 w-48 rounded-full bg-blue-400/10 blur-2xl"></div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center opacity-80">
                  <span className="text-sm font-medium">Return Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center opacity-80">
                  <span className="text-sm font-medium">Tax Refund (15%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/20 my-4"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                      Total Return Value
                    </p>
                    <p className="text-4xl font-black mt-1">
                      ${totalRefund.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="font-bold uppercase tracking-tight text-blue-100">
                      Ready to Validate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
