import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  hsn: { type: String },
  qty: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  taxPercent: { type: Number, required: true, default: 0 },
  taxAmount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
});

const SaleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    customerName: { type: String },
    phone: { type: String },
    items: [ItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Other"],
      default: "Cash",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
