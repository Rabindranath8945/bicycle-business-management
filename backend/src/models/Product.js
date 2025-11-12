import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    salePrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    wholesalePrice: { type: Number },
    stock: { type: Number, default: 0 },
    unit: { type: String },
    hsn: { type: String },
    sku: { type: String },
    barcode: { type: String },
    productNumber: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
