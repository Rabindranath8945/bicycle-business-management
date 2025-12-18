"use client";

import { useState } from "react";
// useRouter is only used for the handleDelete logic and refreshing the page now
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Gauge,
  Search,
  Loader2,
  Tag,
  Hash,
} from "lucide-react";
// Assuming axios is configured for API calls
import axios from "@/lib/axios";

// Define the type for a unit
interface Unit {
  id: string;
  name: string;
  symbol: string;
  type: string;
  isBaseUnit: boolean;
}

// Mock Data
const mockUnits: Unit[] = [
  {
    id: "1",
    name: "Pieces",
    symbol: "Pcs",
    type: "Discrete",
    isBaseUnit: true,
  },
  { id: "2", name: "Kilogram", symbol: "Kg", type: "Weight", isBaseUnit: true },
  { id: "3", name: "Liter", symbol: "Ltr", type: "Volume", isBaseUnit: true },
  { id: "4", name: "Gram", symbol: "g", type: "Weight", isBaseUnit: false },
  { id: "5", name: "Box", symbol: "Bx", type: "Discrete", isBaseUnit: false },
];

// Framer motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function UnitsPage() {
  // useRouter is still needed for imperative actions like delete confirmation and page refresh
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    if (id === "1" || id === "2" || id === "3")
      return alert("Cannot delete base units in this demo.");

    setDeletingId(id);
    try {
      // await axios.delete(`/api/units/${id}`);
      setUnits(units.filter((unit) => unit.id !== id));
    } catch (error) {
      alert("Failed to delete unit.");
    } finally {
      setDeletingId(null);
    }
    router.refresh(); // Refresh data in parent layout/pages after action
  };

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 selection:bg-blue-200">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-white/50 to-cyan-500/10 backdrop-blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Inventory Units
          </h1>
          {/* Link component already in use here */}
          <Link
            href="/units/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/50"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add New Unit</span>
          </Link>
        </header>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-4 border-b border-white/60">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search units..."
                className="w-full bg-white/90 border border-white/80 rounded-xl p-3 pl-10 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none shadow-inner text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/60">
              <thead className="bg-white/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Base Unit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredUnits.map((unit) => (
                  <motion.tr
                    key={unit.id}
                    variants={itemVariants}
                    className="hover:bg-white/70 transition-colors"
                    layout
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Gauge className="text-blue-500" size={16} />
                        <div className="text-sm font-medium text-gray-800">
                          {unit.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                      {unit.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {unit.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                      {unit.isBaseUnit ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {/* FIXED: Converted button+router.push to a Link component */}
                      <Link
                        href={`/units/${unit.id}/edit`}
                        className="inline-flex text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-white/80"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        disabled={deletingId === unit.id || unit.isBaseUnit}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
                        title={
                          unit.isBaseUnit ? "Cannot delete base unit" : "Delete"
                        }
                      >
                        {deletingId === unit.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-red-500"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredUnits.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No units found.
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
