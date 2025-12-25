"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  History,
  Calendar,
  ChevronDown,
  MoreVertical,
  Printer,
  FileText,
  TrendingUp,
  CreditCard,
  Banknote,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type PaymentMethod = "Bank Transfer" | "Cash" | "UPI" | "Cheque";

interface PaymentRecord {
  id: string;
  reference: string;
  customer: string;
  invoiceRef: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: "Completed" | "Pending" | "Reversed";
}

const PAYMENT_HISTORY: PaymentRecord[] = [
  {
    id: "1",
    reference: "PAY-2025-001",
    customer: "Ahmad Khan & Sons",
    invoiceRef: "INV-9920",
    date: "2025-12-19",
    amount: 2500.0,
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "2",
    reference: "PAY-2025-002",
    customer: "Cycle Hub Wholesale",
    invoiceRef: "INV-9945",
    date: "2025-12-18",
    amount: 1200.5,
    method: "Cash",
    status: "Completed",
  },
  {
    id: "3",
    reference: "PAY-2025-003",
    customer: "Modern Retailers",
    invoiceRef: "INV-9850",
    date: "2025-12-18",
    amount: 450.0,
    method: "UPI",
    status: "Pending",
  },
  {
    id: "4",
    reference: "PAY-2025-004",
    customer: "John Doe",
    invoiceRef: "INV-9910",
    date: "2025-12-15",
    amount: 150.0,
    method: "Cash",
    status: "Completed",
  },
  {
    id: "5",
    reference: "PAY-2025-005",
    customer: "Ahmad Khan & Sons",
    invoiceRef: "INV-9700",
    date: "2025-12-12",
    amount: 3000.0,
    method: "Cheque",
    status: "Reversed",
  },
];

export default function PaymentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Bank Transfer":
        return <Building2 size={14} />;
      case "Cash":
        return <Banknote size={14} />;
      case "UPI":
        return <ArrowUpRight size={14} />;
      case "Cheque":
        return <FileText size={14} />;
    }
  };

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
            <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <History className="text-blue-600" size={24} /> Payment History
            </h1>
            <p className="text-xs font-medium text-blue-500 uppercase tracking-widest">
              Financial Ledger 2025
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 transition-all flex items-center gap-2">
            <Download size={16} /> Export Excel
          </button>
          <button className="px-5 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <Printer size={16} /> Print Statements
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* --- PERFORMANCE SUMMARY (BLUE GLASS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
            <div className="absolute top-[-10%] right-[-10%] h-32 w-32 rounded-full bg-blue-400/20 blur-2xl"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
              Collections This Month
            </p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-black">$42,850.00</p>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                <TrendingUp size={14} /> +12%
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl shadow-blue-900/5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total Transactions
            </p>
            <p className="text-3xl font-black text-slate-800 mt-1">1,240</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl shadow-blue-900/5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pending Clearances
            </p>
            <p className="text-3xl font-black text-amber-500 mt-1">$1,450.20</p>
          </div>
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="bg-white/40 backdrop-blur-md border border-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search reference, customer or invoice..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 transition-all">
              <Filter size={16} /> Filters <ChevronDown size={14} />
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 transition-all">
              <Calendar size={16} /> Date Range <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* --- HISTORY TABLE --- */}
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-50/50 text-blue-900/50 text-[10px] font-black uppercase tracking-[0.15em] border-b border-blue-100">
              <tr>
                <th className="px-8 py-5">Receipt Ref</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Inv Ref</th>
                <th className="px-6 py-5">Method</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {PAYMENT_HISTORY.map((payment) => (
                <tr
                  key={payment.id}
                  className="group hover:bg-white/80 transition-all"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {payment.reference}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {payment.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">
                    {payment.customer}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-black border border-blue-100 italic">
                      #{payment.invoiceRef}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {getMethodIcon(payment.method)}
                      </div>
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono font-black text-base text-slate-900">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                        payment.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : payment.status === "Pending"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-rose-100 text-rose-700 border border-rose-200"
                      )}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION (GLASS) --- */}
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing 5 of 1,240 Payments
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/60 border border-white rounded-xl text-xs font-bold text-slate-500 hover:bg-white transition-all shadow-sm">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 border border-blue-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
