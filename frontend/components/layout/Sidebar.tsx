"use client";

import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
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
  FilePlus,
} from "lucide-react";

/* ============================
   MENU (UNCHANGED)
   ============================ */
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
        name: "Purchases Dashboard",
        path: "/purchases",
        icon: <ClipboardList size={14} />,
      },
      {
        name: "Create Purchase Order",
        path: "/purchases/create-po",
        icon: <FileSpreadsheet size={14} />,
      },
      {
        name: "Purchase Order List",
        path: "/purchases/po/list",
        icon: <ClipboardList size={14} />,
      },
      {
        name: "Receive Goods Return Notes",
        path: "/purchases/receive-grn",
        icon: <Truck size={14} />,
      },
      {
        name: "Goods Return Notes List",
        path: "/purchases/grn/list",
        icon: <Layers size={14} />,
      },
      {
        name: "Create Bill",
        path: "/purchases/create-bill",
        icon: <CreditCard size={14} />,
      },
      {
        name: "Bills List",
        path: "/purchases/bills/list",
        icon: <Receipt size={14} />,
      },
      {
        name: "Purchase Returns",
        path: "/purchases/returns",
        icon: <FileDown size={14} />,
      },
      {
        name: "Create Purchase Return",
        path: "/purchases/returns/create",
        icon: <FilePlus size={14} />,
      },
      { name: "Suppliers", path: "/suppliers", icon: <UsersIcon size={14} /> },
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

