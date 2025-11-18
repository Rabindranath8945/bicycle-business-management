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

    // legacy category name
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

    // photo
    photo: { type: String },
    photos: [String],
  },
  {
    timestamps: true,
  }
);

// ❌ remove duplicate indexes
// If productNumber is unique, we define only one index:
// ProductSchema.index({ productNumber: 1 }, { unique: true });

// ❌ DO NOT create index on name here unless required
// You had duplicate { name: 1 } index warnings.

export default mongoose.model("Product", ProductSchema);
