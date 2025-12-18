"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  RotateCcw,
  Box,
  DollarSign,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

// --- Types and Mock Data ---

interface SaleItem {
  id: string;
  description: string;
  qtySold: number;
  price: number;
}

interface SalesInvoice {
  id: string;
  customerName: string;
  date: string;
  total: number;
  items: SaleItem[];
}

const MOCK_SALES_INVOICE: SalesInvoice = {
  id: "INV842004",
  customerName: "Jackson Balabala",
  date: "25th Jul 2021",
  total: 200.0,
  items: [
    {
      id: "item1",
      description: "Product A (SKU: 12345)",
      qtySold: 2,
      price: 50.0,
    },
    {
      id: "item2",
      description: "Product B (SKU: 67890)",
      qtySold: 1,
      price: 100.0,
    },
  ],
};

// --- Component ---

export default function SalesReturnPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(
    null
  );
  const [returnQuantities, setReturnQuantities] = useState<
    Record<string, number>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = () => {
    // In a real application, you would fetch data from an API
    // For this example, we mock a successful fetch for a specific ID
    if (searchTerm === MOCK_SALES_INVOICE.id) {
      setSelectedInvoice(MOCK_SALES_INVOICE);
      setReturnQuantities({});
    } else {
      setSelectedInvoice(null);
      alert(`Invoice ${searchTerm} not found.`);
    }
  };

  const handleQtyChange = (itemId: string, qty: number) => {
    setReturnQuantities((prev) => ({ ...prev, [itemId]: qty }));
  };

  const calculateRefund = useMemo(() => {
    if (!selectedInvoice) return 0;

    return selectedInvoice.items.reduce((total, item) => {
      const qtyToReturn = returnQuantities[item.id] || 0;
      return total + qtyToReturn * item.price;
    }, 0);
  }, [selectedInvoice, returnQuantities]);

  const processReturn = () => {
    if (calculateRefund === 0) {
      alert("Please specify items to return.");
      return;
    }
    setIsProcessing(true);
    // API call to process the return
    setTimeout(() => {
      alert(
        `Return processed for ₹${calculateRefund.toFixed(
          2
        )} refunded to customer ${selectedInvoice?.customerName}.`
      );
      setIsProcessing(false);
      setSelectedInvoice(null);
      setSearchTerm("");
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center">
          <RotateCcw className="mr-3 text-blue-600" /> Sales Return
        </h1>
        {selectedInvoice && (
          <button
            onClick={() => setSelectedInvoice(null)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition text-sm"
          >
            <ArrowLeft size={16} className="mr-1" /> Clear Invoice
          </button>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        {/* Step 1: Find Sale */}
        {!selectedInvoice ? (
          <div className="max-w-xl mx-auto text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              Find Original Sales Invoice
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Invoice ID (e.g., INV842004)"
                  className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          /* Step 2 & 3: Items and Process Return */
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Processing Return for Invoice #{selectedInvoice.id}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items List (2/3 width) */}
              <div className="md:col-span-2">
                <div className="border rounded-xl overflow-hidden">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Item Description",
                          "Sold",
                          "Price (₹)",
                          "Return Qty",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left font-medium text-gray-500"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-gray-900 flex items-center">
                            <Box size={16} className="mr-2 text-gray-400" />{" "}
                            {item.description}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                            {item.qtySold}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                            {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max={item.qtySold}
                              value={returnQuantities[item.id] || 0}
                              onChange={(e) =>
                                handleQtyChange(
                                  item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-24 p-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary & Action (1/3 width) */}
              <div className="md:col-span-1 h-fit">
                <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Refund Summary</h3>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-700">Total Refund Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{calculateRefund.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={processReturn}
                    disabled={calculateRefund === 0 || isProcessing}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition",
                      calculateRefund === 0 || isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
                    )}
                  >
                    <DollarSign size={18} />
                    {isProcessing ? "Processing..." : `Process Return`}
                  </button>
                  {calculateRefund === 0 && (
                    <p className="mt-3 text-xs text-center text-gray-500 flex items-center justify-center">
                      <AlertTriangle size={12} className="mr-1" /> Select items
                      to enable return.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