/* ============================
   ULTRA-PRO SIDEBAR COMPONENT
   ============================ */

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  if (!user) return null;

  // auto-open menus based on route
  useEffect(() => {
    menu.forEach((item) => {
      if (item.submenu) {
        item.submenu.forEach((sub: any) => {
          if (sub.path && pathname.startsWith(sub.path)) setOpenMenu(item.name);
          if (sub.sublinks) {
            sub.sublinks.forEach((link: any) => {
              if (link.path && pathname.startsWith(link.path)) {
                setOpenMenu(item.name);
                setOpenSubMenu(sub.name);
              }
            });
          }
        });
      } else {
        if (item.path && pathname === item.path) setOpenMenu(null);
      }
    });
  }, [pathname]);

  const toggleMenu = (name: string) =>
    setOpenMenu(openMenu === name ? null : name);
  const toggleSubMenu = (name: string) =>
    setOpenSubMenu(openSubMenu === name ? null : name);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="fixed top-0 left-0 h-screen z-50 flex flex-col bg-gradient-to-b from-slate-900/95 via-neutral-900 to-slate-900 text-slate-100 shadow-2xl border-r border-slate-800"
    >
      {/* BRAND */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="rounded-md w-10 h-10 flex items-center justify-center text-lg font-bold"
            style={{
              background: "linear-gradient(135deg,#6d28d9, #7c3aed)",
              boxShadow: "0 6px 18px rgba(124,58,237,0.18)",
            }}
          >
            M
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">
                Mandal Cycle
              </span>
              <span className="text-xs text-slate-300">POS • Inventory</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-300 hover:text-white p-2 rounded-md transition"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "➤" : "◀"}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {menu.map((item) => {
          const isMenuOpen = openMenu === item.name;
          const anyChildActive =
            item.path === pathname ||
            item.submenu?.some(
              (s: any) =>
                (s.path && pathname.startsWith(s.path)) ||
                s.sublinks?.some(
                  (l: any) => l.path && pathname.startsWith(l.path)
                )
            );

          /* MAIN ROW ANIM (tilt + lift on hover) */
          return (
            <div key={item.name} className="mb-1">
              {item.submenu ? (
                <motion.div
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  transition={{ duration: 0.12 }}
                  className={`relative rounded-lg overflow-visible`}
                >
                  {/* main button */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200
                      ${
                        anyChildActive
                          ? "bg-gradient-to-r from-purple-900/30 to-purple-800/20 text-purple-300 shadow-[0_6px_20px_rgba(124,58,237,0.12)] border-l-4 border-purple-400"
                          : "hover:bg-slate-800/50 text-slate-200"
                      }
                    `}
                    aria-expanded={isMenuOpen}
                    title={item.name}
                  >
                    <span
                      className="text-xl opacity-95"
                      style={{ color: anyChildActive ? "#E9D5FF" : undefined }}
                    >
                      {item.icon}
                    </span>

                    {!collapsed && (
                      <>
                        <span
                          className={`flex-1 text-left font-medium ${
                            anyChildActive ? "text-purple-100" : ""
                          }`}
                        >
                          {item.name}
                        </span>

                        <motion.span
                          className="text-xs opacity-80"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: isMenuOpen ? 90 : 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          ▶
                        </motion.span>
                      </>
                    )}

                    {/* COLLAPSED TOOLTIP */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <div className="bg-neutral-900/95 text-white text-xs py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* SUBMENU */}
                  <AnimatePresence>
                    {!collapsed && isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.16 }}
                        className="mt-1 ml-8 space-y-1"
                      >
                        {item.submenu!.map((sub: any) => {
                          const subHasChildren = !!sub.sublinks;
                          const subActive =
                            (sub.path && pathname.startsWith(sub.path)) ||
                            (sub.sublinks &&
                              sub.sublinks.some(
                                (l: any) =>
                                  l.path && pathname.startsWith(l.path)
                              ));

                          return (
                            <div key={sub.name}>
                              {subHasChildren ? (
                                <motion.button
                                  onClick={() => toggleSubMenu(sub.name)}
                                  whileTap={{ scale: 0.985 }}
                                  className={`flex items-center gap-2 w-full text-sm font-medium py-2 px-2 rounded-md transition-all duration-150
                                    ${
                                      subActive
                                        ? "bg-gradient-to-r from-purple-900/20 to-transparent text-purple-200 shadow-[inset_0_0_18px_rgba(124,58,237,0.06)] border-l-2 border-purple-300"
                                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    }
                                  `}
                                >
                                  <span className="opacity-90">{sub.icon}</span>
                                  <span
                                    className={`${
                                      subActive ? "text-purple-100" : ""
                                    }`}
                                  >
                                    {sub.name}
                                  </span>

                                  <motion.span
                                    className="ml-auto text-xs opacity-75"
                                    initial={{ rotate: 0 }}
                                    animate={{
                                      rotate: openSubMenu === sub.name ? 90 : 0,
                                    }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    ▶
                                  </motion.span>
                                </motion.button>
                              ) : (
                                <Link
                                  href={sub.path}
                                  className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition-all duration-150
                                    ${
                                      subActive
                                        ? "text-purple-200 font-semibold bg-slate-800/30 border-l-2 border-purple-300"
                                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    }
                                  `}
                                >
                                  <span className="opacity-90">{sub.icon}</span>
                                  <span>{sub.name}</span>
                                </Link>
                              )}

                              {/* level-3 links */}
                              <AnimatePresence>
                                {openSubMenu === sub.name && sub.sublinks && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.14 }}
                                    className="ml-5 mt-1 space-y-1"
                                  >
                                    {sub.sublinks.map((link: any) => {
                                      const linkActive =
                                        link.path &&
                                        pathname.startsWith(link.path);
                                      return (
                                        <Link
                                          key={link.path}
                                          href={link.path}
                                          className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition-all duration-150
                                            ${
                                              linkActive
                                                ? "text-purple-200 font-semibold bg-slate-800/30 border-l-2 border-purple-300"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                            }
                                          `}
                                        >
                                          {link.icon}
                                          <span>{link.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* SIMPLE LINK (no submenu) */
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.12 }}
                >
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${
                        pathname === item.path
                          ? "bg-gradient-to-r from-purple-900/30 to-purple-800/10 text-purple-300 shadow-[0_6px_20px_rgba(124,58,237,0.12)] border-l-4 border-purple-400"
                          : "hover:bg-slate-800/50 text-slate-200"
                      }
                    `}
                    title={item.name}
                  >
                    <span
                      className="text-xl opacity-95"
                      style={{
                        color: pathname === item.path ? "#E9D5FF" : undefined,
                      }}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}

                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none">
                        <div className="bg-neutral-900/95 text-white text-xs py-1 px-2 rounded-md shadow-lg">
                          {item.name}
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="space-y-3">
          <Link href="/sales/new">
            <button
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-medium"
              style={{
                background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                color: "white",
                boxShadow: "0 8px 30px rgba(124,58,237,0.16)",
              }}
            >
              <HiPlus className="text-lg" /> {!collapsed && "Quick POS"}
            </button>
          </Link>

          <form method="post" action="/api/auth/logout">
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <HiLogout className="text-lg" /> {!collapsed && "Logout"}
            </button>
          </form>
        </div>
      </div>
    </motion.aside>
  );
}
