// src/controllers/purchaseReturnController.js
import PurchaseReturn from "../models/PurchaseReturn.js";
import Purchase from "../models/Purchase.js";
import { consumeStockFIFOWithSession } from "../utils/inventory.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
import { getOrCreateAccount, createJournalEntry } from "../utils/accounting.js";

export async function createPurchaseReturn(req, res) {
  const session = await mongoose.startSession();
  await connectDB();
  try {
    session.startTransaction();
    const body = req.body;
    const returnNo = `PR-${Date.now()}`;
    const items = [];
    let totalAmount = 0;

    for (const it of body.items) {
      // consume FIFO batches
      const consumed = await consumeStockFIFOWithSession(
        it.product,
        it.qty,
        session
      );
      items.push({ ...it, consumedBatches: consumed });
      totalAmount += it.qty * it.rate;
    }

    const pr = await PurchaseReturn.create(
      [
        {
          returnNo,
          supplier: body.supplier,
          purchase: body.purchase || null,
          items,
          totalAmount,
          createdBy: body.createdBy || null,
        },
      ],
      { session }
    );

    // Accounting: create credit note via journal entry
    // Supplier Dr, Purchase Return (expense contra) Cr
    const purchaseReturnAcc = await getOrCreateAccount(
      { code: "PURCH_RETURN", name: "Purchase Returns", type: "income" },
      session
    );
    const supplierAcc = await getOrCreateAccount(
      {
        code: `SUPPLIER_${String(body.supplier)}`,
        name: `Supplier ${String(body.supplier)}`,
        type: "liability",
      },
      session
    );
    const voucherNo = `JV-PR-${Date.now()}`;

    const lines = [
      {
        accountId: supplierAcc._id,
        debit: 0,
        credit: totalAmount,
        narration: `Supplier credit for return ${returnNo}`,
      },
      {
        accountId: purchaseReturnAcc._id,
        debit: totalAmount,
        credit: 0,
        narration: `Purchase return ${returnNo}`,
      },
    ];
    // Ensure lines are balanced (we used same totalAmount)
    await createJournalEntry(
      {
        voucherNo,
        lines,
        refType: "PurchaseReturn",
        refId: pr[0]._id,
        createdBy: body.createdBy || null,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(pr[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
