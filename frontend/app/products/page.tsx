"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import {
  Search,
  Edit,
  Trash2,
  PlusCircle,
  PackageOpen,
  X,
  Eye,
} from "lucide-react";
import Link from "next/link";
import JsBarcode from "jsbarcode";

interface Product {
  _id: string;
  name?: string;
  productNumber?: string;
  sku?: string;
  categoryId?: { name?: string } | string | null;
  sellingPrice?: number;
  costPrice?: number;
  barcode?: string;
  photos?: string[]; // MAYBE undefined
  photo?: string; // fallback single photo field
  stock?: number;
  hsn?: string;
  [key: string]: any;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "default" | "az" | "price_asc" | "price_desc"
  >("default");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // multi-select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllVisible, setSelectAllVisible] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Quick view modal
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [mainQuickImage, setMainQuickImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/products");
        const data = res.data || [];
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build list of categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const name =
        typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [products]);

  // Apply search, category, sort
  useEffect(() => {
    let out = products.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q) ||
          (p.productNumber || "").toLowerCase().includes(q) ||
          (typeof p.categoryId === "string"
            ? p.categoryId.toLowerCase().includes(q)
            : (p.categoryId?.name || "").toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      out = out.filter((p) => {
        const name =
          typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name;
        return name === selectedCategory;
      });
    }

    if (sortBy === "az") {
      out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "price_asc") {
      out.sort(
        (a, b) => Number(a.sellingPrice || 0) - Number(b.sellingPrice || 0)
      );
    } else if (sortBy === "price_desc") {
      out.sort(
        (a, b) => Number(b.sellingPrice || 0) - Number(a.sellingPrice || 0)
      );
    }

    setFiltered(out);
    // reset page to 1 whenever filters change
    setPage(1);
    // ensure selectedIds only contains visible ids
    setSelectedIds((prev) =>
      prev.filter((id) => out.some((p) => p._id === id))
    );
    // un-check selectAllVisible when filter changes
    setSelectAllVisible(false);
  }, [products, search, sortBy, selectedCategory]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Render barcodes: use product _id in DOM id so it's stable
  useEffect(() => {
    paginated.forEach((p) => {
      if (!p.barcode) return;
      try {
        JsBarcode(`#barcode-${p._id}`, String(p.barcode), {
          format: "CODE128",
          width: 1.2,
          height: 45,
          displayValue: false,
          margin: 0,
          lineColor: "#000",
        });
      } catch (err) {
        console.warn("Barcode render error for", p._id, err);
      }
    });
  }, [paginated]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      const upd = products.filter((x) => x._id !== id);
      setProducts(upd);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } catch (err) {
      console.error("delete failed", err);
      alert("Delete failed");
    }
  };

  const openQuickView = (p: Product) => {
    setQuickProduct(p);
    const main = p.photos?.[0] ?? p.photo ?? "/no-image.png";
    setMainQuickImage(main);
    setQuickOpen(true);
  };

  const closeQuick = () => {
    setQuickOpen(false);
    setQuickProduct(null);
    setMainQuickImage(null);
  };

  const handleThumbnailClick = (src?: string) => {
    if (!src) return;
    setMainQuickImage(src);
  };

  // ------------------ Multi-select helpers ------------------
  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  };

  const toggleSelectAllVisible = () => {
    setSelectAllVisible((s) => {
      const next = !s;
      if (next) {
        // select all currently visible in the grid (paginated)
        setSelectedIds(paginated.map((p) => p._id));
      } else {
        setSelectedIds([]);
      }
      return next;
    });
  };

  // ------------------ Export to Excel ------------------
  const exportExcel = useCallback(() => {
    import("xlsx")
      .then((xlsx) => {
        const exportData = filtered.map((p) => ({
          ID: p._id,
          Name: p.name ?? "",
          Category:
            typeof p.categoryId === "string"
              ? p.categoryId
              : p.categoryId?.name ?? "",
          ProductNumber: p.productNumber ?? "",
          SKU: p.sku ?? "",
          SellingPrice: p.sellingPrice ?? 0,
          CostPrice: p.costPrice ?? 0,
          Stock: p.stock ?? 0,
          HSN: p.hsn ?? "",
          Barcode: p.barcode ?? "",
        }));

        const sheet = xlsx.utils.json_to_sheet(exportData);
        const book = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(book, sheet, "Products");
        xlsx.writeFile(book, `products_${new Date().toISOString()}.xlsx`);
      })
      .catch((err) => {
        console.error("Failed to export excel", err);
        alert("Excel export failed. Make sure xlsx is installed.");
      });
  }, [filtered]);

  // ------------------ CSV Export (no dependency) ------------------
  const exportCSV = useCallback(() => {
    if (!filtered.length) {
      alert("No products to export");
      return;
    }

    const rows = filtered.map((p) => ({
      ID: p._id,
      Name: p.name ?? "",
      Category:
        typeof p.categoryId === "string"
          ? p.categoryId
          : p.categoryId?.name ?? "",
      ProductNumber: p.productNumber ?? "",
      SKU: p.sku ?? "",
      SellingPrice: p.sellingPrice ?? 0,
      CostPrice: p.costPrice ?? 0,
      Stock: p.stock ?? 0,
      HSN: p.hsn ?? "",
      Barcode: p.barcode ?? "",
    }));

    const header = Object.keys(rows[0]);
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header
          .map((h) => {
            const cell = String((r as any)[h] ?? "");
            // escape quotes
            return `"${cell.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `products_${new Date().toISOString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }, [filtered]);

  // ------------------ Delete selected ------------------
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Delete ${selectedIds.length} selected products? This cannot be undone.`
      )
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`/api/products/${id}`))
      );
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p._id)));
      setSelectedIds([]);
      setSelectAllVisible(false);
      alert("Selected products deleted");
    } catch (err) {
      console.error("delete selected failed", err);
      alert("Failed to delete selected products");
    }
  };

  // Keep page in valid range if totalPages changes
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  if (loading) {
    return (
      <div className="p-6 text-slate-400 text-center">Loading products...</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-400">
            Product Inventory
          </h1>
          <p className="text-slate-400 text-sm">
            Premium product cards with multi-photo, barcode, and quick actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSortBy("default");
                setSearch("");
              }}
              className="text-xs px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300"
            >
              Reset
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-slate-200"
            >
              <option value="default">Sort</option>
              <option value="az">A → Z</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Buttons */}
            <button
              onClick={exportExcel}
              className="text-xs px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200"
            >
              Export Excel
            </button>

            <button
              onClick={exportCSV}
              className="text-xs px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200"
            >
              Export CSV
            </button>

            {/* Delete Selected */}
            <button
              disabled={selectedIds.length === 0}
              onClick={deleteSelected}
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              Delete Selected ({selectedIds.length})
            </button>

            <Link
              href="/products/new"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg shadow"
            >
              <PlusCircle size={16} /> Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Category Chips */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, SKU, product number..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 py-2 text-sm text-slate-200"
          />
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {/* Category dropdown (new) */}
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-slate-200"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Select all visible toggle */}
          <label className="ml-2 text-xs flex items-center gap-1 text-slate-300">
            <input
              type="checkbox"
              checked={selectAllVisible}
              onChange={toggleSelectAllVisible}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-xs">Select visible</span>
          </label>
        </div>
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center text-slate-400 py-14">
          <PackageOpen size={40} className="mx-auto mb-3 text-slate-500" /> No
          products found
        </div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {paginated.map((p) => {
            const photos = p.photos ?? (p.photo ? [p.photo] : []);
            const mainImage = photos[0] ?? "/no-image.png";
            const categoryName =
              p.categoryName ??
              (typeof p.categoryId === "string" ? "" : p.categoryId?.name) ??
              "Uncategorized";
            const stock = p.stock ?? 0;
            const checked = selectedIds.includes(p._id);

            return (
              <motion.div
                key={p._id}
                layout
                whileHover={{ scale: 1.015 }}
                className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-lg hover:border-emerald-500/50 transition relative"
              >
                {/* Checkbox top-left */}
                <div className="absolute left-3 top-3 z-10">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleSelect(p._id, e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Image area */}
                <div className="w-full h-44 bg-slate-800 rounded-lg overflow-hidden mb-3 relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImage}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />

                  {photos.length > 1 && (
                    <div className="absolute right-2 top-2 flex flex-col gap-1">
                      {photos.slice(0, 3).map((src, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded border border-slate-700 overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`thumb-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title and quick actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base text-white font-semibold truncate">
                      {p.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">
                      <span className="block">
                        Product No: {p.productNumber ?? "—"}
                      </span>
                      <span className="block">SKU: {p.sku ?? "—"}</span>
                      <span className="block">
                        Category:{" "}
                        <span className="text-emerald-400">{categoryName}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        stock > 10
                          ? "bg-emerald-600/20 text-emerald-400"
                          : stock > 0
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {stock > 0 ? `${stock} in stock` : "Out of stock"}
                    </div>
                  </div>
                </div>

                {/* Prices */}
                <div className="mt-3 flex justify-between items-end">
                  <div>
                    <div className="text-emerald-400 font-semibold">
                      ₹{Number(p.sellingPrice ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">Selling</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-semibold">
                      ₹{Number(p.costPrice ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">Cost</div>
                  </div>
                </div>

                {/* Barcode */}
                <div className="mt-3 text-center">
                  {p.barcode ? (
                    <>
                      <svg
                        id={`barcode-${p._id}`}
                        className="w-full h-[50px]"
                      />
                      <div className="text-xs text-slate-500 mt-1 truncate">
                        {p.barcode}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500">No Barcode</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4 pt-3 border-t border-slate-700">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openQuickView(p)}
                      className="text-slate-300 hover:text-emerald-400 flex items-center gap-1 text-sm"
                    >
                      <Eye size={15} />
                      Quick
                    </button>

                    <Link
                      href={`/products/edit/${p._id}`}
                      className="text-slate-300 hover:text-emerald-400 flex items-center gap-1 text-sm"
                    >
                      <Edit size={15} /> Edit
                    </Link>
                  </div>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-slate-300 hover:text-red-500 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-slate-200"
        >
          <option value={8}>8 / page</option>
          <option value={12}>12 / page</option>
          <option value={16}>16 / page</option>
          <option value={20}>20 / page</option>
        </select>

        <div className="flex gap-3 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-slate-700 rounded disabled:opacity-40 text-slate-300"
          >
            Prev
          </button>

          <span className="text-slate-400 text-sm">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-slate-700 rounded disabled:opacity-40 text-slate-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Quick view modal */}
      {quickOpen && quickProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 max-w-3xl w-full rounded-xl p-4 relative">
            <button
              onClick={closeQuick}
              className="absolute right-3 top-3 text-slate-300 hover:text-white"
            >
              <X />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="w-full h-72 bg-slate-800 rounded-lg overflow-hidden mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainQuickImage ?? "/no-image.png"}
                    className="w-full h-full object-contain p-4 bg-black/5"
                    alt="main"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(
                    quickProduct.photos ??
                    (quickProduct.photo ? [quickProduct.photo] : [])
                  ).map((src, i) => (
                    <button
                      key={i}
                      onClick={() => handleThumbnailClick(src)}
                      className="w-20 h-20 rounded border border-slate-700 overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt={`thumb-${i}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg text-white font-semibold">
                  {quickProduct.name}
                </h2>
                <div className="text-xs text-slate-400 mt-2">
                  <div>Product No: {quickProduct.productNumber ?? "—"}</div>
                  <div>SKU: {quickProduct.sku ?? "—"}</div>
                  <div>
                    Category:{" "}
                    <span className="text-emerald-400">
                      {quickProduct.categoryName ??
                        (typeof quickProduct.categoryId === "string"
                          ? ""
                          : quickProduct.categoryId?.name) ??
                        "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 items-end">
                  <div>
                    <div className="text-2xl text-emerald-400 font-semibold">
                      ₹{Number(quickProduct.sellingPrice ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">Selling Price</div>
                  </div>

                  <div>
                    <div className="text-xl text-yellow-400 font-semibold">
                      ₹{Number(quickProduct.costPrice ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">Cost Price</div>
                  </div>
                </div>

                <div className="mt-4">
                  {quickProduct.barcode ? (
                    <>
                      <svg
                        id={`quickbar-${quickProduct._id}`}
                        className="w-full h-[60px]"
                      />
                      <div className="text-xs text-slate-500 mt-2">
                        {quickProduct.barcode}
                      </div>
                      {/* render quick barcode */}
                      <BarcodeRenderer
                        id={`quickbar-${quickProduct._id}`}
                        value={quickProduct.barcode}
                      />
                    </>
                  ) : (
                    <div className="text-xs text-slate-500">No Barcode</div>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  <Link
                    href={`/products/edit/${quickProduct._id}`}
                    className="px-4 py-2 bg-emerald-600 text-white rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      deleteProduct(quickProduct._id);
                      closeQuick();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Helper component: small wrapper to render barcode into svg identified by id
 * This isolated component uses JsBarcode and runs on mount.
 */
function BarcodeRenderer({ id, value }: { id: string; value?: string }) {
  useEffect(() => {
    if (!value) return;
    try {
      JsBarcode(`#${id}`, value, {
        format: "CODE128",
        width: 1.2,
        height: 45,
        displayValue: false,
        margin: 0,
        lineColor: "#000",
      });
    } catch (err) {
      console.warn("BarcodeRenderer failed", err);
    }
  }, [id, value]);

  return <svg id={id} className="w-full h-[50px]" />;
}
