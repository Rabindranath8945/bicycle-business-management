"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Search as SearchIcon,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
} from "lucide-react";
import ProductQuickDrawer from "@/components/ProductQuickDrawer";
import ProductRow from "@/components/ProductRow";

type Product = {
  _id: string;
  name: string;
  categoryName?: string;
  stock?: number;
  salePrice: number;
  costPrice?: number;
  hsn?: string;
  sku?: string;
  photo?: string | null; // single photo only
  active?: boolean;
};

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkMode, setBulkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const limit = 30;

  // fetch categories once
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

  // load products (simple paginated API expected)
  const fetchProducts = async (p = 1, replace = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(p));
      params.append("limit", String(limit));
      if (q) params.append("q", q);
      if (category) params.append("category", category);
      params.append("sortBy", sortBy);
      params.append("sortDir", sortDir);

      const res = await axios.get(`/api/products?${params.toString()}`);
      const data: Product[] = res.data || [];
      setProducts((prev) => (replace ? data : [...prev, ...data]));
      setHasMore(Array.isArray(data) && data.length === limit);
      setPage(p);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, sortBy, sortDir]);

  // infinite scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!hasMore || loading) return;
      const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
      if (bottom) fetchProducts(page + 1);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, loading, page]);

  // keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        // open add product (redirect)
        window.location.href = "/products/new";
      }
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Delete" && bulkMode) {
        // bulk delete
        handleBulkDelete();
      }
      if (e.key === "Enter") {
        // if a single row is highlighted, open drawer - (not implemented row highlight here)
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [bulkMode, selected]);

  const toggleSelect = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const selectAll = () => {
    const newSel: Record<string, boolean> = {};
    products.forEach((p) => (newSel[p._id] = true));
    setSelected(newSel);
  };

  const clearSelect = () => {
    setSelected({});
    setBulkMode(false);
  };

  const handleOpenDrawer = (p: Product) => {
    setDrawerProduct(p);
    setDrawerOpen(true);
  };

  const handleSaveProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setDrawerOpen(false);
    toast.success("Product saved");
  };

  const handleQuickPriceUpdate = async (id: string, price: number) => {
    try {
      await axios.patch(`/api/products/${id}`, { salePrice: price });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, salePrice: price } : p))
      );
      toast.success("Price updated");
    } catch {
      toast.error("Failed to update price");
    }
  };

  const handleQuickStockUpdate = async (id: string, stock: number) => {
    try {
      await axios.patch(`/api/products/${id}`, { stock });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock } : p))
      );
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (!ids.length) return toast.error("No items selected");
    if (!confirm(`Delete ${ids.length} products?`)) return;
    try {
      await axios.post("/api/products/bulk-delete", { ids });
      setProducts((prev) => prev.filter((p) => !ids.includes(p._id)));
      clearSelect();
      toast.success("Deleted");
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  const exportCsv = () => {
    if (!products.length) return toast.error("No products");
    const rows = [["Name", "Category", "Stock", "Price", "HSN", "SKU"]];
    products.forEach((p) =>
      rows.push([
        p.name,
        p.categoryName ?? "",
        String(p.stock ?? ""),
        String(p.salePrice),
        p.hsn ?? "",
        p.sku ?? "",
      ])
    );
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="p-6 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
            <p className="text-sm text-slate-400">
              Manage inventory — inline edits, quick actions, bulk operations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => (window.location.href = "/products/new")}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-black px-3 py-2 rounded-lg shadow"
              title="Add Product (F1)"
            >
              <Plus size={14} /> Add Product
            </button>

            <button
              onClick={exportCsv}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-700 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded px-3 py-2">
              <SearchIcon size={16} className="text-slate-400" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, SKU, HSN..."
                className="bg-transparent outline-none w-full"
              />
            </div>

            <select
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSortBy("name");
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded"
              >
                Name{" "}
                {sortBy === "name" ? (
                  sortDir === "asc" ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                ) : null}
              </button>

              <button
                onClick={() => {
                  setSortBy("price");
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded"
              >
                Price{" "}
                {sortBy === "price" ? (
                  sortDir === "asc" ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                ) : null}
              </button>

              <button
                onClick={() => {
                  setSortBy("stock");
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded"
              >
                Stock{" "}
                {sortBy === "stock" ? (
                  sortDir === "asc" ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                ) : null}
              </button>
            </div>

            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setBulkMode((b) => !b);
                  if (!bulkMode) setSelected({});
                }}
                className={`px-3 py-2 rounded ${
                  bulkMode
                    ? "bg-emerald-600 text-black"
                    : "bg-slate-800 border border-slate-700 text-slate-200"
                }`}
              >
                {bulkMode ? "Bulk mode" : "Bulk"}
              </button>
              <button
                onClick={() => {
                  selectAll();
                  setBulkMode(true);
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded"
              >
                Select all
              </button>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-0 bg-slate-800 text-slate-300 p-3 text-sm">
            <div className="col-span-1 pl-3">
              {bulkMode ? (
                <input
                  type="checkbox"
                  checked={
                    Object.values(selected).filter(Boolean).length ===
                      products.length && products.length > 0
                  }
                  onChange={(e) =>
                    e.target.checked ? selectAll() : clearSelect()
                  }
                />
              ) : null}
            </div>
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1 text-center">Stock</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-right pr-3">Actions</div>
          </div>

          {/* Rows container */}
          <div ref={listRef} className="max-h-[62vh] overflow-auto">
            <AnimatePresence initial={false}>
              {products.map((p) => (
                <ProductRow
                  key={p._id}
                  product={p}
                  selected={!!selected[p._id]}
                  bulkMode={bulkMode}
                  onToggleSelect={() => toggleSelect(p._id)}
                  onOpen={() => handleOpenDrawer(p)}
                  onQuickPrice={(price) => handleQuickPriceUpdate(p._id, price)}
                  onQuickStock={(stock) => handleQuickStockUpdate(p._id, stock)}
                />
              ))}
            </AnimatePresence>

            {loading && (
              <div className="p-4 text-center text-slate-400">Loading...</div>
            )}

            {!loading && products.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* footer / pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <div>{products.length} products</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchProducts(1, true)}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded"
            >
              Refresh
            </button>
            <button
              onClick={() => fetchProducts(page + 1)}
              disabled={!hasMore}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded"
            >
              {hasMore ? "Load more" : "End"}
            </button>
          </div>
        </div>
      </div>

      <ProductQuickDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        product={drawerProduct}
        onSave={(p) => handleSaveProduct(p)}
      />
    </div>
  );
}
