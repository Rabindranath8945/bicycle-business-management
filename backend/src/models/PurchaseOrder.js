// models/PurchaseOrder.js
import mongoose from "mongoose";

const purchaseOrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: String,
    sku: String,
    qtyOrdered: { type: Number, required: true },
    qtyReceived: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, unique: true, required: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [purchaseOrderItemSchema],
    status: {
      type: String,
      enum: [
        "draft",
        "confirmed",
        "partially_received",
        "complete",
        "cancelled",
      ],
      default: "draft",
    },
    expectedDate: Date,
    notes: String,
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", purchaseOrderSchema);
