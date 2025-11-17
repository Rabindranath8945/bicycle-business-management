import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // category relation
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // for backward compatibility (string category name)
    category: { type: String },

    // pricing
    sellingPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    wholesalePrice: { type: Number, default: 0 },

    // stock
    stock: { type: Number, default: 0 },
    unit: { type: String, default: "pcs" },

    // codes
    hsn: { type: String },
    sku: { type: String },
    barcode: { type: String },
    productNumber: { type: String, unique: true },

    // photo URL
    photo: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
