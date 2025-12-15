"use client";
import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { RefreshCcw } from "lucide-react";

export default function ExpensesPage() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    load();
  }, []);
  async function load() {
    try {
      /*setList(await fetcher('/api/expenses'))*/ setList([
        {
          _id: "e1",
          date: new Date().toISOString(),
          category: "Repair",
          amount: 1200,
          note: "Fix stand",
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 border rounded">
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white/70 p-4 rounded-2xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">₹{r.amount}</td>
                <td className="p-2">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
