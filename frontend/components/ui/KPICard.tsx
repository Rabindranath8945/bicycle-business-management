"use client";
import React from "react";

export default function KPICard({ title, value, sub, icon, sparkData }: any) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white/30 flex flex-col justify-between hover:shadow-md transform hover:-translate-y-0.5 transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      {sparkData && (
        <div className="mt-3 h-8">
          <Sparkline data={sparkData} />
        </div>
      )}
      <div className="text-xs text-gray-400 mt-3">{sub}</div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const W = 160,
    H = 30;
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <polyline
        points={points}
        fill="none"
        stroke="#fb923c"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
