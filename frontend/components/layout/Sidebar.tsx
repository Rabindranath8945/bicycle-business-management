"use client";

import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronDown,
  HiChevronRight,
  HiHome,
  HiUsers,
  HiChartBar,
  HiCog,
  HiLogout,
  HiPlus,
  HiCurrencyRupee,
} from "react-icons/hi";
import {
  ShoppingCart,
  ClipboardList,
  Package,
  Truck,
  Layers,
  BookOpen,
  CreditCard,
  Users as UsersIcon,
  Receipt,
  Banknote,
  FileSpreadsheet,
  BarChart2,
  TrendingUp,
  Briefcase,
  FileDown,
  Shield,
  History,
} from "lucide-react";
import { Tooltip } from "react-tooltip";

const menu = [
  { name: "Dashboard", icon: <HiHome />, path: "/" },

  // 🛒 Sales
  {
    name: "Sales",
    icon: <ShoppingCart />,
    submenu: [
      { name: "Add Sale", path: "/sales/new", icon: <CreditCard size={14} /> },
      {
        name: "Sales History",
        path: "/sales",
        icon: <ClipboardList size={14} />,
      },
      {
        name: "Invoices",
        path: "/sales/invoices",
        icon: <FileSpreadsheet size={14} />,
      },
      { name: "Customers", path: "/customers", icon: <UsersIcon size={14} /> },
    ],
  },

  // 📦 Purchases
  {
    name: "Purchases",
    icon: <Truck />,
    submenu: [
      {
        name: "Add Purchase",
        path: "/purchases/new",
        icon: <CreditCard size={14} />,
      },
      {
        name: "Purchase History",
        path: "/purchases",
        icon: <ClipboardList size={14} />,
      },
      { name: "Suppliers", path: "/suppliers", icon: <UsersIcon size={14} /> },
      {
        name: "Purchase Orders",
        path: "/purchases/orders",
        icon: <FileSpreadsheet size={14} />,
      },
    ],
  },

  // 🧰 Products
  {
    name: "Products",
    icon: <Package />,
    submenu: [
      {
        name: "Add Product",
        path: "/products/new",
        icon: <HiPlus size={14} />,
      },
      {
        name: "Products List",
        path: "/products",
        icon: <ClipboardList size={14} />,
      },
      {
        name: "Add Category",
        path: "/categories/new",
        icon: <Layers size={14} />,
      },
      {
        name: "Categories List",
        path: "/categories",
        icon: <FileSpreadsheet size={14} />,
      },
    ],
  },

  // 👥 Customers
  { name: "Customers", icon: <HiUsers />, path: "/customers" },

  // 💰 Accounting
  {
    name: "Accounting",
    icon: <HiCurrencyRupee />,
    submenu: [
      {
        name: "Core",
        icon: <BookOpen size={16} />,
        sublinks: [
          {
            name: "Sales & Purchase",
            path: "/accounting/sales-purchase",
            icon: <CreditCard size={14} />,
          },
          {
            name: "General Ledger",
            path: "/accounting/ledger",
            icon: <BookOpen size={14} />,
          },
          {
            name: "Customer Accounts",
            path: "/accounting/customers",
            icon: <UsersIcon size={14} />,
          },
          {
            name: "Supplier Accounts",
            path: "/accounting/suppliers",
            icon: <UsersIcon size={14} />,
          },
          {
            name: "Expense Management",
            path: "/accounting/expenses",
            icon: <Receipt size={14} />,
          },
          {
            name: "Cash & Bank",
            path: "/accounting/cashbank",
            icon: <Banknote size={14} />,
          },
        ],
      },
      {
        name: "Reports",
        icon: <FileSpreadsheet size={16} />,
        sublinks: [
          {
            name: "Profit & Loss",
            path: "/accounting/reports/pl",
            icon: <BarChart2 size={14} />,
          },
          {
            name: "Balance Sheet",
            path: "/accounting/reports/balance",
            icon: <FileSpreadsheet size={14} />,
          },
          {
            name: "Cash Flow",
            path: "/accounting/reports/cashflow",
            icon: <ClipboardList size={14} />,
          },
          {
            name: "GST / VAT Reports",
            path: "/accounting/reports/gst",
            icon: <Receipt size={14} />,
          },
          {
            name: "Outstanding Dues",
            path: "/accounting/reports/dues",
            icon: <TrendingUp size={14} />,
          },
        ],
      },
      {
        name: "Advanced",
        icon: <Layers size={16} />,
        sublinks: [
          {
            name: "Multi-Branch Accounting",
            path: "/accounting/multibranch",
            icon: <Layers size={14} />,
          },
          {
            name: "Payroll & Staff Salary",
            path: "/accounting/payroll",
            icon: <Briefcase size={14} />,
          },
          {
            name: "Loan & EMI Tracking",
            path: "/accounting/loans",
            icon: <CreditCard size={14} />,
          },
          {
            name: "Inventory Valuation",
            path: "/accounting/inventory-valuation",
            icon: <ClipboardList size={14} />,
          },
          {
            name: "PDF / Excel Export",
            path: "/accounting/export",
            icon: <FileDown size={14} />,
          },
          {
            name: "Budgeting & Forecasting",
            path: "/accounting/budgeting",
            icon: <BarChart2 size={14} />,
          },
          {
            name: "Role-Based Permissions",
            path: "/accounting/roles",
            icon: <Shield size={14} />,
          },
          {
            name: "Audit Trail",
            path: "/accounting/audit",
            icon: <History size={14} />,
          },
        ],
      },
    ],
  },

  { name: "Reports", icon: <HiChartBar />, path: "/reports" },
  { name: "Settings", icon: <HiCog />, path: "/settings" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  useEffect(() => {
    menu.forEach((item) => {
      if (item.submenu) {
        item.submenu.forEach((sub: any) => {
          if (pathname.startsWith(sub.path)) setOpenMenu(item.name);
          if (sub.sublinks) {
            sub.sublinks.forEach((link: any) => {
              if (pathname.startsWith(link.path)) {
                setOpenMenu(item.name);
                setOpenSubMenu(sub.name);
              }
            });
          }
        });
      }
    });
  }, [pathname]);

  const toggleMenu = (name: string) =>
    setOpenMenu(openMenu === name ? null : name);
  const toggleSubMenu = (name: string) =>
    setOpenSubMenu(openSubMenu === name ? null : name);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800 text-slate-100 flex flex-col z-50 shadow-2xl border-r border-slate-700"
    >
      {/* Brand */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-white/10 w-10 h-10 flex items-center justify-center text-lg font-bold text-emerald-400">
            M
          </div>
          {!collapsed && (
            <div className="text-lg font-semibold tracking-wide">
              Mandal Cycle
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-300 hover:text-white p-2 transition"
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
            <div key={item.name} className="mb-1 relative group">
              {hasSub ? (
                <button
                  onClick={() => toggleMenu(item.name)}
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
                      <span className="transition-transform">
                        {isOpen ? <HiChevronDown /> : <HiChevronRight />}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition ${
                    pathname === item.path
                      ? "bg-emerald-600/20 text-emerald-400"
                      : "hover:bg-slate-700/40 text-slate-200"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && (
                    <span className="flex-1 text-left font-medium tracking-wide">
                      {item.name}
                    </span>
                  )}
                </Link>
              )}

              {/* Submenus */}
              <AnimatePresence>
                {!collapsed && hasSub && isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-8 mt-1 space-y-1"
                  >
                    {item.submenu.map((sub: any) => (
                      <div key={sub.name}>
                        {sub.sublinks ? (
                          <button
                            onClick={() => toggleSubMenu(sub.name)}
                            className="flex items-center gap-2 w-full text-slate-300 hover:text-white text-sm font-medium py-1"
                          >
                            <span>{sub.icon}</span>
                            <span>{sub.name}</span>
                            <span className="ml-auto text-xs opacity-70">
                              {openSubMenu === sub.name ? "▼" : "▶"}
                            </span>
                          </button>
                        ) : (
                          <Link
                            href={sub.path}
                            className={`flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium py-1 transition ${
                              pathname === sub.path
                                ? "text-emerald-400 font-semibold"
                                : ""
                            }`}
                          >
                            <span>{sub.icon}</span>
                            <span>{sub.name}</span>
                          </Link>
                        )}

                        <AnimatePresence>
                          {openSubMenu === sub.name && sub.sublinks && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="ml-5 mt-1 space-y-1"
                            >
                              {sub.sublinks.map((link: any) => (
                                <Link
                                  key={link.path}
                                  href={link.path}
                                  className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition ${
                                    pathname === link.path
                                      ? "text-emerald-400 font-semibold"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {link.icon}
                                  <span>{link.name}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
