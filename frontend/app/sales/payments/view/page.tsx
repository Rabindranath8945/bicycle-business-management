"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  User,
  DollarSign,
  FileText,
  Clock,
  History,
  CheckCircle2,
  XCircle,
  Building2,
  Banknote,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type PaymentMethod = "Bank Transfer" | "Cash" | "UPI" | "Cheque";
type PaymentStatus = "Completed" | "Pending" | "Reversed";

interface PaymentDetail {
  id: string;
  reference: string;
  customerName: string;
  customerAddress: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  invoiceRef: string;
  notes: string;
}

const MOCK_PAYMENT: PaymentDetail = {
  id: "1",
  reference: "PAY-2025-001",
  customerName: "Ahmad Khan & Sons",
  customerAddress: "123 Business Lane, Karachi, Pakistan 75500",
  date: "2025-12-19",
  amount: 2500.0,
  method: "Bank Transfer",
  status: "Completed",
  invoiceRef: "INV-9920",
  notes: "Received partial payment for cycle parts shipment via HBL Bank.",
};

export default function PaymentViewPage() {
  const [payment] = useState<PaymentDetail>(MOCK_PAYMENT);

  const getStatusClasses = (status: PaymentStatus) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-amber-500 text-white";
      case "Reversed":
        return "bg-rose-500 text-white";
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Bank Transfer":
        return <Building2 size={16} />;
      case "Cash":
        return <Banknote size={16} />;
      case "UPI":
        return <ArrowUpRight size={16} />;
      case "Cheque":
        return <FileText size={16} />;
    }
  };

  return (
    // Background color matches theme image
    <div className="min-h-screen bg-gray-50/50 text-slate-900 font-sans pb-12">
      {/* --- TOP CONTROL PANEL --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
              Payment Details
            </h1>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference: {payment.reference}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Printer size={16} /> Print Receipt
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download size={16} /> Download PDF
          </button>
          {payment.status === "Completed" && (
            <button className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md font-semibold transition-colors">
              <XCircle size={16} /> Reverse Payment
            </button>
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Status Indicator Bar */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "h-4 w-4 rounded-full",
                getStatusClasses(payment.status)
              )}
            />
            <span className="text-sm font-semibold uppercase text-gray-700">
              {payment.status}
            </span>
            <div className="h-6 w-[1px] bg-gray-300" />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Clock size={14} /> Recorded: {payment.date}
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">
            ${payment.amount.toLocaleString()}
          </p>
        </div>

        {/* Payment Details Card (White theme style) */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Transaction Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Info */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <User size={14} className="text-blue-500" /> Payer Details
              </h3>
              <p className="text-lg font-bold text-gray-800">
                {payment.customerName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {payment.customerAddress}
              </p>
            </div>

            {/* Transaction Info (Method, Ref) */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <DollarSign size={14} className="text-blue-500" /> Transaction
                Details
              </h3>

              {/* FIX APPLIED HERE: Changed parent <p> to <div> */}
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded text-blue-600">
                  {getMethodIcon(payment.method)}
                </div>
                Method: **{payment.method}**
              </div>

              <p className="text-sm text-gray-700 mt-2">
                Reference: **{payment.reference}**
              </p>
            </div>

            {/* Related Invoice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
                <FileText size={14} /> Linked Invoice
              </h3>
              <p className="text-xl font-bold text-blue-800 hover:underline cursor-pointer">
                {payment.invoiceRef}
              </p>
              <p className="text-xs text-blue-600">
                Total amount applied to this invoice.
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <History size={14} /> Internal Notes
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 italic">{payment.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
