// components/layout/Header.tsx
"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Settings,
  User,
  Plus,
  ShoppingBag,
  ChevronDown,
  LogOut,
  Package,
  ArrowUpRight,
  Twitter,
  Facebook,
  Linkedin, // Added social media icons
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the TypeScript interface for Dropdown props
interface DropdownProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

// Reusable Dropdown Component
const Dropdown: React.FC<DropdownProps> = ({ children, isOpen, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      {children}
    </div>
  );
};

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // currentDateRange removed as requested

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-50 shadow-sm">
      {/* Left side: Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-800 font-bold text-xl">
          Mandal<span className="text-blue-600">Cycle Store</span>
        </div>
      </div>

      {/* Center: Large Search Bar */}
      <div className="flex-1 flex justify-center mx-10">
        <div className="relative w-full max-w-xl">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products, bills, customer names, SKUs..."
            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition duration-150"
          />
        </div>
      </div>

      {/* Right side: Actions, Social Media, User Info, and Profile */}
      <div className="flex items-center gap-4">
        {/* Social Media Icons (New Feature) */}
        <div className="flex items-center gap-3">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Twitter size={18} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-700 transition-colors"
          >
            <Linkedin size={18} />
          </a>
        </div>

        {/* The dedicated POS Quick Sale Button */}
        <Link href="/sales/new">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150">
            <Plus size={16} />
            POS
          </button>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full" />
          </button>
          <Dropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          >
            {/* ... notification items ... */}
            <div className="p-4 text-sm text-gray-700">
              <p className="font-semibold mb-2">Notifications</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package size={16} className="text-blue-500 mt-0.5" />
                  <p>Low stock alert for **Lenovo 3rd Gen**.</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowUpRight size={16} className="text-green-500 mt-0.5" />
                  <p>New sale **#416645453773** completed.</p>
                </div>
              </div>
            </div>
          </Dropdown>
        </div>

        {/* User Profile/Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-800">John Smilga</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <User size={18} />
            </div>
          </button>
          <Dropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          >
            <div className="p-4">
              <Link
                href="/settings"
                className="flex items-center gap-3 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
              >
                <Settings size={16} />
                Settings
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="flex items-center gap-3 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md w-full"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
