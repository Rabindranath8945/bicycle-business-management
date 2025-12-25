"use client";

import {
  Printer,
  Download,
  DollarSign,
  Undo2,
  MoreVertical,
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Layers,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// --- Types and Mock Data ---

type InvoiceStatus = "Draft" | "Posted" | "Cancelled";
type PaymentStatus = "Paid" | "Not Paid" | "Partial";
type SaleType = "Retail" | "Wholesale";

interface ProductLine {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g., 18%
  subtotal: number;
  costPrice: number; // for profit calc
}

interface InvoiceDetail {
  id: string;
  number: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  date: string;
  customerName: string;
  customerAddress: string;
  saleType: SaleType;
  dueDate: string;
  subTotal: number;
  totalTax: number;
  grandTotal: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  lines: ProductLine[];
}

const MOCK_INVOICE: InvoiceDetail = {
  id: "inv001",
  number: "INV/2025/001",
  status: "Posted",
  paymentStatus: "Paid",
  date: "2025-12-19",
  customerName: "Ahmad Khan & Sons",
  customerAddress: "123 Business Lane, Karachi, Pakistan 75500",
  saleType: "Wholesale",
  dueDate: "2026-01-19",
  subTotal: 1250.0,
  totalTax: 225.0,
  grandTotal: 1475.0,
  totalCost: 800.0,
  profit: 675.0,
  profitMargin: 45.76,
  lines: [
    {
      id: 1,
      name: "Product A",
      description: "Premium quality item",
      quantity: 5,
      unitPrice: 100.0,
      taxRate: 18,
      subtotal: 500.0,
      costPrice: 300.0,
    },
    {
      id: 2,
      name: "Product B",
      description: "Standard stock item",
      quantity: 15,
      unitPrice: 50.0,
      taxRate: 18,
      subtotal: 750.0,
      costPrice: 500.0,
    },
  ],
};

const formatCurrency = (amount: number) => `US$${amount.toFixed(2)}`;

const getStatusClasses = (status: InvoiceStatus) => {
  switch (status) {
    case "Posted":
      return "bg-green-500";
    case "Cancelled":
      return "bg-rose-500";
    case "Draft":
    default:
      return "bg-gray-400";
  }
};

const getPaymentStatusClasses = (status: PaymentStatus) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Partial":
      return "bg-yellow-100 text-yellow-800";
    case "Not Paid":
    default:
      return "bg-rose-100 text-rose-800";
  }
};

// --- Main Component ---

export default function SalesDetailViewPage() {
  const [invoice] = useState<InvoiceDetail>(MOCK_INVOICE);

  return (
    <div className="flex flex-col h-screen bg-[#F1F2F7]">
      {/* ODOO TOP CONTROL PANEL */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-gray-700">
            Invoice: {invoice.number}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-[#017E84] hover:bg-[#015f63] text-white rounded text-sm font-medium transition-colors">
            <DollarSign size={16} /> Record Payment
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm font-medium transition-colors">
            <Undo2 size={16} /> Create Return
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm font-medium transition-colors">
            <Printer size={16} /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm font-medium transition-colors">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Status Indicator Bar */}
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "h-4 w-4 rounded-full",
                  getStatusClasses(invoice.status)
                )}
              />
              <span className="text-sm font-semibold uppercase">
                {invoice.status}
              </span>
              <div className="h-6 w-[1px] bg-gray-300" />
              <span
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full",
                  getPaymentStatusClasses(invoice.paymentStatus)
                )}
              >
                {invoice.paymentStatus}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(invoice.grandTotal)}
            </p>
          </div>

          {/* Invoice Details Card */}
          <div className="bg-white p-8 rounded shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <User size={14} /> Customer
                </h3>
                <p className="text-lg font-bold text-gray-800">
                  {invoice.customerName}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {invoice.customerAddress}
                </p>
              </div>

              {/* Invoice Info (Date, Type) */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <FileText size={14} /> Details
                </h3>
                <p className="text-sm">
                  <strong>Invoice Date:</strong> {invoice.date}
                </p>
                <p className="text-sm">
                  <strong>Due Date:</strong> {invoice.dueDate}
                </p>
                <p className="text-sm">
                  <strong>Sale Type:</strong> {invoice.saleType}
                </p>
              </div>

              {/* Profit Calculation (Specific Requirement) */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2 flex items-center gap-2">
                  <Layers size={14} /> Profitability
                </h3>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(invoice.profit)}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <Percent size={14} className="mr-1" /> Margin:{" "}
                  {invoice.profitMargin.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Product List Table */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Products & Services
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax (%)
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {invoice.lines.map((line) => (
                      <tr key={line.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {line.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {line.description}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                          {line.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                          {formatCurrency(line.unitPrice)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                          {line.taxRate}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatCurrency(line.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals & Tax Breakup Section */}
            <div className="flex justify-end mt-8">
              <div className="w-full md:w-1/2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-medium text-gray-700">
                    <span>Subtotal (Base)</span>
                    <span>{formatCurrency(invoice.subTotal)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-700">
                    <span>Taxes (18% GST)</span>
                    <span>{formatCurrency(invoice.totalTax)}</span>
                  </div>
                  {/* Total Row - styled distinctly */}
                  <div className="flex justify-between font-bold text-lg border-t-2 border-gray-200 pt-4 mt-4">
                    <span>Total Amount</span>
                    <span className="text-[#017E84]">
                      {formatCurrency(invoice.grandTotal)}
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
