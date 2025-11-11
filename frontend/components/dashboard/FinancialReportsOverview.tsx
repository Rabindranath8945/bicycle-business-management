"use client";

import { motion } from "framer-motion";
import {
  HiTrendingUp,
  HiTrendingDown,
  HiCash,
  HiChartPie,
} from "react-icons/hi";

export default function FinancialReportsOverview() {
  const metrics = [
    {
      title: "Sales Growth",
      value: "+12.4%",
      desc: "Compared to last month",
      icon: <HiTrendingUp className="text-emerald-500 text-2xl" />,
      color: "bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      title: "Expense Ratio",
      value: "41.8%",
      desc: "Total expense vs income",
      icon: <HiTrendingDown className="text-red-500 text-2xl" />,
      color: "bg-red-50 dark:bg-red-900/30",
    },
    {
      title: "Purchase/Sales %",
      value: "65.3%",
      desc: "Purchases relative to sales",
      icon: <HiChartPie className="text-blue-500 text-2xl" />,
      color: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      title: "Profit Margin",
      value: "28.2%",
      desc: "Average monthly profit",
      icon: <HiCash className="text-violet-500 text-2xl" />,
      color: "bg-violet-50 dark:bg-violet-900/30",
    },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-[900px] mx-auto mt-6"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-lg font-semibold mb-4">Financial Reports Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            className={`flex flex-col items-center justify-center text-center rounded-lg p-4 border border-slate-200 dark:border-slate-700 ${m.color}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-2">{m.icon}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {m.title}
            </div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {m.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
