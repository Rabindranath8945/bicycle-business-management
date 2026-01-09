"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  RefreshCcw,
  FileDown,
  MessageCircle,
  Users,
  Building2,
  Phone,
  ArrowUpRight,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
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
      const res = await fetcher("/api/suppliers").catch(() => []);
      setList(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    return list.filter((sobj) => {
      const name = (sobj.name || "").toLowerCase();
      const phone = (sobj.phone || "").toLowerCase();
      const gst = (sobj.gst || "").toLowerCase();
      const match = name.includes(s) || phone.includes(s) || gst.includes(s);

      if (filter === "all") return match;
      if (filter === "due") return sobj.dueAmount > 0 && match;
      if (filter === "cleared")
        return (sobj.dueAmount === 0 || !sobj.dueAmount) && match;
      return true;
    });
  }, [q, filter, list]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* TOP SECTION: Header & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Users className="text-indigo-600" size={32} />
              Supplier Network
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Manage {list.length} procurement partners and outstanding
              liabilities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              href="/suppliers/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100"
            >
              <Plus size={20} /> Add Partner
            </Link>
          </div>
        </div>

        {/* SEARCH & FILTER STRIP */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              placeholder="Search by name, phone or GST number..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {["all", "due", "cleared"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === f
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DATA TABLE / GRID */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Synchronizing Database...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users size={48} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-500 font-bold">
                No suppliers match your criteria
              </p>
              <button
                onClick={() => {
                  setQ("");
                  setFilter("all");
                }}
                className="text-indigo-600 text-sm font-semibold mt-2 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                    <th className="px-6 py-4">Partner Identity</th>
                    <th className="px-6 py-4">Contact Detail</th>
                    <th className="px-6 py-4">Tax ID (GST)</th>
                    <th className="px-6 py-4">Financial Status</th>
                    <th className="px-6 py-4 text-right">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filtered.map((s, idx) => (
                      <motion.tr
                        key={s._id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                              {s.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">
                                {s.name || "Unnamed Partner"}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Building2
                                  size={12}
                                  className="text-slate-300"
                                />
                                {s.company || "Individual Supplier"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                              <Phone size={12} className="text-slate-400" />
                              {s.phone || "No Phone"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1">
                              Primary Contact
                            </span>
                          </div>
                        </td>

                        {/* GST */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                            {s.gst || "UNREGISTERED"}
                          </span>
                        </td>

                        {/* Financial Status */}
                        <td className="px-6 py-4">
                          {s.dueAmount > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-rose-600">
                                ₹{s.dueAmount.toLocaleString("en-IN")}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-tighter mt-1">
                                <AlertCircle size={10} /> Outstanding
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-emerald-600">
                                CLEARED
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter mt-1">
                                <CheckCircle2 size={10} /> No Liabilities
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                window.open(`/suppliers/pdf/${s._id}`, "_blank")
                              }
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Download Statement"
                            >
                              <FileDown size={18} />
                            </button>
                            <button
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${s.phone}`,
                                  "_blank"
                                )
                              }
                              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                              title="WhatsApp Chat"
                            >
                              <MessageCircle size={18} />
                            </button>
                            <Link
                              href={`/suppliers/${s._id}`}
                              className="ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1"
                            >
                              DETAILS <ArrowUpRight size={12} />
                            </Link>
                          </div>
                          {/* Mobile Action Trigger */}
                          <div className="md:hidden flex justify-end">
                            <MoreVertical
                              size={20}
                              className="text-slate-400"
                            />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
          <p className="text-[11px] text-slate-400 font-medium">
            © 2026 MANDAL CYCLE ENTERPRISE ERP • CLOUD SYNC ACTIVE
          </p>
          <div className="flex gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500" /> Payables
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Reliable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
