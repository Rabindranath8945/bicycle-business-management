"use client";
import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

export default function ProfitLossPage() {
  const [data, setData] = useState<any>({ income: 0, expense: 0, profit: 0 });
  useEffect(() => {
    /* TODO fetch */ setData({ income: 125000, expense: 82000, profit: 43000 });
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Profit & Loss</h2>
      <div className="bg-white/70 p-4 rounded-2xl shadow border grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4">
          <div className="text-sm text-gray-500">Income</div>
          <div className="text-xl font-semibold">
            ₹{data.income.toLocaleString()}
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500">Expense</div>
          <div className="text-xl font-semibold">
            ₹{data.expense.toLocaleString()}
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500">Net Profit</div>
          <div className="text-xl font-semibold">
            ₹{data.profit.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
