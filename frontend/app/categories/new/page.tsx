"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const saveCategory = async () => {
    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }

    await axios.post("/api/categories", { name, description });
    router.push("/categories");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-xl mx-auto"
    >
      <Link
        href="/categories"
        className="text-slate-400 flex gap-2 items-center mb-6 hover:text-emerald-400"
      >
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h1 className="text-xl text-emerald-400 font-semibold mb-4">
          Add Category
        </h1>

        <label className="text-sm text-slate-400">Category Name</label>
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-sm text-slate-400">Description</label>
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 mb-4"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={saveCategory}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
        >
          <Save size={18} /> Save
        </button>
      </div>
    </motion.div>
  );
}
