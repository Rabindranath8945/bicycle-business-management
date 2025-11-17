"use client";

import { useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <div className="p-10">
      <h1 className="text-2xl">Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <button className="bg-red-500 text-white px-4 py-2" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
