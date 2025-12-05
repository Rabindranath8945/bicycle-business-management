// src/models/Account.js
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["asset", "liability", "equity", "income", "expense"],
      required: true,
    },
    balance: { type: Number, default: 0 }, // optional cached balance
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
