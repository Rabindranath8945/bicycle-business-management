"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { X, Grid, List, Filter, Zap, Box, AlertCircle } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  salePrice: number;
  taxPercent?: number;
  stock?: number;
  categoryName?: string;
  hsn?: string;
  photo?: string | null;
  sku?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
};

export default function ProductDrawer({ open, onClose, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // initial categories
  useEffect(() => {
    let mounted = true;
    axios
      .get("/api/categories")
      .then((r) => mounted && setCategories(r.data || []))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // reset when opened
  useEffect(() => {
    if (open) {
      setProducts([]);
      setPage(1);
      setHasMore(true);
      setQuery("");
      setActiveCat(null);
      fetchProducts(1, true);
    } else {
      // small cleanup
      setProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // fetch products
  async function fetchProducts(p = 1, replace = false) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const params = new URLSearchParams();
      params.append("page", String(p));
      params.append("limit", "30");
      if (query) params.append("q", query);
      if (activeCat) params.append("category", activeCat);

      const res = await axios.get(`/api/products/search?${params.toString()}`);
      const data = res.data || [];
      if (replace) {
        setProducts(data);
      } else {
        setProducts((s) => [...s, ...data]);
      }
      if (!Array.isArray(data) || data.length < 30) setHasMore(false);
      else setHasMore(true);
      setPage(p);
    } catch (err) {
      console.error("fetchProducts", err);
    } finally {
      loadingRef.current = false;
    }
  }

  // infinite scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!hasMore || loadingRef.current) return;
      const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
      if (bottom) fetchProducts(page + 1);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [page, hasMore]);

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(1, true), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeCat]);

  // helper to render thumbnail safely
  const Thumb = ({ src }: { src?: string | null }) => (
    <div className="w-14 h-14 bg-slate-800 rounded-md flex items-center justify-center overflow-hidden">
      {src ? (
        <img src={src} alt="thumb" className="object-cover w-full h-full" />
      ) : (
        <Box size={18} className="text-slate-500" />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={open ? { x: 0 } : { x: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed top-0 right-0 h-full w-full lg:w-2/5 z-50"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative h-full">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[520px] bg-slate-900/85 backdrop-blur p-4 border-l border-slate-700 flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Products</h3>
              <div className="text-xs text-slate-400">
                Search, filter & quick add
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-800/60"
                onClick={() => setView((v) => (v === "list" ? "grid" : "list"))}
                title="Toggle view"
              >
                {view === "list" ? <Grid size={16} /> : <List size={16} />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-800/60"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* controls */}
          <div className="grid grid-cols-1 gap-2 mb-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded px-3 py-2">
              <input
                placeholder="Search product by name, SKU, HSN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
              <button className="p-2 text-slate-300">
                <Zap size={16} />
              </button>
            </div>

            {/* categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveCat(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCat === null
                    ? "bg-emerald-600 text-black font-medium"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setActiveCat(c._id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeCat === c._id
                      ? "bg-emerald-600 text-black font-medium"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* content list */}
          <div ref={containerRef} className="flex-1 overflow-auto -mx-2 px-2">
            {view === "list" ? (
              <ul className="space-y-2">
                {products.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => onAdd(p)}
                    className="cursor-pointer p-2 rounded-lg flex items-center gap-3 hover:bg-slate-800/40 border border-transparent hover:border-slate-700"
                  >
                    <Thumb src={p.photo || null} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="truncate">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-slate-400 truncate">
                            {p.categoryName || ""}
                          </div>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div className="text-emerald-400 font-semibold">
                            ₹{p.salePrice}
                          </div>
                          <div className="text-xs text-slate-500">
                            HSN {p.hsn || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {typeof p.stock === "number" && p.stock <= 3 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-700 text-white">
                            <AlertCircle size={12} /> Low stock ({p.stock})
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Stock: {p.stock ?? "-"}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          SKU: {p.sku ?? "-"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {products.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onAdd(p)}
                    className="cursor-pointer p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <Thumb src={p.photo || null} />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-slate-400">
                          ₹{p.salePrice}
                        </div>
                        <div className="text-xs text-slate-500">
                          Stock: {p.stock ?? "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* loading / empty */}
            {!products.length && (
              <div className="p-6 text-center text-slate-500">
                No products found
              </div>
            )}

            {hasMore && (
              <div className="py-4 text-center text-slate-400">
                Loading more…
              </div>
            )}
          </div>

          {/* footer quick actions */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setProducts([]);
                fetchProducts(1, true);
              }}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
            >
              Refresh
            </button>

            <div className="text-xs text-slate-400">
              Tip: Click an item to add
            </div>

            <button
              onClick={onClose}
              className="px-3 py-2 bg-emerald-600 rounded text-black font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
