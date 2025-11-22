"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLayout } from "./LayoutContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * ClientLayout
 * - Keeps Sidebar fixed (Sidebar itself uses position:fixed)
 * - Applies dynamic left padding to the main content so pages never sit under the sidebar
 * - Handles mobile overlay when sidebar is open on small screens
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed, isMobileOpen, toggleMobile } = useLayout();
  const pathname = usePathname();

  // pages where we don't want the sidebar/header (login/register/403)
  const hideOn = ["/login", "/register", "/403"];
  const hideLayout = hideOn.includes(pathname);

  // compute padding-left depending on the sidebar state
  // Sidebar width (matches your Sidebar.tsx animation): collapsed = 80, expanded = 260
  const desktopPadding = collapsed ? 80 : 260;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Fixed Sidebar (Sidebar handles its own fixed positioning) */}
      {!hideLayout && <Sidebar />}

      {/* mobile overlay when sidebar is opened on small screens */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => toggleMobile()}
        />
      )}

      {/* Main area */}
      <main
        id="main-content"
        className={`relative z-10 transition-all duration-300`}
        // dynamic inline style so padding-left equals sidebar width on desktop,
        // and 0 on mobile (when mobile sidebar is open the overlay covers)
        style={{
          paddingLeft: hideLayout ? 0 : `${desktopPadding}px`,
        }}
      >
        {/* Header (hide on auth pages) */}
        {!hideLayout && <Header />}

        {/* Page content container that centers everything */}
        <div className="w-full flex justify-center px-4 md:px-8 lg:px-10 overflow-x-hidden">
          <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
