// context/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

type User = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // load token & profile on start
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          // fetch profile (adjust endpoint to your backend)
          const res = await api.get("/api/auth/me");
          setUser(res.data || null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      // backend should return { token, user }
      const res = await api.post("/api/auth/login", { identifier, password });
      const token = res.data?.token;
      const userData = res.data?.user || null;

      if (!token) throw new Error("No token from server");

      await SecureStore.setItemAsync("authToken", token);
      setUser(userData);
    } catch (err) {
      // rethrow so UI can show error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync("authToken");
      setUser(null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
