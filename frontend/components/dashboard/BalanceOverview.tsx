"use client";

import { motion } from "framer-motion";
import {
  HiTrendingUp,
  HiTrendingDown,
  HiCash,
  HiChartBar,
} from "react-icons/hi";

export default function BalanceOverview() {
  const balances = [
    {
      title: "Total Revenue",
      value: "₹4,12,000",
      change: "+8%",
      desc: "Compared to last month",
      icon: <HiTrendingUp className="text-emerald-500 text-2xl" />,
      color: "bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      title: "Total Expenses",
      value: "₹2,80,000",
      change: "-2%",
      desc: "Compared to last month",
      icon: <HiTrendingDown className="text-red-500 text-2xl" />,
      color: "bg-red-50 dark:bg-red-900/30",
    },
    {
      title: "Net Profit",
      value: "₹1,32,000",
      change: "+5%",
      desc: "Compared to last month",
      icon: <HiChartBar className="text-emerald-500 text-2xl" />,
      color: "bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      title: "Cash on Hand",
      value: "₹58,400",
      change: "+3%",
      desc: "Compared to last month",
      icon: <HiCash className="text-violet-500 text-2xl" />,
      color: "bg-violet-50 dark:bg-violet-900/30",
    },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-[900px] mx-auto mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold mb-4">Balance Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/30"
          >
            <div className="mb-2">{b.icon}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {b.title}
            </div>
            <div className="text-xl font-bold mt-1">{b.value}</div>
            <div
              className={`text-sm mt-1 ${
                b.change.startsWith("+") ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {b.change}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {b.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
