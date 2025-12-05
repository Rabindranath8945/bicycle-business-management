"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { Search, ChevronRight, Package, Users } from "lucide-react";

export default function GRNListPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetcher("/api/grn");
      setList(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load GRN");
    } finally {
      setLoading(false);
    }
  }

  const filtered = list.filter((g) => {
    return (
      g.grnNumber?.toLowerCase().includes(query.toLowerCase()) ||
      g.supplier?.name?.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Goods Received Notes
        </h2>

        <Link
          href="/purchases/grn/receive-grn"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition"
        >
          + Receive GRN
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          placeholder="Search GRN#, supplier name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-xl bg-white/70 backdrop-blur shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white/70 p-4 rounded-2xl shadow-xl border border-white/40 backdrop-blur">
        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No GRN found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">GRN#</th>
                <th className="text-left">Supplier</th>
                <th className="text-left">Items</th>
                <th className="text-left">Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((g, idx) => (
                <motion.tr
                  key={g._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b hover:bg-slate-50/60 transition cursor-pointer"
                >
                  <td className="py-3 font-medium">{g.grnNumber}</td>

                  {/* Supplier */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      <span>
                        {g.supplier?.name
                          ? g.supplier.name
                          : typeof g.supplier === "string"
                          ? g.supplier
                          : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Items Count */}
                  <td>
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-gray-500" />
                      {g.items?.length || 0} items
                    </div>
                  </td>

                  {/* Date */}
                  <td className="text-gray-600">
                    {new Date(g.receivedAt || g.createdAt).toLocaleString()}
                  </td>

                  {/* Action */}
                  <td className="text-right">
                    <Link
                      href={`/purchases/grn/${g._id}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View <ChevronRight size={18} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
