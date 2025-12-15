"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Search,
  RefreshCcw,
  FileDown,
  MessageCircle,
  Users,
  Building2,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function SupplierListPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      // FRONTEND-ONLY: Replace later with backend API
      const res = await fetcher("/api/suppliers").catch(() => []);
      setList(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  // SAFE FILTER
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    return list.filter((sobj) => {
      const name = (sobj.name || "").toLowerCase();
      const phone = (sobj.phone || "").toLowerCase();
      const gst = (sobj.gst || "").toLowerCase();

      const match = name.includes(s) || phone.includes(s) || gst.includes(s);

      if (filter === "all") return match;
      if (filter === "due") return sobj.dueAmount > 0 && match;
      if (filter === "cleared") return sobj.dueAmount === 0 && match;

      return true;
    });
  }, [q, filter, list]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-wide text-slate-800">
          Suppliers
        </h2>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center gap-2 text-slate-700 shadow"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <Link
            href="/suppliers/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
          >
            + New Supplier
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search supplier name / phone / GST..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border shadow bg-white/70 backdrop-blur"
          />
        </div>

        {/* FILTER */}
        <select
          className="p-2 rounded-lg border shadow bg-white/70 backdrop-blur"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="due">Due Only</option>
          <option value="cleared">Cleared</option>
        </select>
      </div>

      {/* LIST BODY */}
      <div className="bg-white/70 p-4 rounded-2xl shadow-xl border border-white/40 backdrop-blur">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No suppliers found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Outstanding</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s, idx) => (
                <motion.tr
                  key={s._id || idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b hover:bg-slate-50/60 transition"
                >
                  {/* Supplier Name */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <div>
                        <div className="font-medium">{s.name || "—"}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Building2 size={12} />
                          {s.company || "No company"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      {s.phone || "—"}
                    </div>
                  </td>

                  {/* GST */}
                  <td className="p-3 text-gray-700">{s.gst || "—"}</td>

                  {/* Due */}
                  <td className="p-3 font-semibold">
                    {s.dueAmount > 0 ? (
                      <span className="text-red-600">
                        ₹{s.dueAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-600">Cleared</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-3 text-right flex justify-end items-center gap-4">
                    {/* PDF Profile */}
                    <button
                      onClick={() =>
                        window.open(`/suppliers/pdf/${s._id}`, "_blank")
                      }
                      className="text-slate-700 hover:text-black flex items-center gap-1"
                    >
                      <FileDown size={16} /> PDF
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/${
                            s.phone
                          }?text=Hello%20${encodeURIComponent(
                            s.name
                          )},%20your%20supplier%20statement.`,
                          "_blank"
                        )
                      }
                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <MessageCircle size={16} /> Chat
                    </button>

                    {/* Details */}
                    <Link
                      href={`/suppliers/${s._id}`}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                    >
                      View <ArrowRight size={16} />
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
