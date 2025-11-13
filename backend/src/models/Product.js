import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  salePrice: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: "pcs" },
  gst: { type: Number, default: 0 },
  hsn: { type: String },
  productNumber: { type: String },
});

export default mongoose.model("Product", ProductSchema);
