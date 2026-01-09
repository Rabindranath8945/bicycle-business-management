"use client";

import {
  ArrowLeft,
  User,
  Download,
  Calendar,
  ChevronDown,
  DollarSign,
} from "lucide-react";

export default function CustomerReportClient() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900 font-sans pb-12">
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center gap-3">
            <User className="text-blue-600" size={24} /> Customer Sales Report
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Calendar size={16} /> Last Year <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition-colors">
            <Download size={16} /> Export (CSV)
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
            Top 10 Customers by Revenue (YTD)
          </h2>
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                  Total Invoices
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                  Total Purchase Value
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                  Avg Invoice Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-2 font-medium">Ahmad Khan & Sons</td>
                <td className="px-4 py-2 text-sm text-gray-500">12</td>
                <td className="px-4 py-2 text-right font-semibold">
                  $24,500.00
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  $2,041.67
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Cycle Hub Wholesale</td>
                <td className="px-4 py-2 text-sm text-gray-500">8</td>
                <td className="px-4 py-2 text-right font-semibold">
                  $15,200.00
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  $1,900.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
