import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // 🔥 FIX 1 — your controller uses categoryId; unify naming
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    salePrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    wholesalePrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },

    // 🔥 FIX 2 — missing barcode field (required for Scan Mode & search)
    barcode: { type: String, unique: true, sparse: true },

    productNumber: { type: String }, // auto-generated internal ID
    sku: { type: String },

    hsn: { type: String },

    photo: { type: String, default: null },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
