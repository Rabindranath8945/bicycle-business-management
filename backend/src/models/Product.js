import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    hsn: { type: String },
    unit: { type: String, default: "pcs" },
    stock: { type: Number, default: 0 },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    description: { type: String },
    barcode: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
