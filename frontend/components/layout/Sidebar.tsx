"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiChevronDown,
  HiChevronRight,
  HiHome,
  HiShoppingCart,
  HiCube,
  HiUsers,
  HiChartBar,
  HiCog,
  HiLogout,
  HiPlus,
  HiCurrencyRupee,
} from "react-icons/hi";
import { motion } from "framer-motion";

const menu = [
  { name: "Dashboard", icon: <HiHome />, path: "/" },
  {
    name: "Sales",
    icon: <HiShoppingCart />,
    submenu: [
      { name: "Add Sale", path: "/sales/new" },
      { name: "Sales History", path: "/sales" },
    ],
  },
  {
    name: "Purchase",
    icon: <HiCube />,
    submenu: [
      { name: "Add Purchase", path: "/purchases/new" },
      { name: "Purchase History", path: "/purchases" },
    ],
  },
  { name: "Products", icon: <HiCube />, path: "/products" },
  { name: "Customers", icon: <HiUsers />, path: "/customers" },
  {
    name: "Accounts",
    icon: <HiCurrencyRupee />,
    submenu: [
      { name: "Ledger", path: "/accounts/ledger" },
      { name: "Expense", path: "/accounts/expense" },
      { name: "Income", path: "/accounts/income" },
      { name: "Trial Balance", path: "/accounts/trial-balance" },
      { name: "Balance Sheet", path: "/accounts/balance-sheet" },
    ],
  },
  { name: "Reports", icon: <HiChartBar />, path: "/reports" },
  { name: "Settings", icon: <HiCog />, path: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800 text-slate-100 flex flex-col z-50 shadow-2xl border-r border-slate-700"
    >
      {/* Brand Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-white/10 w-10 h-10 flex items-center justify-center text-lg font-bold text-emerald-400">
            BP
          </div>
          {!collapsed && (
            <div className="text-lg font-semibold tracking-wide">
              BicyclePOS
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-300 hover:text-white p-2 transition"
          aria-label="toggle sidebar"
        >
          {collapsed ? "➤" : "◀"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">
        {menu.map((item) => {
          const active = pathname === item.path;
          const isOpen = openMenu === item.name;
          const hasSub = !!item.submenu;

          return (
            <div key={item.name} className="mb-1">
              {/* Parent Button */}
              <button
                onClick={() => (hasSub ? toggleMenu(item.name) : null)}
                className={`group flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition ${
                  active
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "hover:bg-slate-700/40 text-slate-200"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left font-medium tracking-wide">
                      {item.name}
                    </span>
                    {hasSub && (
                      <span className="transition-transform">
                        {isOpen ? (
                          <HiChevronDown className="text-sm" />
                        ) : (
                          <HiChevronRight className="text-sm" />
                        )}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {!collapsed && hasSub && isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-10 mt-1 space-y-1"
                >
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      className={`block px-2 py-1.5 rounded-md text-sm transition ${
                        pathname === sub.path
                          ? "text-emerald-400 font-semibold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-3">
          <Link href="/sales/new">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow-md">
              <HiPlus className="text-lg" /> {!collapsed && "Quick POS"}
            </button>
          </Link>
          <br />
          <form method="post" action="/api/auth/logout">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-md"
            >
              <HiLogout className="text-lg" /> {!collapsed && "Logout"}
            </button>
          </form>
        </div>
      </div>
    </motion.aside>
  );
}
