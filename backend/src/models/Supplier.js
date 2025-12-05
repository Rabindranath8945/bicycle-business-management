// models/Supplier.ts
import mongoose, { Schema, model } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: String,
    gstin: String,
    email: String,
    address: String,
    opening_balance: { type: Number, default: 0 },
    credit_limit: { type: Number, default: 0 },
    ledger: [
      {
        type: {
          type: String,
          enum: ["purchase", "payment", "return", "adjustment"],
          required: true,
        },
        amount: Number,
        date: { type: Date, default: () => new Date() },
        refId: String,
        note: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Supplier || model("Supplier", SupplierSchema);
