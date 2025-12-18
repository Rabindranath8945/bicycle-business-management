"use client";

import { useState, useEffect } from "react";
// Import useRouter and useParams from 'next/navigation' for client-side access
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Tag,
  Hash,
  Gauge,
  AlertCircle,
} from "lucide-react";
import axios from "@/lib/axios";

// Define the type for a unit
interface UnitData {
  name: string;
  symbol: string;
  type: string;
  isBaseUnit: boolean;
}

// Framer motion variants (omitted for brevity, assume they are the same)
const containerVariants: Variants = {
  /* ... */
};
const itemVariants: Variants = {
  /* ... */
};

export default function EditUnitPage() {
  const router = useRouter();
  // Get the dynamic ID from the URL (e.g., '1' from /units/1/edit)
  const params = useParams();
  const unitId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<UnitData>({
    name: "",
    symbol: "",
    type: "Discrete",
    isBaseUnit: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data on mount using the real unitId
  useEffect(() => {
    if (!unitId) return; // Wait until ID is available

    const fetchUnitData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        // In a real app, you would use this line:
        // const response = await axios.get(`/api/units/${unitId}`);
        // setFormData(response.data);

        // Using mock data based on ID for this example:
        if (unitId === "1" || unitId === "2" || unitId === "3") {
          setFormData({
            name:
              unitId === "1" ? "Pieces" : unitId === "2" ? "Kilogram" : "Liter",
            symbol: unitId === "1" ? "Pcs" : unitId === "2" ? "Kg" : "Ltr",
            type:
              unitId === "1"
                ? "Discrete"
                : unitId === "2"
                ? "Weight"
                : "Volume",
            isBaseUnit: true,
          });
        } else if (unitId === "4") {
          setFormData({
            name: "Gram",
            symbol: "g",
            type: "Weight",
            isBaseUnit: false,
          });
        } else {
          setError(`Unit with ID "${unitId}" not found.`);
        }
      } catch (err) {
        setError("Failed to load unit details from API.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUnitData();
  }, [unitId]); // Re-run when unitId changes

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.symbol.trim())
      return alert("Name and symbol are required.");

    setLoading(true);
    try {
      // await axios.put(`/api/units/${unitId}`, formData); // Use PUT or PATCH for edits
      console.log(`Updating unit ${unitId}:`, formData);
      router.push("/units");
      router.refresh();
    } catch (err) {
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        <span className="ml-3 text-gray-600">Loading unit details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="flex items-center gap-4 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg">
          <AlertCircle className="w-6 h-6" />
          <p className="font-semibold">{error}</p>
          <Link
            href="/units"
            className="text-blue-600 hover:text-blue-800 underline ml-4"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // The rest of the return block remains the same premium glassmorphism design:

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
              Edit Unit
            </h1>
            <p className="text-gray-500 text-base">
              Update the definition for unit: **{formData.name}** (ID: {unitId}
              ).
            </p>
          </motion.div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Form fields use formData state, which is populated by useEffect */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Unit Name
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner text-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="symbol"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Unit Symbol
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
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value })
                  }
                  className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner text-sm"
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
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner appearance-none text-sm"
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
            {/* End of form fields */}

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
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </motion.div>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
