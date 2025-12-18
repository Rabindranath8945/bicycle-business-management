"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Save, Loader2, Tag, Hash, Gauge } from "lucide-react";
// Assuming axios is configured for API calls
import axios from "@/lib/axios";

// Framer motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
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

export default function NewUnitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    type: "Discrete",
    isBaseUnit: false,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.symbol.trim())
      return alert("Name and symbol are required.");

    setLoading(true);
    try {
      // await axios.post("/api/units", formData);
      console.log("Saving unit:", formData); // Mocking API call
      router.push("/units");
      router.refresh();
    } catch (error) {
      console.error("Failed to save unit:", error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-white/50 to-cyan-500/10 backdrop-blur-3xl pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-xl"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Link
            href="/units"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group font-semibold text-sm"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Units
          </Link>
        </motion.div>

        <section>
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl text-gray-800 font-extrabold tracking-tighter mb-2">
              New Unit
            </h1>
            <p className="text-gray-500 text-base">
              Define a new unit of measurement for your products.
            </p>
          </motion.div>

          <form onSubmit={handleSave} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Unit Name (e.g., Pieces, Kilogram)
              </label>
              <div className="relative">
                <Tag
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Box"
                  className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="symbol"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Unit Symbol (e.g., Pcs, Kg)
              </label>
              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="symbol"
                  type="text"
                  required
                  placeholder="e.g. Bx"
                  className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner text-sm"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value })
                  }
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="type"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Unit Type
              </label>
              <div className="relative">
                <Gauge
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  id="type"
                  className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner appearance-none text-sm"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Discrete">Discrete (Each, Pcs, Boxes)</option>
                  <option value="Weight">Weight (Kg, g, Lb)</option>
                  <option value="Volume">Volume (Ltr, ml, Gal)</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-3 pt-2"
            >
              <input
                id="isBaseUnit"
                type="checkbox"
                checked={formData.isBaseUnit}
                onChange={(e) =>
                  setFormData({ ...formData, isBaseUnit: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isBaseUnit"
                className="text-sm font-semibold text-gray-700 cursor-pointer"
              >
                Is this the primary (base) unit for its type?
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/60 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {loading ? "Saving..." : "Create Unit"}
              </button>
            </motion.div>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
