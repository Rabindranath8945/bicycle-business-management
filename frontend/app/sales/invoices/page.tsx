"use client";

import { useState } from "react";
import {
  Plus,
  Receipt,
  DollarSign,
  AlertTriangle,
  Search,
  ChevronDown,
  Filter,
  MoreVertical,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// --- Types and Data (matching image data structure) ---
type InvoiceStatus = "Draft" | "Paid" | "Overdue";

interface Invoice {
  number: string;
  status: InvoiceStatus;
  date: string;
  customer: string;
  total: number;
  amountDue: number;
}

const INVOICE_DATA: Invoice[] = [
  {
    number: "INV842002",
    status: "Draft",
    date: "27th Jul 2021",
    customer: "Kim Girocking",
    total: 152.0,
    amountDue: 0.0,
  },
  {
    number: "INV842004",
    status: "Paid",
    date: "25th Jul 2021",
    customer: "Jackson Balabala",
    total: 200.0,
    amountDue: 0.0,
  },
  {
    number: "INV842005",
    status: "Paid",
    date: "20th Jul 2021",
    customer: "Claudia Emmay",
    total: 45.0,
    amountDue: 45.0,
  },
  {
    number: "INV842006",
    status: "Draft",
    date: "20th Jul 2021",
    customer: "Park Jo Soo",
    total: 430.0,
    amountDue: 0.0,
  },
  {
    number: "INV842007",
    status: "Overdue",
    date: "18th Jul 2021",
    customer: "Clarisa Hercules",
    total: 840.0,
    amountDue: 0.0,
  },
  {
    number: "INV842008",
    status: "Paid",
    date: "16th Jul 2021",
    customer: "Danny Satruman",
    total: 65.0,
    amountDue: 65.0,
  },
  {
    number: "INV842009",
    status: "Paid",
    date: "13th Jul 2021",
    customer: "El Khombo",
    total: 80.0,
    amountDue: 80.0,
  },
  {
    number: "INV842010",
    status: "Paid",
    date: "13th Jul 2021",
    customer: "Julia Hanjught",
    total: 95.0,
    amountDue: 95.0,
  },
  {
    number: "INV842012",
    status: "Paid",
    date: "13th Jul 2021",
    customer: "Bernad Johnson",
    total: 146.0,
    amountDue: 146.0,
  },
];

const getStatusClasses = (status: InvoiceStatus) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-800";
    case "Overdue":
      return "bg-rose-100 text-rose-800";
    case "Draft":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) => `US$${amount.toFixed(2)}`;

// --- Main Component ---

export default function InvoiceListPage() {
  const [invoices] = useState<Invoice[]>(INVOICE_DATA);

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      {/* Header and Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Invoices
        </h1>
        <a
          href="/invoices/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-medium text-sm"
        >
          <Plus size={18} /> Create an Invoice
        </a>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Overdue</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {formatCurrency(120.8)}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Due within next 30 days
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {formatCurrency(0.0)}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Average time to get paid
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            <span className="text-blue-600">24 days</span>
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Upcoming Payout</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">None</h2>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100">
              <Filter size={16} /> Filter
            </button>
            {/* These would be interactive tags in a real app */}
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs">
              Customer: Emma X
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs">
              Date: 12th-30th Jul 2021 X
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                {/* This approach is generally safer for standard JSX formatting */}
                {[
                  "Number",
                  "Status",
                  "Date",
                  "Customer",
                  "Total",
                  "Amount Due",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {header}
                      {header !== "Customer" && (
                        <ChevronDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.number}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-amber-400" />
                      <a
                        href={`/invoices/${invoice.number}`}
                        className="text-blue-600 hover:underline"
                      >
                        {invoice.number}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                        getStatusClasses(invoice.status)
                      )}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mr-3">
                        {invoice.customer.substring(0, 2)}
                      </div>
                      {invoice.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(invoice.amountDue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination/Footer */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Show{" "}
            <select className="border rounded-md mx-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>{" "}
            of 800 Results
          </p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Show More
          </button>
        </div>
      </div>
    </div>
  );
}
