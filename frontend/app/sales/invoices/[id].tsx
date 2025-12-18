"use client";

import { useState } from "react";
import {
  Download,
  ArrowLeft,
  DollarSign,
  CreditCard,
  Banknote,
  PlusCircle,
  FileText,
} from "lucide-react";

// --- Types and Mock Data ---
type PaymentMethod = "Cash" | "Credit" | "UPI" | "Bank Transfer";

interface InvoiceDetails {
  id: string;
  customerName: string;
  date: string;
  dueDate: string;
  total: number;
  amountPaid: number;
  items: { description: string; qty: number; price: number; total: number }[];
}

const MOCK_INVOICE: InvoiceDetails = {
  id: "INV842007",
  customerName: "Clarisa Hercules",
  date: "18th Jul 2021",
  dueDate: "17th Aug 2021",
  total: 840.0,
  amountPaid: 0.0,
  items: [
    {
      description: "Premium Software License (1 year)",
      qty: 1,
      price: 500.0,
      total: 500.0,
    },
    {
      description: "Consulting Services (10 hours)",
      qty: 10,
      price: 34.0,
      total: 340.0,
    },
  ],
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: any }[] = [
  { value: "Cash", label: "Cash", icon: Banknote },
  { value: "Credit", label: "Credit/Debit Card", icon: CreditCard },
  { value: "UPI", label: "UPI/QR Code", icon: FileText },
  { value: "Bank Transfer", label: "Bank Transfer", icon: DollarSign },
];

// --- Component ---

export default function InvoiceDetailsPage({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const [invoice] = useState<InvoiceDetails>(MOCK_INVOICE); // In a real app, fetch using invoiceId

  const handleDownloadPdf = () => {
    alert(`Initiating PDF download for Invoice ${invoice.id}...`);
    // Actual PDF generation logic goes here (e.g., using a library or API call)
  };

  const handleRecordPayment = (method: PaymentMethod) => {
    alert(`Recorded ₹${invoice.total.toFixed(2)} payment via ${method}`);
    // API call to record payment
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      {/* Header and Actions */}
      <div className="flex justify-between items-center mb-6">
        <a
          href="/invoices"
          className="flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Invoices
        </a>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-medium text-sm"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Invoice Details) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Invoice #{invoice.id}
            </h1>
            <span className="px-4 py-2 bg-rose-100 text-rose-800 font-bold rounded-full">
              Overdue
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
            <div>
              <p className="text-gray-500">Billed To:</p>
              <p className="font-semibold text-gray-800">
                {invoice.customerName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">
                Invoice Date:{" "}
                <span className="font-semibold">{invoice.date}</span>
              </p>
              <p className="text-gray-500">
                Due Date:{" "}
                <span className="font-semibold text-rose-600">
                  {invoice.dueDate}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    Unit Price (₹)
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                      {item.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Amount Due:</span>
                <span className="text-rose-600">
                  ₹{(invoice.total - invoice.amountPaid).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Payment Options/Activity) */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-5 text-gray-900">
            Record Payment
          </h2>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                onClick={() => handleRecordPayment(method.value)}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-150"
              >
                <div className="flex items-center">
                  <method.icon size={20} className="text-blue-500 mr-3" />
                  <span className="font-medium text-sm">{method.label}</span>
                </div>
                <PlusCircle size={16} className="text-gray-400" />
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">Payment History</h3>
            <p className="text-sm text-gray-500">No payments recorded yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
