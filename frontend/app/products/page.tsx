"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
// Assuming axios is configured correctly in your project
import axios from "@/lib/axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Search as SearchIcon,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Trash2,
  Package,
  Edit,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ListFilter,
  IndianRupee,
  Barcode,
  Hash,
  Tag,
} from "lucide-react";
// Assuming these external components exist and are styled neutrally or lightly
// import ProductQuickDrawer from "@/components/ProductQuickDrawer";
// import ProductRow from "@/components/ProductRow";

// --- UPDATED Types ---
type Product = {
  _id: string;
  name: string;
  categoryName?: string;
  stock?: number;
  salePrice: number;
  costPrice?: number;
  wholesalePrice?: number; // New Field
  hsn?: string;
  sku?: string;
  barcode?: string; // New Field
  productNumber?: string; // New Field
  photo?: string | null;
  active?: boolean;
};
type Category = { _id: string; name: string };
type SortField =
  | "name"
  | "price"
  | "stock"
  | "categoryName"
  | "costPrice"
  | "wholesalePrice";

// --- Mock External Components (Adapted for premium look) ---
const ProductQuickDrawer = ({ open, onClose, product, onSave }: any) => null;

// --- Custom Product Row Component ---
const ProductRow = ({
  product,
  toggleSelect,
  handleOpenDrawer,
  selected,
}: any) => {
  const stockStatus =
    product.stock === 0
      ? "Out of Stock"
      : product.stock! < 20
      ? "Low Stock"
      : "In Stock";
  const stockColor =
    product.stock === 0
      ? "text-red-600 bg-red-100"
      : product.stock! < 20
      ? "text-yellow-600 bg-yellow-100"
      : "text-emerald-600 bg-emerald-100";
  const StockIcon =
    product.stock === 0
      ? XCircle
      : product.stock! < 20
      ? AlertTriangle
      : CheckCircle;

  return (
    <tr className="hover:bg-blue-50/50 transition duration-150 border-b border-gray-100">
      <td className="p-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(product._id)}
          className="rounded text-[#007BFF] focus:ring-[#007BFF]"
        />
      </td>
      <td className="p-4 flex items-center gap-3 whitespace-nowrap">
        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Package size={16} className="text-gray-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{product.name}</p>
          <p className="text-xs text-gray-400">ID: {product.productNumber}</p>
        </div>
      </td>
      <td className="p-4 text-gray-600 whitespace-nowrap">
        {product.categoryName || "Uncategorized"}
      </td>
      {/* New Row Data: Barcode/SKU */}
      <td className="p-4 whitespace-nowrap">
        <p className="text-xs font-mono text-gray-700 flex items-center gap-2">
          <Tag size={12} /> {product.sku}
        </p>
        <p className="text-xs font-mono text-gray-500 flex items-center gap-2 mt-1">
          <Barcode size={12} /> {product.barcode}
        </p>
      </td>

      <td className="p-4 text-gray-900 font-bold text-right whitespace-nowrap">
        ₹{product.salePrice.toFixed(2)}
      </td>
      {/* New Row Data: Cost Price */}
      <td className="p-4 text-gray-500 text-right whitespace-nowrap">
        ₹{product.costPrice?.toFixed(2) ?? "N/A"}
      </td>
      {/* New Row Data: Wholesale Price */}
      <td className="p-4 text-gray-500 text-right whitespace-nowrap">
        ₹{product.wholesalePrice?.toFixed(2) ?? "N/A"}
      </td>
      <td className="p-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${stockColor}`}
        >
          <StockIcon size={12} />
          {product.stock ?? 0} units
        </span>
      </td>
      <td className="p-4 text-right whitespace-nowrap">
        {/* REPLACED BUTTON WITH NEXT/LINK */}
        <Link
          href={`/products/edit/${product._id}`} // Dynamic link to the edit page
          className="text-[#007BFF] hover:text-[#0056b3] text-sm font-medium flex items-center justify-end gap-2"
        >
          <Edit size={14} /> View/Edit
        </Link>
      </td>
    </tr>
  );
};

