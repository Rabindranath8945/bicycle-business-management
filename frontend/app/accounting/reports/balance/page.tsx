"use client";
import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

export default function BalanceSheet() {
  const [sheet, setSheet] = useState<any>({
    assets: 120000,
    liabilities: 70000,
    equity: 50000,
  });
  useEffect(() => {
    /* TODO fetch */
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Balance Sheet</h2>
      <div className="bg-white/70 p-4 rounded-2xl shadow border grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500">Assets</div>
          <div className="font-semibold">₹{sheet.assets.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Liabilities</div>
          <div className="font-semibold">
            ₹{sheet.liabilities.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Equity</div>
          <div className="font-semibold">₹{sheet.equity.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
