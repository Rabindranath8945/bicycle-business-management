"use client";
import Link from "next/link";

export default function WorkflowCard({ title, desc, href, icon }: any) {
  return (
    <Link
      href={href}
      className="block bg-white/80 backdrop-blur rounded-2xl p-4 shadow border border-white/30 hover:shadow-lg transform hover:-translate-y-1 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-lg font-semibold mt-1">{desc}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </Link>
  );
}
