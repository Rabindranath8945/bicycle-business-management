// frontend/components/ui/SummaryCard.tsx
"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function SummaryCard({
  title,
  value,
  icon,
  color = "green",
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    green: "text-emerald-500",
    red: "text-red-500",
    blue: "text-sky-600",
    orange: "text-orange-500",
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between"
    >
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {title}
        </div>
        <div className="text-2xl font-bold mt-1">
          <CountUp
            end={Number(value || 0)}
            duration={1.4}
            separator=","
            prefix="₹"
          />
        </div>
      </div>
      <div className={`text-3xl ${colorMap[color]}`}>{icon}</div>
    </motion.div>
  );
}
