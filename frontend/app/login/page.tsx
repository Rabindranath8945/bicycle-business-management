"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext)!;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    await login(email, password);
    router.push("/dashboard");
  }

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Sign In</h1>
      <form onSubmit={submit} className="mt-3 space-y-3">
        <input
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="border p-2 w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="bg-blue-500 text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
}
