"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, MoreHorizontal } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  categoryName?: string;
  stock?: number;
  salePrice: number;
  photo?: string | null;
  active?: boolean;
  hsn?: string;
  sku?: string;
};

export default function ProductRow({
  product,
  selected,
  bulkMode,
  onToggleSelect,
  onOpen,
  onQuickPrice,
  onQuickStock,
}: {
  product: Product;
  selected: boolean;
  bulkMode: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  onQuickPrice: (price: number) => void;
  onQuickStock: (stock: number) => void;
}) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [editingStock, setEditingStock] = useState(false);
  const [priceValue, setPriceValue] = useState(String(product.salePrice));
  const [stockValue, setStockValue] = useState(String(product.stock ?? 0));

  const stockBadge = () => {
    const s = product.stock ?? 0;
    if (s <= 5)
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-700 text-white">
          Low {s}
        </span>
      );
    if (s <= 20)
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-sky-600 text-black">
          Limited {s}
        </span>
      );
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-black">
        In stock {s}
      </span>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="group border-b border-slate-700 hover:shadow-[0_6px_18px_rgba(16,185,129,0.04)]"
    >
      <div className="grid grid-cols-12 gap-0 items-center p-3">
        <div className="col-span-1 pl-3">
          {bulkMode ? (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
            />
          ) : null}
        </div>

        <div className="col-span-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded overflow-hidden flex-shrink-0">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                📷
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-slate-400">
              {product.hsn
                ? `HSN ${product.hsn}`
                : product.sku
                ? `SKU ${product.sku}`
                : ""}
            </div>
          </div>
        </div>

        <div className="col-span-2 text-sm text-slate-300">
          {product.categoryName ?? "-"}
        </div>

        <div className="col-span-1 text-center">
          {editingStock ? (
            <input
              className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-sm"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onQuickStock(Number(stockValue || 0));
                  setEditingStock(false);
                }
              }}
            />
          ) : (
            <button
              onDoubleClick={() => setEditingStock(true)}
              className="text-sm"
            >
              {stockBadge()}
            </button>
          )}
        </div>

        <div className="col-span-2 text-right pr-3">
          {editingPrice ? (
            <input
              className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-right text-sm"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onQuickPrice(Number(priceValue || 0));
                  setEditingPrice(false);
                }
              }}
            />
          ) : (
            <div className="font-medium">₹{product.salePrice.toFixed(2)}</div>
          )}
        </div>

        <div className="col-span-1 text-center">
          <div
            className={`inline-block px-2 py-0.5 rounded text-xs ${
              product.active
                ? "bg-emerald-600 text-black"
                : "bg-red-700 text-white"
            }`}
          >
            {product.active ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="col-span-1 pr-3 text-right">
          <div className="inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={onOpen}
              title="Open details"
              className="p-2 bg-slate-800 border border-slate-700 rounded"
            >
              <Edit3 size={14} />
            </button>
            <button
              title="More"
              className="p-2 bg-slate-800 border border-slate-700 rounded"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
