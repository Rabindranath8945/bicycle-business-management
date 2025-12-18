"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
// Assuming axios is configured for API calls
import axios from "@/lib/axios";

// Framer motion variants for better orchestration
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 120,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required.");
      return;
    }

    setLoading(true);
    try {
      // await axios.post("/api/categories", formData);
      console.log("Saving category:", formData); // Mocking API call
      router.push("/categories");
      router.refresh();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Updated background with a subtle radial gradient for depth
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 selection:bg-blue-200">
      {/* Abstract background element for the glass effect to blur */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-white/50 to-cyan-500/10 backdrop-blur-3xl pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // Refined glassmorphism card styling with a cleaner shadow
        className="relative bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-xl"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group font-semibold text-sm"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Categories
          </Link>
        </motion.div>

        <section>
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl text-gray-800 font-extrabold tracking-tighter mb-2">
              New Category
            </h1>
            <p className="text-gray-500 text-base">
              Organize your items by creating a new classification.
            </p>
          </motion.div>

          <form onSubmit={handleSave} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Category Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoFocus
                placeholder="e.g. Electronics"
                // Premium input styling: brighter white, subtle shadow-inner, enhanced focus ring
                className="w-full bg-white/90 border border-white/80 rounded-xl p-3 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner text-sm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="desc"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="desc"
                rows={4}
                placeholder="Brief description of items in this category..."
                // Premium textarea styling
                className="w-full bg-white/90 border border-white/80 rounded-xl p-3 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none resize-none shadow-inner text-sm"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                disabled={loading}
                // Premium button styling: bigger shadow on hover, more defined active state
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/60 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {loading ? "Saving..." : "Create Category"}
              </button>
            </motion.div>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
