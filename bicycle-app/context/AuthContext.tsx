import React, { createContext, useState } from "react";
import axios from "axios";
import { useUser } from "../store/useUser";
import Constants from "expo-constants";
import { router } from "expo-router/build";

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://mandal-cycle-pos-api.onrender.com";

type AuthContextType = {
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const setUser = useUser((s) => s.setUser);

  const signIn = async (identifier: string, password: string) => {
    console.log("🟣 signIn() started");
    try {
      setLoading(true);

      console.log("📡 Sending login request:", API_BASE);

      const api = axios.create({
        baseURL: API_BASE,
        headers: { "Content-Type": "application/json" },
      });

      const res = await api.post("/auth/login", {
        email: identifier,
        password,
      });

      console.log("🟢 Login response:", res.data);

      const user = res.data.user;
      const token = res.data.token;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // Save user to your global store
      setUser({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });

      console.log("✅ User stored successfully");
      router.replace("/");
    } catch (err: any) {
      console.log("🔴 Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      console.log("🟡 signIn finished");
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
