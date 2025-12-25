"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  User,
  Calendar,
  DollarSign,
  FileText,
  Building2,
  TrendingUp,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type SettlementStatus = "Pending" | "Settled" | "Partial";

interface PaymentDetail {
  id: string;
  reference: string;
  customer: string;
  saleDate: string;
  amountFinanced: number;
  commissionRate: number; // Percentage
  commissionAmount: number;
  netSettlement: number;
  status: SettlementStatus;
  invoiceRef: string;
}

const MOCK_PAYMENT: PaymentDetail = {
  id: "1",
  reference: "EMI-2025-001",
  customer: "Ahmad Khan & Sons",
  saleDate: "2025-12-01",
  amountFinanced: 2500.0,
  commissionRate: 2.5,
  commissionAmount: 62.5,
  netSettlement: 2437.5,
  status: "Settled",
  invoiceRef: "INV-9920",
};

export default function EMISaleDetailPage() {
  const [payment] = useState<PaymentDetail>(MOCK_PAYMENT);

  const getStatusClasses = (status: SettlementStatus) => {
    switch (status) {
      case "Settled":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-amber-100 text-amber-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to extract only necessary class (e.g., 'bg-green-500')
  const getStatusIndicatorClass = (status: SettlementStatus) => {
    switch (status) {
      case "Settled":
        return "bg-green-500";
      case "Partial":
        return "bg-amber-500";
      case "Pending":
        return "bg-gray-500";
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
              EMI Sale Details
            </h1>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference: {payment.reference}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download size={16} /> Download Documents
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Printer size={16} /> Print View
          </button>
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
                getStatusIndicatorClass(payment.status)
              )}
            />
            <span className="text-sm font-semibold uppercase text-gray-700">
              {payment.status}
            </span>
            <div className="h-6 w-[1px] bg-gray-300" />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Calendar size={14} /> Sale Date: {payment.saleDate}
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">
            ${payment.amountFinanced.toLocaleString()} Financed
          </p>
        </div>

        {/* Payment Details Card (White theme style) */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Financing Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Info */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <User size={14} className="text-blue-500" /> Customer
              </h3>
              <p className="text-lg font-bold text-gray-800">
                {payment.customer}
              </p>
            </div>

            {/* Provider Details */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <Building2 size={14} className="text-blue-500" /> Provider
              </h3>
              <p className="text-sm text-gray-700 font-semibold">
                Bajaj Finance
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Invoice Ref: {payment.invoiceRef}
              </p>
            </div>

            {/* Financial Metrics */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Commission (MDR)
              </h3>
              <p className="text-xl font-bold text-blue-800">
                ${payment.commissionAmount.toFixed(2)}
              </p>
              <p className="text-xs text-blue-600">
                Rate: {payment.commissionRate.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Settlement Breakdown
            </h3>
            <div className="max-w-md space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Financed Amount</span>
                <span className="font-semibold">
                  ${payment.amountFinanced.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commission Deducted</span>
                <span className="font-semibold text-rose-600">
                  -${payment.commissionAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-800">
                  Net Amount Settled
                </span>
                <span className="text-2xl font-black text-blue-600">
                  ${payment.netSettlement.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
