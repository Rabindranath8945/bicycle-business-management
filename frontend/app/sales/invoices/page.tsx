"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Printer,
  Calendar,
  ChevronDown,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types matching Odoo-style data
type SaleType = "Retail" | "Wholesale" | "Cycle";
type InvoiceStatus = "Draft" | "Posted" | "Cancelled";
type PaymentStatus = "Paid" | "Not Paid" | "Partial";

interface Invoice {
  id: string;
  number: string;
  date: string;
  customer: string;
  type: SaleType;
  paymentMode: string;
  total: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
}

const INVOICE_DATA: Invoice[] = [
  {
    id: "1",
    number: "INV/2025/001",
    date: "2025-12-19",
    customer: "Ahmad Khan & Sons",
    type: "Wholesale",
    paymentMode: "Bank Transfer",
    total: 1250.0,
    status: "Posted",
    paymentStatus: "Paid",
  },
  {
    id: "2",
    number: "INV/2025/002",
    date: "2025-12-18",
    customer: "Cycle Hub Ltd.",
    type: "Cycle",
    paymentMode: "Cash",
    total: 450.0,
    status: "Posted",
    paymentStatus: "Partial",
  },
  {
    id: "3",
    number: "INV/2025/003",
    date: "2025-12-18",
    customer: "John Doe Retail",
    type: "Retail",
    paymentMode: "UPI",
    total: 85.0,
    status: "Draft",
    paymentStatus: "Not Paid",
  },
  {
    id: "4",
    number: "INV/2025/004",
    date: "2025-12-17",
    customer: "Modern Traders Inc.",
    type: "Wholesale",
    paymentMode: "Credit",
    total: 3200.0,
    status: "Posted",
    paymentStatus: "Not Paid",
  },
];

export default function SalesInvoiceList() {
  const [search, setSearch] = useState("");

  const getStatusClasses = (status: InvoiceStatus) => {
    switch (status) {
      case "Posted":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-rose-100 text-rose-800";
      case "Draft":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusClasses = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-green-500";
      case "Partial":
        return "bg-yellow-500";
      case "Not Paid":
        return "bg-red-500";
    }
  };

  return (
    // Background color matches theme image
    <div className="flex flex-col h-screen bg-gray-50/50">
      {/* --- TOP CONTROL PANEL --- */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Sales Invoices
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download size={16} /> Export
          </button>
          {/* Primary Blue Button matches theme image */}
          <button className="flex items-center gap-1 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition-colors">
            <Plus size={18} /> Add Invoice
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Filters and Search Bar Section (matches image style) */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoice number, customer or ID..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <select className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                  <option>All Statuses</option>
                  <option>Posted</option>
                  <option>Draft</option>
                  <option>Cancelled</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <Filter size={16} /> Filter <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <Calendar size={16} /> Date Range <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment Mode
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {INVOICE_DATA.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 cursor-pointer hover:underline">
                      {inv.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {inv.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inv.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-600">
                        {inv.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {inv.paymentMode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      ${inv.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {/* Matches status badge style in image */}
                        <span
                          className={cn(
                            "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                            getStatusClasses(inv.status)
                          )}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center">
                        {/* Matches status dot style in image */}
                        <span
                          className={cn(
                            "h-2 w-2 inline-block rounded-full shadow-inner",
                            getPaymentStatusClasses(inv.paymentStatus)
                          )}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Action buttons matching image style */}
                        <button
                          title="View"
                          className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Print"
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          title="More Actions"
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
