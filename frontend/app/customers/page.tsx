"use client";
import React, { useEffect, useState, useMemo } from "react";
// import { fetcher } from "@/lib/api"; // Keep fetcher commented out for demo
import Link from "next/link";
import {
  Search,
  RefreshCcw,
  Plus,
  Users,
  DollarSign,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

// --- Types and Sample Data ---
interface CustomerAccount {
  _id: string;
  name: string;
  balance: number;
  lastInvoice: string | null;
}

const SAMPLE_DATA: CustomerAccount[] = [
  { _id: "c1", name: "John Doe", balance: 1200, lastInvoice: "INV-1001" },
  { _id: "c2", name: "Tech Corp", balance: -500, lastInvoice: "INV-1025" }, // Negative balance means they overpaid/have credit
  { _id: "c3", name: "Sarah Smith", balance: 0, lastInvoice: "INV-1030" },
  {
    _id: "c4",
    name: "Alpha Logistics",
    balance: 5400,
    lastInvoice: "INV-1045",
  },
];
// -----------------------------

export default function CustomerAccounts() {
  const [list, setList] = useState<CustomerAccount[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      /* In a real app: setList(await fetcher('/api/customers/ledger')) */
      setList(SAMPLE_DATA);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = useMemo(
    () =>
      list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q.toLowerCase()) ||
          String(c.balance || "").includes(q)
      ),
    [list, q]
  );

  const totalBalanceDue = useMemo(
    () => list.reduce((sum, c) => (c.balance > 0 ? sum + c.balance : sum), 0),
    [list]
  );
  const totalCustomers = list.length;

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Customer Accounts
        </h1>
        <div className="flex gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-medium text-sm"
            disabled={loading}
          >
            <RefreshCcw size={16} className={cn(loading && "animate-spin")} />{" "}
            {loading ? "Loading..." : "Refresh Data"}
          </button>
          <Link
            href="/customers/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-medium text-sm"
          >
            <Plus size={18} /> New Customer
          </Link>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Users size={24} className="text-blue-500 mb-2" />
          <p className="text-sm font-medium text-gray-500">Total Customers</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {totalCustomers}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <DollarSign size={24} className="text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-gray-500">Total Receivables</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            ₹{totalBalanceDue.toLocaleString()}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <List size={24} className="text-purple-500 mb-2" />
          <p className="text-sm font-medium text-gray-500">
            Accounts with Balance
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {list.filter((c) => c.balance !== 0).length}
          </h2>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            className="pl-12 p-3 w-full rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Search customer name or balance..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Customer Accounts Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Whitespace removed for hydration compliance */}
                {["Customer", "Balance", "Last Invoice", ""].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-6 whitespace-nowrap font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="p-6 whitespace-nowrap">
                    <span
                      className={cn(
                        "font-bold",
                        c.balance > 0
                          ? "text-rose-600"
                          : c.balance < 0
                          ? "text-emerald-600"
                          : "text-gray-500"
                      )}
                    >
                      ₹
                      {(c.balance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="p-6 whitespace-nowrap text-gray-500">
                    {c.lastInvoice || "—"}
                  </td>
                  <td className="p-6 whitespace-nowrap text-right">
                    <Link
                      href={`/customers/${c._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <p className="text-center py-12 text-gray-500">
              No matching customer accounts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
