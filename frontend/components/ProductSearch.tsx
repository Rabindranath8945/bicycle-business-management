"use client";

import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

export default function ProductSearch({ onSelect }: any) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (q.length >= 2) search();
      else setResults([]);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  async function search() {
    setLoading(true);
    try {
      const res = await fetcher(
        `/api/products?search=${encodeURIComponent(q)}`
      );
      setResults(res || []);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search product name / sku / barcode"
        className="w-full p-2 border rounded"
      />
      {results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded border shadow max-h-56 overflow-auto">
          {results.map((p) => (
            <div
              key={p._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              onClick={() => {
                onSelect(p);
                setResults([]);
                setQ("");
              }}
            >
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-400">
                  {p.sku || p.barcode}
                </div>
              </div>
              <div className="text-sm text-gray-600">Stock: {p.stock ?? 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
