"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { redirect } from "next/navigation";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) redirect("/login");

  return <>{children}</>;
}
