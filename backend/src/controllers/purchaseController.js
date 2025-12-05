// src/controllers/purchaseController.js
import Purchase from "../models/Purchase.js";
import GRN from "../models/GRN.js";
import {
  addBatchToProduct,
  addBatchToProductWithSession,
} from "../utils/inventory.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
import { getOrCreateAccount, createJournalEntry } from "../utils/accounting.js";
import Supplier from "../models/Supplier.js";

export async function createPurchase(req, res) {
  const session = await mongoose.startSession();
  await connectDB();
  try {
    session.startTransaction();
    const body = req.body;
    const billNo = `PB-${Date.now()}`;
    const subtotal = (body.items || []).reduce(
      (s, it) => s + it.quantity * (it.rate || 0),
      0
    );
    const taxTotal = (body.items || []).reduce(
      (s, it) => s + (it.tax || 0) * (it.quantity || 0),
      0
    );
    const totalAmount = subtotal - (body.discount || 0) + (taxTotal || 0);
    const dueAmount = totalAmount - (body.paidAmount || 0);

    // If no grn provided -> add batches (implicit receipt)
    if (!body.grn) {
      for (const it of body.items) {
        await addBatchToProductWithSession(
          {
            product: it.product,
            receivedQty: it.quantity,
            cost: it.rate,
            batchNo: it.batchNo || `PB-${Date.now()}`,
            expiry: it.expiry || null,
            supplierId: body.supplier,
          },
          session
        );
      }
    } else {
      // validate GRN exists
      const grn = await GRN.findById(body.grn).session(session);
      if (!grn) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "GRN not found" });
      }
    }

    const purchaseDoc = await Purchase.create(
      [
        {
          ...body,
          billNo,
          subtotal,
          taxTotal,
          totalAmount,
          dueAmount,
        },
      ],
      { session }
    );

    const purchase = purchaseDoc[0];

    // --- Accounting (double-entry) ---
    // Get accounts or create defaults. In production you should map these account ids in settings.
    const purchaseExpenseAcc = await getOrCreateAccount(
      { code: "PURCHASE_EXP", name: "Purchases", type: "expense" },
      session
    );
    const gstInputAcc = await getOrCreateAccount(
      { code: "GST_INPUT", name: "GST Input", type: "asset" },
      session
    );
    // Supplier account code pattern
    const supplierAccCode = `SUPPLIER_${String(body.supplier)}`;
    const supplierAcc = await getOrCreateAccount(
      {
        code: supplierAccCode,
        name: `Supplier ${String(body.supplier)}`,
        type: "liability",
      },
      session
    );

    // Prepare journal lines: Debit Purchase (expense) + Debit GST Input (if any) ; Credit Supplier
    const purchaseAmount = subtotal - (body.discount || 0);
    const gstAmount = taxTotal;
    const voucherNo = `JV-PB-${Date.now()}`;

    const lines = [
      {
        accountId: purchaseExpenseAcc._id,
        debit: purchaseAmount,
        credit: 0,
        narration: `Purchase ${billNo}`,
      },
    ];
    if (gstAmount && gstAmount > 0) {
      lines.push({
        accountId: gstInputAcc._id,
        debit: gstAmount,
        credit: 0,
        narration: `GST for ${billNo}`,
      });
    }
    lines.push({
      accountId: supplierAcc._id,
      debit: 0,
      credit: purchaseAmount + gstAmount,
      narration: `Supplier liability for ${billNo}`,
    });

    await createJournalEntry(
      {
        voucherNo,
        date: new Date(),
        lines,
        refType: "Purchase",
        refId: purchase._id,
        createdBy: body.createdBy || null,
      },
      session
    );

    // If paidAmount exists -> create payment journal (supplier Dr, Cash/Bank Cr)
    if (body.paidAmount && body.paidAmount > 0) {
      const cashAcc = await getOrCreateAccount(
        { code: "CASH", name: "Cash", type: "asset" },
        session
      );
      const payVoucher = `JV-PAY-${Date.now()}`;
      const payLines = [
        {
          accountId: supplierAcc._id,
          debit: body.paidAmount,
          credit: 0,
          narration: `Payment to supplier ${body.supplier}`,
        },
        {
          accountId: cashAcc._id,
          debit: 0,
          credit: body.paidAmount,
          narration: `Cash/Bank payment for ${billNo}`,
        },
      ];
      await createJournalEntry(
        {
          voucherNo: payVoucher,
          date: new Date(),
          lines: payLines,
          refType: "Payment",
          refId: purchase._id,
          createdBy: body.createdBy || null,
        },
        session
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(purchase);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("items.product");

    if (!purchase)
      return res.status(404).json({ message: "Purchase not found" });

    res.json(purchase);
  } catch (err) {
    console.error("Get purchase error:", err);
    res.status(500).json({ message: "Failed to fetch purchase" });
  }
};

export async function listPurchases(req, res) {
  try {
    const purchases = await Purchase.find()
      .populate("supplier")
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    console.error("List purchases error:", err);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
}
