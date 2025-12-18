"use client";

import {
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  ShoppingCart,
  Activity,
  Users,
} from "lucide-react";
import { useState } from "react";

// Sample data for sales history
const salesHistory = [
  {
    id: "TXN1001",
    date: "Dec 15, 2025",
    customer: "Tech Corp",
    amount: 4500.0,
    type: "Retail",
  },
  {
    id: "TXN1002",
    date: "Dec 14, 2025",
    customer: "John Doe",
    amount: 89.5,
    type: "Online",
  },
  {
    id: "TXN1003",
    date: "Dec 14, 2025",
    customer: "Sarah Smith",
    amount: 1200.0,
    type: "Retail",
  },
  // ... more data
];

export default function SalesHistoryPage() {
  const [sales] = useState(salesHistory);

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Sales History
        </h1>
      </div>

      {/* Filters and Search */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Sales List Table */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity size={20} /> Latest Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                {/* Updated this section to remove line breaks/whitespace between elements */}
                {["Transaction ID", "Date", "Customer", "Type", "Amount"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-gray-400" />
                      {sale.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                    ₹{sale.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
