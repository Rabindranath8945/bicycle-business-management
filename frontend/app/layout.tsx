import "./globals.css";
import { LayoutProvider } from "@/components/layout/LayoutContext";
import ClientLayout from "@/components/layout/ClientLayout"; // 👈 new client wrapper
import { Toaster } from "sonner";

export const metadata = {
  title: "Bicycle POS & Accounting Dashboard",
  description: "Manage sales, inventory, and accounting seamlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <LayoutProvider>
          <ClientLayout>
            <Toaster richColors position="top-right" />
            {children}
          </ClientLayout>
        </LayoutProvider>
      </body>
    </html>
  );
}
