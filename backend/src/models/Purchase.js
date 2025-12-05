// models/Purchase.js  (upgrade of current Purchase model)
import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: String,
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    subTotal: { type: Number, required: true },
  },
  { _id: false }
);

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [purchaseItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paymentType: {
      type: String,
      enum: ["cash", "bank", "credit"],
      default: "cash",
    },
    notes: String,
    date: { type: Date, default: Date.now },

    // Links for workflow Mode 2
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      default: null,
    },
    grn: { type: mongoose.Schema.Types.ObjectId, ref: "GRN", default: null },
    billNo: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase ||
  mongoose.model("Purchase", purchaseSchema);
