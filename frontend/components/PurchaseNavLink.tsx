"use client";
import Link from "next/link";
export default function PurchasesNavLink() {
  return (
    <Link
      href="/purchases"
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
    >
      <svg
        className="w-4 h-4 text-amber-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M3 7h18M3 12h18M3 17h18"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Purchases</span>
    </Link>
  );
}
