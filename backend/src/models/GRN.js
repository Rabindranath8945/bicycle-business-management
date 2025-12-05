// models/GRN.js
import mongoose from "mongoose";

const grnItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    receivedQty: { type: Number, required: true },
    batchNo: String,
    expiry: Date,
    cost: Number,
    tax: Number,
  },
  { _id: false }
);

const grnSchema = new mongoose.Schema(
  {
    grnNumber: { type: String, required: true, unique: true },
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      default: null,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [grnItemSchema],
    receivedBy: String,
    receivedAt: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.GRN || mongoose.model("GRN", grnSchema);
