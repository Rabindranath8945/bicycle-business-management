"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialSummary() {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [30000, 40000, 35000, 42000, 50000, 54000],
        borderColor: "rgba(16,185,129,0.8)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Expenses",
        data: [20000, 25000, 23000, 27000, 26000, 30000],
        borderColor: "rgba(244,63,94,0.8)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Profit",
        data: [10000, 15000, 12000, 15000, 24000, 24000],
        borderColor: "rgba(59,130,246,0.9)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#64748b", boxWidth: 14, padding: 16 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "#e2e8f0" },
      },
    },
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-[900px] mx-auto"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h2 className="text-lg font-semibold mb-4">
        Financial Summary (Last 6 Months)
      </h2>
      <motion.div
        className="h-64"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Line data={chartData} options={chartOptions} />
      </motion.div>
    </motion.div>
  );
}
