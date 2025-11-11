// frontend/components/ui/QuickActionButton.tsx
"use client";

import { motion } from "framer-motion";

export default function QuickActionButton({
  title,
  icon,
  color = "bg-emerald-500",
}: {
  title: string;
  icon?: React.ReactNode;
  color?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${color} text-white px-4 py-3 rounded-xl shadow-md flex items-center gap-3`}
    >
      {icon} <span className="font-semibold">{title}</span>
    </motion.button>
  );
}
