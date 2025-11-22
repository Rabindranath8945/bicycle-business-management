"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in");
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <form
        onSubmit={submit}
        className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 w-full max-w-sm shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <User className="text-slate-500 mr-2" size={18} />
              <input
                type="email"
                className="bg-transparent outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Password</label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <Lock className="text-slate-500 mr-2" size={18} />
              <input
                type="password"
                className="bg-transparent outline-none w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-black py-3 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
