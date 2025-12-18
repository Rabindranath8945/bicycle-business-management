"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Package,
  ListTodo,
  Users,
  ChevronRight,
  AlertTriangle,
  Clock,
  PlusCircle,
  FolderOpen,
  Tag,
  Box,
  Printer,
  ArrowDownLeft,
  FileText,
  CheckCircle,
  Truck,
  RefreshCw,
  BarChart2,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemType {
  name: string;
  path: string;
  icon: LucideIcon;
  color?: string;
}

const menuStructure = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
    ] as NavItemType[],
  },
  {
    title: "Inventory",
    items: [
      { name: "Products", path: "/products", icon: Package },
      { name: "Create Products", path: "/products/new", icon: PlusCircle },
      { name: "Category", path: "/categories", icon: FolderOpen },
      { name: "Units", path: "/units", icon: Box },
      { name: "Print Barcode", path: "/print-barcode", icon: Printer },
    ] as NavItemType[],
  },
  {
    title: "Stock",
    items: [
      { name: "Manage Stock", path: "/stock/manage", icon: Settings },
      { name: "Stock Adjustment", path: "/stock/adjust", icon: RefreshCw },
      { name: "Stock Transfer", path: "/stock/transfer", icon: Truck },
    ] as NavItemType[],
  },
  {
    title: "Sales",
    items: [
      { name: "Sales Dashboard", path: "/sales", icon: BarChart2 },
      { name: "Sales History", path: "/sales/history", icon: Clock },
      { name: "Invoices", path: "/sales/invoices", icon: FileText },
      { name: "Customers", path: "/customers", icon: Users },
      { name: "Sales Return", path: "/sales/returns", icon: ArrowDownLeft },
    ] as NavItemType[],
  },
  {
    title: "Purchase",
    items: [
      { name: "Purchase Dashboard", path: "/purchases", icon: BarChart2 },
      {
        name: "Create Purchase Order",
        path: "/purchases/create-po",
        icon: PlusCircle,
      },
      {
        name: "Purchase Order List",
        path: "/purchases/po/list",
        icon: ListTodo,
      },
      {
        name: "Receive GRN",
        path: "/purchases/receive-grn",
        icon: CheckCircle,
      },
      {
        name: "Goods Return Notes List",
        path: "/purchases/grn/list",
        icon: ListTodo,
      },
      { name: "Create Bill", path: "/purchases/create-bill", icon: PlusCircle },
      { name: "Bills List", path: "/purchases/bills/list", icon: FileText },
      {
        name: "Purchase Return",
        path: "/purchases/returns",
        icon: ArrowDownLeft,
      },
      {
        name: "Create Purchase Return",
        path: "/purchases/returns/create",
        icon: PlusCircle,
      },
      { name: "Supplier List", path: "/suppliers", icon: Users },
    ] as NavItemType[],
  },
  {
    title: "Settings",
    items: [
      { name: "General Info", path: "/sales", icon: BarChart2 },
      { name: "Export & Import", path: "/settings/export-import", icon: Clock },
      { name: "Invoices", path: "/sales/invoices", icon: FileText },
      { name: "Customers", path: "/customers", icon: Users },
      { name: "Sales Return", path: "/sales/returns", icon: ArrowDownLeft },
    ] as NavItemType[],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const NavItem: React.FC<{ item: NavItemType }> = ({ item }) => {
    const active =
      pathname === item.path ||
      (item.path !== "/" && pathname.startsWith(item.path));

    return (
      <Link href={item.path} className="block">
        <div
          className={cn(
            "group flex items-center justify-between p-3 rounded-lg transition-all duration-150 cursor-pointer",
            active
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon size={18} className={cn(item.color, "shrink-0")} />
            <span className="text-sm font-medium whitespace-nowrap">
              {item.name}
            </span>
          </div>
          {active && <ChevronRight size={14} />}
        </div>
      </Link>
    );
  };

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-[250px] bg-white border-r border-gray-200 z-40 flex flex-col shadow-sm">
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        {menuStructure.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Developed By{" "}
          <span className="font-semibold text-blue-600">
            Rabindranath Mondal
          </span>
        </p>
      </div>
    </aside>
  );
}
