"use client";
import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

export default function CashBankPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  useEffect(() => {
    /* TODO: fetch */ setAccounts([
      { id: "acc1", name: "Cash", balance: 42000 },
      { id: "acc2", name: "Bank", balance: 150000 },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cash & Bank</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((a) => (
          <div key={a.id} className="bg-white/70 p-4 rounded-2xl shadow border">
            <div className="text-sm text-gray-500">{a.name}</div>
            <div className="text-xl font-semibold mt-2">
              ₹{a.balance.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
