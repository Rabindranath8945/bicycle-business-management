// src/models/PurchaseReturn.js
import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    consumedBatches: [{ batchNo: String, qty: Number, cost: Number }],
  },
  { _id: false }
);

const purchaseReturnSchema = new mongoose.Schema(
  {
    returnNo: { type: String, required: true, unique: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      default: null,
    }, // linked bill optional
    items: [returnItemSchema],
    totalAmount: Number,
    creditNoteRef: String,
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.models.PurchaseReturn ||
  mongoose.model("PurchaseReturn", purchaseReturnSchema);
