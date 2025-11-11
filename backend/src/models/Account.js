import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Sale", "Purchase", "Expense", "Payment"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "typeRef",
    },
    typeRef: {
      type: String,
      enum: ["Sale", "Purchase", "Expense", "Payment"],
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "UPI", "Credit"],
      default: "Cash",
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", transactionSchema);

export default Account;