// --- Main Component ---

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );
  const isBulkMode = selectedCount > 0;
  const searchRef = useRef<HTMLInputElement | null>(null);

  // MOCK Implementations (Replace with actual axios calls in your project)
  const fetchCategories = async () => {
    // try { const { data } = await axios.get("/api/categories"); setCategories(data); } catch (err) {}
    setCategories([
      { _id: "cat1", name: "Bikes" },
      { _id: "cat2", name: "Accessories" },
      { _id: "cat3", name: "Tools" },
    ]);
  };
  const fetchProducts = async () => {
    // setLoading(true);
    // try { const { data } = await axios.get(`/api/products?...`); setProducts(data); } catch (err) {} finally { setLoading(false); }
    const MOCK_PRODUCTS: Product[] = [
      {
        _id: "p1",
        name: "Mountain Bike X1",
        categoryName: "Bikes",
        stock: 15,
        salePrice: 12000,
        costPrice: 8000,
        wholesalePrice: 9500,
        sku: "BIKE-X1-MTN",
        barcode: "8901234567890",
        productNumber: "PRD-5678",
      },
      {
        _id: "p2",
        name: "Helmet Pro-Safe M",
        categoryName: "Accessories",
        stock: 45,
        salePrice: 2500,
        costPrice: 1500,
        wholesalePrice: 1800,
        sku: "ACC-HLM-PRM",
        barcode: "8901234567891",
        productNumber: "PRD-5679",
      },
      {
        _id: "p3",
        name: "Repair Kit Basic",
        categoryName: "Tools",
        stock: 120,
        salePrice: 450,
        costPrice: 200,
        wholesalePrice: 280,
        sku: "TOOL-KIT-BSC",
        barcode: "8901234567892",
        productNumber: "PRD-5680",
      },
      {
        _id: "p4",
        name: "Gloves (Small)",
        categoryName: "Accessories",
        stock: 0,
        salePrice: 899,
        costPrice: 400,
        wholesalePrice: 550,
        sku: "ACC-GLV-SML",
        barcode: "8901234567893",
        productNumber: "PRD-5681",
      },
      {
        _id: "p5",
        name: "Chain Lube Advanced",
        categoryName: "Maintenance",
        stock: 80,
        salePrice: 350,
        costPrice: 120,
        wholesalePrice: 200,
        sku: "CHEM-LUB-ADV",
        barcode: "8901234567894",
        productNumber: "PRD-5682",
      },
    ];
    setProducts(MOCK_PRODUCTS);
  };
  const handleBulkDelete = async () => {
    toast.success(`Deleted ${selectedCount} products.`);
  };
  const exportCsv = () => {
    toast.success("Exporting data as CSV...");
  };
  const handleOpenDrawer = (p: Product) => {
    setDrawerProduct(p);
    setDrawerOpen(true);
  };
  const toggleSelect = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  const selectAll = () => {
    const newSel: Record<string, boolean> = {};
    products.forEach((p) => (newSel[p._id] = true));
    setSelected(newSel);
  };
  const clearSelect = () => setSelected({});

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Helper for sort headers
  const SortHeader = ({
    title,
    field,
    align = "left",
  }: {
    title: string;
    field: SortField;
    align?: "left" | "right";
  }) => (
    <th
      className={`px-4 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900`}
      onClick={() => {
        if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else {
          setSortBy(field);
          setSortDir("asc");
        }
      }}
    >
      <div
        className={`flex items-center gap-1 ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        {title}
        {sortBy === field &&
          (sortDir === "asc" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          ))}
        {sortBy !== field && <ChevronDown size={14} className="opacity-0" />}
      </div>
    </th>
  );

  return (
    <div className="p-6 min-h-screen bg-[#F9FAFB]">
      {/* Expanded width by removing max-w-7xl on the outer div, keeping it on internal components */}
      <div className="max-w-full mx-auto px-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Products & Inventory
            </h1>
            <p className="text-sm text-gray-500">
              Manage your stock efficiently with quick actions and filtering.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = "/products/new")}
              className="inline-flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3] text-white px-4 py-2.5 rounded-lg shadow-lg transition"
              title="Add Product (F1)"
            >
              <Plus size={18} /> Add Product
            </button>

            <button
              onClick={exportCsv}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 shadow-sm transition"
              title="Export CSV"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Filters & Search Section (Matching Dashboard aesthetic) */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products by name, SKU, or ID..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007BFF] focus:border-[#007BFF] outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={category || ""}
                onChange={(e) => setCategory(e.target.value || null)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-[#007BFF] focus:border-[#007BFF] outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* Added overflow-x-auto to handle horizontal scrolling if the screen is too narrow for all columns */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedCount === products.length && products.length > 0
                      }
                      onChange={
                        selectedCount === products.length
                          ? clearSelect
                          : selectAll
                      }
                      className="rounded text-[#007BFF] focus:ring-[#007BFF]"
                    />
                  </th>
                  <SortHeader title="Product Name/ID" field="name" />
                  <SortHeader title="Category" field="categoryName" />
                  {/* New Headers */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identifiers
                  </th>
                  <SortHeader title="Sale Price" field="price" align="right" />
                  <SortHeader
                    title="Cost Price"
                    field="costPrice"
                    align="right"
                  />
                  <SortHeader
                    title="Wholesale Price"
                    field="wholesalePrice"
                    align="right"
                  />
                  <SortHeader title="Stock Status" field="stock" />
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    selected={!!selected[product._id]}
                    toggleSelect={toggleSelect}
                    handleOpenDrawer={handleOpenDrawer}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="p-4 text-center text-gray-500">
              Loading products...
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No products found matching your criteria.
            </div>
          )}
        </div>

        {/* --- PREMIUM FEATURE: BULK ACTIONS BAR (Sticky) --- */}
        <AnimatePresence>
          {isBulkMode && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 flex items-center gap-6"
            >
              <span className="text-sm font-semibold text-gray-700">
                {selectedCount} items selected
              </span>
              <button
                onClick={clearSelect}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                <Trash2 size={16} /> Delete Selected
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawer Component (Hidden but functional) */}
        <ProductQuickDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          product={drawerProduct}
          onSave={() => {}} // Pass your save handler here
        />
      </div>
    </div>
  );
}
