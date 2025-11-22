"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiCog, HiLogout, HiUser } from "react-icons/hi";

interface ProfileDropdownProps {
  user?: {
    name?: string;
    avatar?: string;
    role?: string;
  } | null;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ---- MAKE USER STABLE (PREVENT RE-RENDER HOOK MISMATCH) ----
  const safeUser = {
    name: user?.name ?? "User",
    avatar: user?.avatar ?? null,
    role: user?.role ?? "User",
  };

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // role badge color
  const getRoleColor = (role?: string) => {
    const r = role?.toLowerCase() || "";
    if (r.includes("admin"))
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    if (r.includes("account"))
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    if (r.includes("cashier"))
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    if (r.includes("staff"))
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        aria-label="User menu"
      >
        {safeUser.avatar ? (
          <img
            src={safeUser.avatar}
            alt={safeUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
            {safeUser.name[0]?.toUpperCase()}
          </div>
        )}

        <div className="hidden sm:flex flex-col items-start text-left leading-tight">
          <span className="text-sm font-medium">{safeUser.name}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleColor(
              safeUser.role
            )}`}
          >
            {safeUser.role}
          </span>
        </div>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <div className="font-medium text-sm">{safeUser.name}</div>
              <div
                className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${getRoleColor(
                  safeUser.role
                )}`}
              >
                {safeUser.role}
              </div>
            </div>

            <div className="py-1">
              <a
                href="/settings/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <HiUser className="text-lg" />
                Profile
              </a>
              <a
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <HiCog className="text-lg" />
                Settings
              </a>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700">
              <button
                type="submit"
                onClick={logout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <HiLogout className="text-lg" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
