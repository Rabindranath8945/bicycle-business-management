"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLayout } from "./LayoutContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed, isMobileOpen, toggleMobile } = useLayout();
  const pathname = usePathname();

  // Pages where UI should be hidden (login/register/403)
  const hideOn = ["/login", "/register", "/403"];
  const hideLayout = hideOn.includes(pathname);

  const desktopPadding = collapsed ? 80 : 260;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Sidebar (always mounted — hidden via CSS) */}
      <div style={{ display: hideLayout ? "none" : "block" }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && !hideLayout && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => toggleMobile()}
        />
      )}

      {/* Main */}
      <main
        id="main-content"
        className="relative z-10 transition-all duration-300"
        style={{
          paddingLeft: hideLayout ? 0 : `${desktopPadding}px`,
        }}
      >
        {/* Header (always mounted — hidden via CSS) */}
        <div style={{ display: hideLayout ? "none" : "block" }}>
          <Header />
        </div>

        {/* Page Content */}
        <div className="w-full flex justify-center px-4 md:px-8 lg:px-10 overflow-x-hidden">
          <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
