// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    salePrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    wholesalePrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },

    productNumber: { type: String }, // auto-generated
    sku: { type: String },
    hsn: { type: String },

    // ⭐ SINGLE PHOTO ONLY
    photo: { type: String, default: null },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
