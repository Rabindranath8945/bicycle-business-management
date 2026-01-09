"use client";

import {
  ArrowLeft,
  CreditCard,
  Download,
  Calendar,
  ChevronDown,
  FileText,
} from "lucide-react";

export default function GstReportClient() {
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
            <CreditCard className="text-blue-600" size={24} /> GST/Tax Report
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Calendar size={16} /> Quarter 4 2025 <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition-colors">
            <Download size={16} /> Export GST Return (JSON/Excel)
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
            GST Liability Summary (Q4 2025)
          </h2>
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                  Tax Rate
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                  Taxable Value
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                  Total Tax Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-2">0% (Exempt)</td>
                <td className="px-4 py-2 text-right">$1,200.00</td>
                <td className="px-4 py-2 text-right">$0.00</td>
              </tr>
              <tr>
                <td className="px-4 py-2">18% GST</td>
                <td className="px-4 py-2 text-right">$35,500.00</td>
                <td className="px-4 py-2 text-right">$6,390.00</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2 text-right font-bold">$36,700.00</td>
                <td className="px-4 py-2 text-right font-bold">$6,390.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
