"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Safe redirect logic — DOES NOT BREAK HOOK ORDER
  useEffect(() => {
    if (!loading) {
      // Not logged in & NOT on login page → redirect to login
      if (!user && pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
      }

      // Logged in & on login page → move to dashboard
      if (user && pathname === "/login") {
        router.replace("/");
      }
    }
  }, [loading, user, pathname, router]);

  // Login
  const login = async (email: string, password: string) => {
    await axios.post("/api/auth/login", { email, password });
    await fetchUser();
    router.replace("/");
  };

  // Logout
  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* ALWAYS RENDER CHILDREN — NEVER BREAK HOOK TREE */}
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
