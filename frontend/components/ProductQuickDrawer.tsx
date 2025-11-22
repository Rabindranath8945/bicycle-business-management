"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Trash } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  salePrice: number;
  category?: { _id: string; name: string };
  categoryName?: string;
  stock?: number;
  costPrice?: number;
  photo?: string | null;
  hsn?: string;
  sku?: string;
  active?: boolean;
};

export default function ProductQuickDrawer({
  open,
  onClose,
  product,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (p: Product) => void;
}) {
  const [local, setLocal] = useState<Product | null>(product);

  useEffect(() => {
    setLocal(product);
  }, [product]);

  if (!product) return null;

  const handleSave = async () => {
    if (!local) return;
    try {
      const res = await axios.patch(`/api/products/${local._id}`, {
        name: local.name,
        sellingPrice: local.salePrice, // FIXED
        stock: local.stock,
        costPrice: local.costPrice,
        hsn: local.hsn,
        active: local.active,
        // ensure category is provided
        category: product.category?._id || undefined,
      });
      onSave(res.data.product);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete product?")) return;
    try {
      await axios.delete(`/api/products/${product._id}`);
      toast.success("Deleted");
      onClose();
      // consumer should refresh or remove item from list
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={open ? { x: 0 } : { x: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-slate-900/95 backdrop-blur z-50 border-l border-slate-700"
    >
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-slate-400">{product.categoryName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 border border-slate-700 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 overflow-auto space-y-4">
        <div className="flex gap-4">
          <div className="w-36 h-36 bg-slate-800 rounded overflow-hidden">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No photo
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="text-xs text-slate-400">Name</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
                value={local?.name || ""}
                onChange={(e) =>
                  setLocal(local ? { ...local, name: e.target.value } : null)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400">Sale Price</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
                  value={local?.salePrice ?? 0}
                  onChange={(e) =>
                    setLocal(
                      local
                        ? { ...local, salePrice: Number(e.target.value) }
                        : null
                    )
                  }
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Stock</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
                  value={local?.stock ?? 0}
                  onChange={(e) =>
                    setLocal(
                      local ? { ...local, stock: Number(e.target.value) } : null
                    )
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400">Cost Price</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
                  value={local?.costPrice ?? 0}
                  onChange={(e) =>
                    setLocal(
                      local
                        ? { ...local, costPrice: Number(e.target.value) }
                        : null
                    )
                  }
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">HSN</label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
                  value={local?.hsn ?? ""}
                  onChange={(e) =>
                    setLocal(local ? { ...local, hsn: e.target.value } : null)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-black inline-flex items-center gap-2"
          >
            <Save /> Save
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white inline-flex items-center gap-2"
          >
            <Trash /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
