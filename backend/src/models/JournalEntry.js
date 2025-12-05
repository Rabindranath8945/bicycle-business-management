// src/models/JournalEntry.js
import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    narration: String,
  },
  { _id: false }
);

const journalSchema = new mongoose.Schema(
  {
    voucherNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    lines: [lineSchema],
    refType: String,
    refId: mongoose.Schema.Types.ObjectId,
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.models.JournalEntry ||
  mongoose.model("JournalEntry", journalSchema);
