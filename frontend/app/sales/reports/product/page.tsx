import {
  ArrowLeft,
  Package,
  Download,
  Calendar,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

export default function SalesProductReportPage() {
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
            <Package className="text-blue-600" size={24} /> Product Performance
            Report
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Calendar size={16} /> Last 90 Days <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition-colors">
            <Download size={16} /> Export (CSV)
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
            Top 10 Selling Products by Quantity
          </h2>
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                  Product Name
                </th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                  Category
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                  Quantity Sold
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                  Total Sales Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-2 font-medium">Mountain Bike X1</td>
                <td className="px-4 py-2 text-sm text-gray-500">Bikes</td>
                <td className="px-4 py-2 text-right">45 units</td>
                <td className="px-4 py-2 text-right font-semibold">
                  $12,000.00
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Repair Kit Basic</td>
                <td className="px-4 py-2 text-sm text-gray-500">Tools</td>
                <td className="px-4 py-2 text-right">120 units</td>
                <td className="px-4 py-2 text-right font-semibold">$450.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
