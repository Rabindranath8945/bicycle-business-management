// /app/suppliers/import/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { UploadCloud, FilePlus, Download } from "lucide-react";

type SupplierRow = {
  name?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
};

export default function SupplierImportPage() {
  const [fileRows, setFileRows] = useState<SupplierRow[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [duplicates, setDuplicates] = useState<number>(0);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    const res = await fetcher("/api/suppliers").catch(() => []);
    setSuppliers(Array.isArray(res) ? res : []);
  }

  function parseCSVText(text: string) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((ln) => {
      const cols = ln.split(",").map((c) => c.trim());
      const obj: any = {};
      header.forEach((h, i) => (obj[h] = cols[i] ?? ""));
      return {
        name: obj.name || obj.supplier || "",
        phone: obj.phone || obj.mobile || "",
        email: obj.email || "",
        gstin: obj.gstin || obj.tax || "",
        address: obj.address || "",
      } as SupplierRow;
    });
    return rows;
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const txt = String(ev.target?.result || "");
      const rows = parseCSVText(txt);
      setFileRows(rows);
      // basic duplicate detection
      const dup = rows.reduce((acc, r) => {
        if (!r.phone) return acc;
        return (
          acc +
          (suppliers.some((s) => s.phone === r.phone || s.gstin === r.gstin)
            ? 1
            : 0)
        );
      }, 0);
      setDuplicates(dup);
    };
    reader.readAsText(f);
  }

  async function importRows() {
    if (fileRows.length === 0) return alert("No rows to import");
    // send to backend in batch later; for now show success message
    // Implementation tip later: POST /api/suppliers/bulk
    alert(
      `Imported ${fileRows.length} suppliers (frontend simulation). Implement backend POST /api/suppliers/bulk to finish.`
    );
    // Optionally add to local view
    setSuppliers([...fileRows, ...suppliers]);
    setFileRows([]);
  }

  function exportSuppliersCSV() {
    const rows = suppliers;
    if (!rows || rows.length === 0) return alert("No suppliers to export");
    const keys = ["name", "phone", "email", "gstin", "address"];
    const csv = [
      keys.join(","),
      ...rows.map((r) =>
        keys.map((k) => `"${String((r as any)[k] ?? "")}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suppliers-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Import / Export Suppliers</h1>

      <div className="bg-white/80 p-4 rounded-2xl shadow mb-4">
        <div className="flex items-center gap-3 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="p-3 rounded bg-slate-100/60">
              <UploadCloud size={18} />
            </div>
            <input
              onChange={onFile}
              type="file"
              accept=".csv"
              className="hidden"
            />
            <div>
              <div className="text-sm font-medium">Upload CSV</div>
              <div className="text-xs text-gray-500">
                Columns: name,phone,email,gstin,address
              </div>
            </div>
          </label>

          <button
            onClick={importRows}
            className="px-3 py-2 bg-emerald-600 text-white rounded"
          >
            <FilePlus size={16} /> Import (preview)
          </button>

          <button
            onClick={exportSuppliersCSV}
            className="px-3 py-2 border rounded ml-auto"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Preview rows: {fileRows.length} • Possible duplicates: {duplicates}
        </div>
      </div>

      {fileRows.length > 0 && (
        <div className="bg-white/70 p-4 rounded-2xl shadow mb-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th>Phone</th>
                <th>GSTIN</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {fileRows.map((r, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{r.name}</td>
                  <td>{r.phone}</td>
                  <td>{r.gstin}</td>
                  <td>{r.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white/80 p-4 rounded-2xl shadow">
        <h3 className="font-medium mb-2">
          Existing Suppliers ({suppliers.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suppliers.slice(0, 20).map((s: any, i: number) => (
            <div key={i} className="p-3 bg-white rounded border">
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-500">
                {s.phone} • {s.gstin}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
