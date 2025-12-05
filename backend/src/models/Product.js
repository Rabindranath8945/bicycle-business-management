import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    batchNo: { type: String }, // Auto or manual
    qty: { type: Number, default: 0 }, // Batch quantity
    cost: { type: Number, default: 0 }, // Actual purchase cost
    expiry: { type: Date }, // Optional expiry
    receivedAt: { type: Date, default: Date.now }, // For FIFO sorting
    supplierId: {
      // Useful for returns
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    salePrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 }, // Avg or last cost
    wholesalePrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0 }, // Auto-updated using batches

    // 🔥 FIFO/Batches to support Odoo-style purchasing
    batches: [BatchSchema],

    // Auto-generated codes
    sku: { type: String },
    barcode: { type: String, unique: true, sparse: true },
    productNumber: { type: String },

    hsn: { type: String, default: "" },

    photo: { type: String, default: null },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
