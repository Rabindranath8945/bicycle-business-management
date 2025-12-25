"use client";

import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Layers,
  User,
  Package,
  TrendingUp,
  CreditCard,
  History,
  ChevronRight,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const reportCards: ReportCardProps[] = [];

export default function SalesReportsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900 font-sans pb-12">
      {/* --- TOP CONTROL PANEL --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center gap-3">
          <FileText className="text-blue-600" size={24} /> Sales Reports
        </h1>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download size={16} /> Export Master Data
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Total Sales (MTD)
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">$45,200.00</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Total Profit (MTD)
            </p>
            <p className="text-3xl font-bold text-green-600 mt-1">$18,500.00</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Average Invoice Value
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">$240.50</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Open Returns
            </p>
            <p className="text-3xl font-bold text-amber-500 mt-1">14</p>
          </div>
        </div>

        {/* Report Navigation Links */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Available Reports
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 bg-gray-50 rounded-lg group-hover:bg-blue-100",
                      card.color
                    )}
                  >
                    <card.icon size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {card.title}
                    </p>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                </div>
                <ChevronRight
                  className="text-gray-400 group-hover:text-blue-600"
                  size={20}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
