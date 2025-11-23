import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../store/useUser";
import Constants from "expo-constants";
import { router } from "expo-router";

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://mandal-cycle-pos-api.onrender.com";

export const AuthContext = createContext({
  signIn: async (identifier: string, password: string) => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  const setUser = useUser((s) => s.setUser);

  const signIn = async (identifier: string, password: string) => {
    try {
      setLoading(true);

      console.log("🔐 Logging in…", identifier);

      const api = axios.create({
        baseURL: API_BASE,
        headers: { "Content-Type": "application/json" },
      });

      const response = await api.post("/auth/login", {
        email: identifier,
        password,
      });

      console.log("🔥 Login response:", response.data);

      if (!response.data.token) {
        throw new Error("Token missing in login response");
      }

      // save user globally
      setUser({
        _id: response.data.user?._id,
        name: response.data.user?.name,
        email: response.data.user?.email,
        token: response.data.token,
      });

      console.log("✅ User saved to store");

      // redirect to dashboard
      router.replace("/");
    } catch (err: any) {
      console.log("❌ Login API error:", err.response?.data || err.message);
      throw err;
    } finally {
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
