"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Upload,
  FileText,
  File,
  Loader2,
  Database,
  AlertCircle,
} from "lucide-react";
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

export default function DataManagementPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true);
    try {
      // Simulate API call for data export
      console.log(`Exporting data as ${format}...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(
        `Successfully prepared data for export as ${format.toUpperCase()}. A download would start here.`
      );
    } catch (error) {
      alert("Export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Please select a valid CSV file.");
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return alert("Please select a file first.");

    setIsImporting(true);
    try {
      // Simulate API call for data import
      const formData = new FormData();
      formData.append("file", selectedFile);
      // await axios.post("/api/import-data", formData);
      console.log("Importing file:", selectedFile.name);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Import successful! Data will be processed shortly.");
      setSelectedFile(null);
    } catch (error) {
      alert("Import failed. Check file format.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    // Reusing the premium light-theme background
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 selection:bg-blue-200">
      {/* Abstract background element for the glass effect to blur */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-white/50 to-cyan-500/10 backdrop-blur-3xl pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // Refined glassmorphism card styling
        className="relative bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-2xl"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Link
            href="/" // Link back to dashboard/home
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group font-semibold text-sm"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </Link>
        </motion.div>

        <section>
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl text-gray-800 font-extrabold tracking-tighter mb-2">
              Data Management
            </h1>
            <p className="text-gray-500 text-base">
              Manage data by importing CSV files or exporting reports.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Export Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 p-6 rounded-xl border border-white/80 shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <Download className="text-blue-600" /> Export Data
              </h2>
              <p className="text-gray-600 mb-5">
                Generate comprehensive reports for your records.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleExport("csv")}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-blue-500/40 transition-all"
                >
                  {isExporting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <FileText size={18} />
                  )}
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-red-500/40 transition-all"
                >
                  {isExporting ? (
                    <Loader2 size={18} className="animate-spin text-red-100" />
                  ) : (
                    <File size={18} />
                  )}
                  Export PDF
                </button>
              </div>
            </motion.div>

            {/* Import Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 p-6 rounded-xl border border-white/80 shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <Upload className="text-blue-600" /> Import CSV Data
              </h2>
              <p className="text-gray-600 mb-5">
                Upload a CSV file to bulk add or update inventory items.
              </p>

              <div className="space-y-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                />

                {selectedFile && (
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <FileText size={16} /> Selected: **{selectedFile.name}**
                  </p>
                )}

                <button
                  onClick={handleImport}
                  disabled={!selectedFile || isImporting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {isImporting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Database size={18} />
                  )}
                  {isImporting ? "Importing..." : "Start Import"}
                </button>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                <AlertCircle size={20} className="mt-0.5 min-w-[20px]" />
                <p className="text-sm">
                  Ensure your CSV file matches the required template structure
                  exactly to prevent import errors.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
