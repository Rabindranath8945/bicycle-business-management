"use client";

import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  RefreshCcw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface ReturnLine {
  id: string;
  name: string;
  originalQty: number;
  returnQty: number;
  unitPrice: number;
  reason: string;
}

interface ExchangeLine {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export default function SalesReturnPage() {
  const [returnLines, setReturnLines] = useState<ReturnLine[]>([
    {
      id: "1",
      name: "Road Bike Frame - XL",
      originalQty: 2,
      returnQty: 1,
      unitPrice: 450.0,
      reason: "Defective",
    },
    {
      id: "2",
      name: "Shimano Gear Set",
      originalQty: 5,
      returnQty: 0,
      unitPrice: 85.0,
      reason: "Not Needed",
    },
  ]);

  const [adjustmentType, setAdjustmentType] = useState<
    "Refund" | "Exchange" | "Credit"
  >("Refund");

  const totalReturnVal = returnLines.reduce(
    (acc, line) => acc + line.returnQty * line.unitPrice,
    0
  );
  const totalExchangeVal = 0; // Simplified for the mock
  const netBalance = totalReturnVal - totalExchangeVal;

  return (
    <div className="flex flex-col h-screen bg-gray-100/50">
      {/* --- BLUE & GLASS HEADER --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Process Return: INV/2025/001
            </h1>
            <p className="text-xs text-gray-500">Ahmad Khan & Sons</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Toggle Group (Glassy effect) */}
          <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-blue-100 mr-4 shadow-inner">
            {(["Refund", "Exchange", "Credit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAdjustmentType(t)}
                className={cn(
                  "px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2",
                  adjustmentType === t
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50"
                )}
              >
                {t === "Exchange" ? (
                  <RefreshCcw size={14} />
                ) : (
                  <DollarSign size={14} />
                )}{" "}
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors font-medium">
            <CheckCircle2 size={16} /> Finalize Return
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 grid grid-cols-12 gap-8">
        {/* --- LEFT: ITEMS BEING RETURNED (Inventory In) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-blue-100 shadow-xl overflow-hidden">
            <div className="bg-blue-50/70 backdrop-blur-sm px-6 py-4 border-b border-blue-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-blue-800 flex items-center gap-3">
                <RotateCcw size={20} className="text-blue-600" /> Items for
                Credit Note
              </h2>
              <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                INBOUND LOGISTICS
              </span>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left">Product Description</th>
                  <th className="p-4 text-center">Original Qty</th>
                  <th className="p-4 text-center">Return Qty</th>
                  <th className="p-4 text-left">Reason Code</th>
                  <th className="p-4 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returnLines.map((line) => (
                  <tr
                    key={line.id}
                    className={cn(
                      "hover:bg-blue-50/50 transition-colors",
                      line.returnQty > 0 && "bg-blue-50/30"
                    )}
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {line.name}
                    </td>
                    <td className="p-4 text-center text-gray-400">
                      {line.originalQty}
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        max={line.originalQty}
                        min={0}
                        className="w-20 mx-auto block p-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center"
                        value={line.returnQty}
                        onChange={(e) => {
                          const val = Math.min(
                            line.originalQty,
                            Math.max(0, parseInt(e.target.value) || 0)
                          );
                          setReturnLines(
                            returnLines.map((l) =>
                              l.id === line.id ? { ...l, returnQty: val } : l
                            )
                          );
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <select className="text-xs border-blue-200 rounded-lg p-2 bg-white w-full">
                        <option>D1: Defective Product</option>
                        <option>W2: Wrong Item Shipped</option>
                        <option>C3: Customer Preference</option>
                      </select>
                    </td>
                    <td className="p-4 text-right font-semibold text-blue-700">
                      ${(line.returnQty * line.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-300 p-4 rounded-xl flex items-start gap-4">
            <Truck className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Automated Stock Adjustment Pending
              </p>
              <p className="text-xs text-blue-600">
                Finalizing this credit note will automatically update physical
                inventory counts in the main warehouse location.
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: SUMMARY & CREDIT NOTE GENERATION (Glass Card) --- */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Glass Card Summary */}
          <div className="bg-white/70 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Visual background element */}
            <Zap
              className="absolute -right-10 -bottom-10 text-blue-500/20"
              size={180}
            />
            <ShoppingCart
              className="absolute -top-10 -left-10 text-blue-500/20"
              size={180}
            />

            <h3 className="text-base font-bold uppercase tracking-wider text-blue-800 mb-5 flex items-center gap-3 relative z-10">
              <FileText size={18} /> Financial Summary
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Total Value of Returned Items:</span>
                <span className="font-mono text-blue-700 font-semibold">
                  + ${totalReturnVal.toFixed(2)}
                </span>
              </div>

              {adjustmentType === "Exchange" && (
                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                  <span>Value of Exchange Items:</span>
                  <span className="font-mono text-gray-500">
                    - ${totalExchangeVal.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="h-[1px] bg-blue-200 my-4" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">
                  Net{" "}
                  {adjustmentType === "Credit" ? "Credit Note" : "Balance Due"}:
                </span>
                <span className="text-3xl font-extrabold text-blue-600">
                  ${netBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-200/50 space-y-3 relative z-10">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <AlertCircle size={16} className="text-blue-500" />
                <span>
                  Generating formal Credit Note document upon validation.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
