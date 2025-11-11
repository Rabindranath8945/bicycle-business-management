import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String },
    gstNumber: { type: String },
    openingBalance: { type: Number, default: 0 },
    balanceType: { type: String, enum: ["credit", "debit"], default: "credit" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
