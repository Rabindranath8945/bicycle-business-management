"use client";

import { useState, useEffect, useRef } from "react";
import { fetcher } from "@/lib/api";

type ProductSearchBoxProps = {
  onSelect: (product: any) => void;
  filter?: (product: any) => boolean;
};

export default function ProductSearchBox({
  onSelect,
  filter,
}: ProductSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounced fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetcher(
          `/api/products?search=${encodeURIComponent(query.trim())}`
        );

        const list = Array.isArray(res) ? res : [];
        setResults(filter ? list.filter(filter) : list);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(t);
  }, [query, filter]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function handleSelect(p: any) {
    onSelect(p);
    setQuery("");
    setShow(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShow(true);
        }}
        onFocus={() => query.length > 0 && setShow(true)}
        className="p-3 border rounded-lg w-full"
        placeholder="Search product name / SKU / barcode"
      />

      {/* Dropdown */}
      {show && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-xl max-h-64 overflow-auto">
          {results.map((p: any) => (
            <div
              key={p._id}
              onClick={() => handleSelect(p)}
              className="p-2 border-b hover:bg-amber-50 cursor-pointer"
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">
                {p.sku || p.barcode} • ₹{p.sellingPrice ?? p.costPrice ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {show && loading && (
        <div className="absolute mt-1 p-2 text-sm bg-white border rounded shadow">
          Searching…
        </div>
      )}
    </div>
  );
}
