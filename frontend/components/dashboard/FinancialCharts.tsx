"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FinancialCharts({ summary }: any) {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12000, 15000, 14000, 18000, 17000, summary?.totalSales || 0],
        backgroundColor: "rgba(16,185,129,0.8)",
      },
      {
        label: "Purchases",
        data: [8000, 9000, 8500, 10000, 9500, summary?.totalPurchases || 0],
        backgroundColor: "rgba(244,63,94,0.8)",
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        Sales vs Purchases (Monthly)
      </h2>
      <Bar data={chartData} />
    </div>
  );
}
