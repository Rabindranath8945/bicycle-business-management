"use client";

import { useEffect, useRef, useState } from "react";
import {
  HiBell,
  HiMenu,
  HiMoon,
  HiSun,
  HiPlus,
  HiSearch,
  HiX,
} from "react-icons/hi";
import { useLayout } from "./LayoutContext";
import ProfileDropdown from "./ProfileDropdown";
import { fetcher } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { toggleMobile } = useLayout();

  // ----- ALL HOOKS AT TOP (SAFE) -----
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    avatar?: string;
    role?: string;
  } | null>(null);

  const [now, setNow] = useState(new Date());
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Sale completed (INV-1004)",
      body: "₹ 2,300 — Geeta",
      time: "2m",
      read: false,
    },
    {
      id: "n2",
      title: "Low stock: Mountain X1",
      body: "Only 2 left",
      time: "1h",
      read: false,
    },
    {
      id: "n3",
      title: "Backup completed",
      body: "Daily backup finished",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // ----- FETCH USER (SAFE, DOESN’T CHANGE HOOK ORDER) -----
  useEffect(() => {
    fetcher("/api/auth/me")
      .then((data) => setUser(data || null))
      .catch(() => setUser(null));
  }, []);

  // ----- CLOCK -----
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ----- KEYBOARD SHORTCUTS -----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setSearchOpen((prev) => {
          const next = !prev;
          if (next) setTimeout(() => searchInputRef.current?.focus(), 50);
          return next;
        });
      }
      if (e.key === "Escape") {
        setNotifOpen(false);
        setQuickAddOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ----- MARK ALL READ -----
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ----- QUICK ADD -----
  const handleQuickAdd = (type: "sale" | "purchase" | "expense") => {
    if (type === "sale") router.push("/sales/new");
    if (type === "purchase") router.push("/purchases/new");
    if (type === "expense") router.push("/expenses/new");
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-3 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HiMenu className="text-xl" />
          </button>

          <div className="flex flex-col">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {now.toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {now.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <div className="hidden sm:block">
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="w-full text-left bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 hover:shadow-sm transition"
              >
                <HiSearch className="text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Search products, invoices…{" "}
                  <span className="ml-2 text-xs">⌘K</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Quick Add */}
          <div className="relative">
            <button
              onClick={() => {
                setQuickAddOpen((s) => !s);
                setNotifOpen(false);
              }}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 border border-slate-100 dark:border-slate-800"
            >
              <HiPlus className="text-lg" />
              <span className="hidden sm:inline text-sm">Add</span>
            </button>

            <AnimatePresence>
              {quickAddOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  <button
                    onClick={() => handleQuickAdd("sale")}
                    className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Add Sale
                  </button>
                  <button
                    onClick={() => handleQuickAdd("purchase")}
                    className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Add Purchase
                  </button>
                  <button
                    onClick={() => handleQuickAdd("expense")}
                    className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Add Expense
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((s) => !s);
                setQuickAddOpen(false);
              }}
              className="relative p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <HiBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                >
                  {/* Notifications UI stays same */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? (
              <HiSun className="text-xl text-yellow-400" />
            ) : (
              <HiMoon className="text-xl" />
            )}
          </button>

          {/* Profile */}
          <ProfileDropdown user={user ?? undefined} />
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          >
            {/* same modal, no change */}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
