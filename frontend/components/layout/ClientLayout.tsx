"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideOn = ["/login", "/register", "/403"];
  const hideLayout = hideOn.includes(pathname);

  if (hideLayout) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Fixed width for the sidebar
  const sidebarWidth = "250px";

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Header />

      <Sidebar />

      <main
        id="main-content"
        className="relative z-10"
        style={{ paddingLeft: sidebarWidth }} // Static padding
      >
        <div className="w-full px-4 md:px-8 lg:px-10 overflow-x-hidden pt-20">
          <div className="w-full mx-auto space-y-8 pb-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
