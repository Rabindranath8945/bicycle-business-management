import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    category: { type: String }, // snapshot of category name

    sellingPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    wholesalePrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },
    unit: { type: String, default: "pcs" },

    hsn: { type: String },
    sku: { type: String },
    barcode: { type: String },
    productNumber: { type: String, unique: true },

    photos: [String],
    photo: String, // first image
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
