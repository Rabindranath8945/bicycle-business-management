"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/lib/context/AuthContext";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: any) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Hide sidebar on authentication screens
  const hideOn = ["/login", "/register"];
  const shouldHide = hideOn.includes(pathname) || !user;

  return (
    <div className="flex">
      {!shouldHide && <Sidebar />}

      <main className="flex-1 min-h-screen">
        {!shouldHide && <Header />}
        {children}
      </main>
    </div>
  );
}
