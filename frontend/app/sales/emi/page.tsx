"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  FileText,
  DollarSign,
  Eye,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type SettlementStatus = "Pending" | "Settled" | "Partial";

interface EMISale {
  id: string;
  emiProvider: string;
  invoiceRef: string;
  customer: string;
  saleDate: string;
  amountFinanced: number;
  commissionRate: number; // Percentage
  commissionAmount: number;
  netSettlement: number;
  status: SettlementStatus;
}

const EMI_DATA: EMISale[] = [
  {
    id: "1",
    emiProvider: "Bajaj Finance",
    invoiceRef: "INV-9920",
    customer: "Ahmad Khan & Sons",
    saleDate: "2025-12-01",
    amountFinanced: 2500.0,
    commissionRate: 2.5,
    commissionAmount: 62.5,
    netSettlement: 2437.5,
    status: "Settled",
  },
  {
    id: "2",
    emiProvider: "HDFC Bank",
    invoiceRef: "INV-9945",
    customer: "Cycle Hub Wholesale",
    saleDate: "2025-12-10",
    amountFinanced: 1200.5,
    commissionRate: 1.8,
    commissionAmount: 21.61,
    netSettlement: 1178.89,
    status: "Pending",
  },
  {
    id: "3",
    emiProvider: "Bajaj Finance",
    invoiceRef: "INV-9980",
    customer: "John Doe Retail",
    saleDate: "2025-12-15",
    amountFinanced: 450.0,
    commissionRate: 2.5,
    commissionAmount: 11.25,
    netSettlement: 438.75,
    status: "Partial",
  },
];

export default function EMISalesList() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusClasses = (status: SettlementStatus) => {
    switch (status) {
      case "Settled":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-amber-100 text-amber-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      {/* --- TOP CONTROL PANEL --- */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center gap-3">
          <DollarSign className="text-blue-600" size={24} /> EMI Sales
          Management
        </h1>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-1 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition-colors">
            <Plus size={18} /> Add EMI Sale
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
                  placeholder="Search invoice ref, provider or customer..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <select className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                  <option>All Providers</option>
                  <option>Bajaj Finance</option>
                  <option>HDFC Bank</option>
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

          {/* EMI Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Invoice Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    EMI Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sale Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Financed Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Commission (MDR)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Net Settlement
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {EMI_DATA.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 cursor-pointer hover:underline">
                      {sale.invoiceRef}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {sale.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {sale.emiProvider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.saleDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      ${sale.amountFinanced.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">
                          ${sale.commissionAmount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({sale.commissionRate.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      ${sale.netSettlement.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                            getStatusClasses(sale.status)
                          )}
                        >
                          {sale.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Details"
                          className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye size={16} />
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
