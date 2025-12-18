"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Edit2,
  FileText,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// --- Types and Mock Data ---

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
  totalInvoices: number;
  balance: number;
}

const MOCK_CUSTOMER: Customer = {
  id: "c1",
  name: "John Doe",
  email: "john.doe@techcorp.com",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Lane, Innovation City, CA 90210",
  totalSpent: 60000.0,
  totalInvoices: 42,
  balance: 1200.0, // Amount currently owed (receivable)
};

// --- Component ---
// Updated to accept 'params' which contains 'id' from the URL
export default function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // CRITICAL FIX: Use React.use() to safely unwrap the params promise
  const unwrappedParams = React.use(params);
  const customerId = unwrappedParams.id;

  // For this mock, we just use the fixed mock data regardless of the ID
  const [customer] = useState<Customer>(MOCK_CUSTOMER);

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      {/* Header and Actions */}
      <div className="flex justify-between items-center mb-6">
        <a
          href="/customers"
          className="flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Accounts
        </a>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-medium text-sm">
            <Edit2 size={16} /> Edit Customer
          </button>
          <Link
            href={`/invoices/create?customerId=${customer.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-medium text-sm"
          >
            <FileText size={16} /> Create Invoice
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {customer.name.substring(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {customer.name}
            </h1>
            {/* Displaying the ID passed from the URL params */}
            <p className="text-gray-500">Customer ID from URL: {customerId}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area: KPIs, Details, Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Details & Activity) */}
        <div className="lg:col-span-2 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <ShoppingCart size={24} className="text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-500">
                Total Sales Volume
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                ₹{customer.totalSpent.toLocaleString()}
              </h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <FileText size={24} className="text-purple-500 mb-2" />
              <p className="text-sm font-medium text-gray-500">
                Total Invoices
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {customer.totalInvoices}
              </h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <DollarSign size={24} className="text-rose-500 mb-2" />
              <p className="text-sm font-medium text-gray-500">
                Current Balance Due
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                ₹{customer.balance.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Recent Invoices/Activity Table */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-5 text-gray-900">
              Recent Invoices
            </h2>
            <div className="space-y-4">
              {[
                {
                  id: "INV-1045",
                  date: "Dec 10, 2025",
                  amount: 5400,
                  status: "Draft",
                },
                {
                  id: "INV-1030",
                  date: "Nov 28, 2025",
                  amount: 3200,
                  status: "Paid",
                },
                {
                  id: "INV-1025",
                  date: "Nov 15, 2025",
                  amount: 4500,
                  status: "Paid",
                },
              ].map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {invoice.id}
                    </Link>
                    <p className="text-xs text-gray-500">{invoice.date}</p>
                  </div>
                  <span
                    className={`font-bold ${
                      invoice.status === "Paid"
                        ? "text-emerald-600"
                        : "text-gray-600"
                    }`}
                  >
                    ₹{invoice.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all invoices
            </button>
          </div>
        </div>

        {/* Right Column (Contact Details) */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-5 text-gray-900">
            Contact Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-500" />
              <p className="text-sm">{customer.name}</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-500" />
              <p className="text-sm">{customer.email}</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={20} className="text-gray-500" />
              <p className="text-sm">{customer.phone}</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin
                size={20}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm">{customer.address}</p>
            </div>
          </div>

          <button className="mt-6 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700">
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
