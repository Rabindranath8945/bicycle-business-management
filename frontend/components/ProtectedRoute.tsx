"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { redirect } from "next/navigation";

export default function ProtectedRoute({
  children,
  allow = ["admin", "staff"], // by default, both allowed
}: {
  children: React.ReactNode;
  allow?: ("admin" | "staff")[];
}) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in → redirect
  if (!user) redirect("/login");

  // Logged in but role not allowed → redirect or show 403
  if (!allow.includes(user.role)) {
    redirect("/403");
  }

  return <>{children}</>;
}
