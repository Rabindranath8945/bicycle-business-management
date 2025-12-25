"use client";

import {
  ArrowLeft,
  History,
  Download,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

export default function SalesSummaryReportPage() {
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
            <History className="text-blue-600" size={24} /> Sales Summary Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              <Calendar size={16} /> Date Range: Dec 2025{" "}
              <ChevronDown size={14} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
            Monthly Performance (Dec 1-19, 2025)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Mock data for the report metrics */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Gross Sales</p>
              <p className="text-2xl font-bold text-gray-800">$45,200.00</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={12} /> +12% vs last month
              </p>
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Returns</p>
              <p className="text-2xl font-bold text-rose-600">-$1,800.00</p>
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <TrendingUp size={12} /> +5% vs last month
              </p>
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Net Sales</p>
              <p className="text-2xl font-bold text-gray-800">$43,400.00</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={12} /> +10% vs last month
              </p>
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Average Profit Margin</p>
              <p className="text-2xl font-bold text-green-700">42.5%</p>
              <p className="text-xs text-gray-500">Target: 40%</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4">
              Sales by Payment Mode
            </h3>
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                    Mode
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                    Total Value
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2">Cash</td>
                  <td className="px-4 py-2 text-right">$15,000.00</td>
                  <td className="px-4 py-2 text-right">34.6%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Bank Transfer</td>
                  <td className="px-4 py-2 text-right">$20,100.00</td>
                  <td className="px-4 py-2 text-right">46.3%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">EMI Finance</td>
                  <td className="px-4 py-2 text-right">$8,300.00</td>
                  <td className="px-4 py-2 text-right">19.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
