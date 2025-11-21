"use client";

import SummaryCard from "@/components/ui/SummaryCard";
import QuickActionButton from "@/components/ui/QuickActionButton";
import FinancialCharts from "@/components/dashboard/FinancialCharts";
import RecentLists from "@/components/dashboard/RecentLists";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import BalanceOverview from "@/components/dashboard/BalanceOverview";
import FinancialReportsOverview from "@/components/dashboard/FinancialReportsOverview";

import {
  HiTrendingUp,
  HiTrendingDown,
  HiCash,
  HiChartBar,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import Protected from "@/components/Protected";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetcher("/api/reports/dashboard")
      .then((res) => setSummary(res))
      .catch(() =>
        setSummary({
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          totalCashIn: 0,
          netProfit: 0,
        })
      );
  }, []);

  return (
    <Protected>
      <div className="w-full flex justify-center px-4 md:px-8 lg:px-10 overflow-x-hidden">
        <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-10">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Updated {new Date().toLocaleString()}
            </span>
          </div>

          {/* SUMMARY CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <SummaryCard
              title="Total Sales"
              value={summary?.totalSales || 0}
              icon={<HiTrendingUp />}
              color="green"
            />
            <SummaryCard
              title="Total Purchases"
              value={summary?.totalPurchases || 0}
              icon={<HiTrendingDown />}
              color="red"
            />
            <SummaryCard
              title="Expenses"
              value={summary?.totalExpenses || 0}
              icon={<HiTrendingDown />}
              color="orange"
            />
            <SummaryCard
              title="Cash In Hand"
              value={summary?.totalCashIn || 0}
              icon={<HiCash />}
              color="blue"
            />
            <SummaryCard
              title="Net Profit"
              value={summary?.netProfit || 0}
              icon={<HiChartBar />}
              color={(summary?.netProfit || 0) >= 0 ? "green" : "red"}
            />
          </section>

          {/* CHARTS AREA (Side by side) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
                Sales vs Purchases (Monthly)
              </h2>
              <div className="h-64 md:h-72 overflow-hidden">
                <FinancialCharts summary={summary} />
              </div>
            </div>

            <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
                Financial Summary
              </h2>
              <div className="h-64 md:h-72 overflow-hidden">
                <FinancialSummary />
              </div>
            </div>
            <div className="w-full">
              <BalanceOverview />
            </div>
            <div className="w-full">
              <FinancialReportsOverview />
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">
              Quick Actions
            </h2>
            <div className="w-full">
              {/* RECENT SALES + PRODUCTS + RECENT EXPENSES + REPORT */}
              <RecentLists />
            </div>
          </section>
        </div>
      </div>
    </Protected>
  );
}
