"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, MoreHorizontal } from "lucide-react";

// ⭐ Safe number formatter — avoids toFixed() crashes
const safeNum = (v: any, digits = 2) => {
  const n = Number(v);
  return isNaN(n) ? (0).toFixed(digits) : n.toFixed(digits);
};

type Product = {
  _id: string;
  name: string;
  categoryName?: string;
  stock?: number | string;
  salePrice: number | string;
  costPrice?: number | string;
  wholesalePrice?: number | string;
  productNumber?: string;
  sku?: string;
  barcode?: string;
  photo?: string | null;
  active?: boolean;
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

  const [priceValue, setPriceValue] = useState(String(product.salePrice ?? ""));
  const [stockValue, setStockValue] = useState(String(product.stock ?? ""));

  const stockBadge = () => {
    const s = Number(product.stock ?? 0);
    if (s <= 5)
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-700 text-white">
          Low {s}
        </span>
      );
    if (s <= 20)
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-600 text-black">
          Low {s}
        </span>
      );
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-black">
        {s}
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
      className="group border-b border-slate-700 hover:bg-slate-800/60 transition"
    >
      <div className="grid grid-cols-12 items-center p-3 gap-2">
        {/* Checkbox */}
        <div className="col-span-1 pl-3">
          {bulkMode && (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
            />
          )}
        </div>

        {/* PRODUCT PHOTO + NAME + SKU */}
        <div className="col-span-3 flex items-center gap-3">
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
            <div className="font-medium text-sm">{product.name}</div>

            <div className="text-xs text-slate-400">
              {product.productNumber ? (
                <span>#{product.productNumber}</span>
              ) : null}{" "}
              {product.sku ? <span className="ml-1">• {product.sku}</span> : ""}
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="col-span-2 text-sm text-slate-300">
          {product.categoryName ?? "-"}
        </div>

        {/* STOCK */}
        <div className="col-span-1 text-center">
          {editingStock ? (
            <input
              className="w-16 bg-slate-800 border border-slate-700 rounded px-1 py-1 text-center text-sm"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onQuickStock(Number(stockValue) || 0);
                  setEditingStock(false);
                }
              }}
              autoFocus
            />
          ) : (
            <button onDoubleClick={() => setEditingStock(true)}>
              {stockBadge()}
            </button>
          )}
        </div>

        {/* SELLING PRICE */}
        <div className="col-span-1 text-right pr-2 font-medium">
          {editingPrice ? (
            <input
              className="w-16 bg-slate-800 border border-slate-700 rounded px-1 py-1 text-right text-sm"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onQuickPrice(Number(priceValue) || 0);
                  setEditingPrice(false);
                }
              }}
              autoFocus
            />
          ) : (
            <div
              className="cursor-pointer"
              onDoubleClick={() => setEditingPrice(true)}
            >
              ₹ {safeNum(product.salePrice)}
            </div>
          )}
        </div>

        {/* COST PRICE */}
        <div className="col-span-1 text-right pr-2 text-slate-300 text-sm">
          ₹ {safeNum(product.costPrice)}
        </div>

        {/* WHOLESALE PRICE */}
        <div className="col-span-1 text-right pr-2 text-slate-300 text-sm">
          ₹ {safeNum(product.wholesalePrice)}
        </div>

        {/* BARCODE */}
        <div className="col-span-1 text-xs text-slate-400 text-center">
          {product.barcode ?? "-"}
        </div>

        {/* ACTIONS */}
        <div className="col-span-1 pr-3 text-right">
          <div className="inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={onOpen}
              className="p-2 bg-slate-800 border border-slate-700 rounded"
              title="Edit"
            >
              <Edit3 size={14} />
            </button>
            <button
              className="p-2 bg-slate-800 border border-slate-700 rounded"
              title="More"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
