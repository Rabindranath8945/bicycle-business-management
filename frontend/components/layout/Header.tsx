// frontend/components/layout/Header.tsx
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

type Notification = {
  id: string;
  title: string;
  body?: string;
  time?: string;
  read?: boolean;
};

export default function Header() {
  const { toggleMobile } = useLayout();
  const [dark, setDark] = useState<boolean>(false);
  const [user, setUser] = useState<{
    name?: string;
    avatar?: string;
    role?: string;
  } | null>(null);

  // date & time
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Notifications (sample data; replace with fetch call if you have API)
  const [notifications, setNotifications] = useState<Notification[]>([
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

  useEffect(() => {
    // try to fetch logged-in user info from backend
    fetcher("/api/users/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // dropdown states
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // search input ref
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // keyboard shortcuts: Ctrl/Cmd + K to open search, Esc to close modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setSearchOpen((s) => {
          const next = !s;
          if (!next) return false;
          // open and focus
          setTimeout(() => searchInputRef.current?.focus(), 50);
          return true;
        });
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setQuickAddOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // mark notification read
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // simple actions for quick add (replace navigation with router as needed)
  const handleQuickAdd = (type: "sale" | "purchase" | "expense") => {
    // navigate to creation page or open modal
    if (type === "sale") window.location.href = "/sales/new";
    if (type === "purchase") window.location.href = "/purchases/new";
    if (type === "expense") window.location.href = "/expenses/new";
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-3 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between gap-4">
        {/* LEFT: hamburger + title/breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
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

        {/* CENTER: search (hidden on very small screens) */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <div
              className="relative hidden sm:block"
              aria-hidden={searchOpen ? "false" : "true"}
            >
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="w-full text-left bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 hover:shadow-sm transition"
                aria-label="Open search"
              >
                <HiSearch className="text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Search products, invoices, customers...{" "}
                  <span className="ml-2 text-xs text-slate-400">⌘K</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: utilities */}
        <div className="flex items-center gap-3">
          {/* Quick Add */}
          <div className="relative">
            <button
              onClick={() => {
                setQuickAddOpen((s) => !s);
                setNotifOpen(false);
              }}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 border border-slate-100 dark:border-slate-800"
              aria-haspopup="true"
              aria-expanded={quickAddOpen}
              aria-label="Quick add"
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
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Add Sale
                  </button>
                  <button
                    onClick={() => handleQuickAdd("purchase")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Add Purchase
                  </button>
                  <button
                    onClick={() => handleQuickAdd("expense")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
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
              aria-haspopup="true"
              aria-expanded={notifOpen}
              aria-label="Notifications"
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
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="font-medium text-sm">Notifications</div>
                    <button
                      onClick={markAllRead}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-slate-100 dark:border-slate-700 ${
                          n.read ? "opacity-80" : ""
                        }`}
                      >
                        <div className="font-medium text-sm">{n.title}</div>
                        {n.body && (
                          <div className="text-xs text-slate-500 mt-1">
                            {n.body}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 mt-1">
                          {n.time}
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-3 text-sm text-slate-500">
                        No notifications
                      </div>
                    )}
                  </div>

                  <div className="p-2 text-center">
                    <a
                      href="/notifications"
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      View all
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {dark ? (
              <HiSun className="text-xl text-yellow-400" />
            ) : (
              <HiMoon className="text-xl" />
            )}
          </button>

          {/* Profile */}
          <ProfileDropdown user={{ ...user, role: user?.role ?? "Admin" }} />
        </div>
      </div>

      {/* Search modal / command palette */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50"
            >
              <div className="flex items-center gap-2 p-3">
                <HiSearch className="text-slate-400" />
                <input
                  ref={searchInputRef}
                  className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                  placeholder="Search products, invoices, customers... (Press Esc to close)"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <HiX />
                </button>
              </div>

              {/* sample quick results (replace with real search results) */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                <div className="text-sm text-slate-500">Recent searches</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button className="text-left text-sm px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded">
                    INV-1004
                  </button>
                  <button className="text-left text-sm px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded">
                    Mountain X1
                  </button>
                  <button className="text-left text-sm px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded">
                    Customer: Ravi
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
