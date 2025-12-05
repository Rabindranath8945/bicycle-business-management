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

  // -------------------------
  //   HOOK STATE
  // -------------------------
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [now, setNow] = useState(new Date());

  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------
  //   NOTIFICATIONS
  // -------------------------
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
      title: "Low stock alert",
      body: "Only 2 left in Mountain X1",
      time: "1h",
      read: false,
    },
    {
      id: "n3",
      title: "Backup completed",
      body: "Auto-backup done",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  // -------------------------
  //   FETCH USER
  // -------------------------
  useEffect(() => {
    fetcher("/api/auth/me")
      .then((data) => setUser(data || null))
      .catch(() => setUser(null));
  }, []);

  // -------------------------
  //   CLOCK
  // -------------------------
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // -------------------------
  //   SAVE THEME (NEW)
  // -------------------------
  useEffect(() => {
    const stored = localStorage.getItem("theme-dark");
    if (stored === "true") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme-dark", dark.toString());
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // -------------------------
  //   KEYBOARD SHORTCUTS
  // -------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // search modal
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }

      // notifications panel
      if ((e.metaKey || e.ctrlKey) && key === "/") {
        e.preventDefault();
        setNotifOpen((prev) => !prev);
      }

      // quick add menu
      if ((e.metaKey || e.ctrlKey) && key === "+") {
        e.preventDefault();
        setQuickAddOpen((prev) => !prev);
      }

      // close all
      if (key === "escape") {
        setNotifOpen(false);
        setQuickAddOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // -------------------------
  //   GLOBAL SEARCH (NEW)
  // -------------------------
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // mock search — replace with API
    const data = [
      { type: "Product", name: "Hero Cycle", id: 1 },
      { type: "Customer", name: "Ramesh", id: 2 },
      { type: "Invoice", name: "INV-1040", id: 3 },
      { type: "Supplier", name: "Rama Enterprise", id: 4 },
    ];

    const results = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  }, [searchQuery]);

  // -------------------------
  //   QUICK ADD HANDLER
  // -------------------------
  const handleQuickAdd = (type: string) => {
    const routeMap: any = {
      sale: "/sales/new",
      purchase: "/purchases/new",
      expense: "/expenses/new",
      customer: "/customers/new",
      supplier: "/suppliers/new",
      product: "/products/new",
    };

    if (routeMap[type]) router.push(routeMap[type]);
  };

  // ============================================================
  //   UI SECTION — NO DESIGN CHANGES
  // ============================================================

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
          {/* QUICK ADD — enhanced */}
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
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  {[
                    "sale",
                    "purchase",
                    "expense",
                    "customer",
                    "supplier",
                    "product",
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleQuickAdd(t)}
                      className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 capitalize text-left"
                    >
                      Add {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* NOTIFICATIONS — improved UI */}
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
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button
                      onClick={markAllRead}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b last:border-none ${
                          n.read
                            ? "bg-white dark:bg-slate-800"
                            : "bg-slate-50 dark:bg-slate-900/30"
                        }`}
                      >
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {n.body}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* THEME */}
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

          {/* PROFILE */}
          <ProfileDropdown user={user ?? undefined} />
        </div>
      </div>

      {/* SEARCH MODAL — new results system */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          >
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-4">
              <div className="flex items-center gap-2">
                <HiSearch className="text-slate-400" />
                <input
                  ref={searchInputRef}
                  className="w-full bg-transparent outline-none px-3 py-2 text-sm"
                  placeholder="Search products, invoices, customers..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <HiX />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-3 max-h-64 overflow-y-auto border-t border-slate-200 dark:border-slate-700">
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded"
                    >
                      <div className="text-[10px] text-slate-400 uppercase">
                        {item.type}
                      </div>
                      <div className="text-sm font-medium">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
