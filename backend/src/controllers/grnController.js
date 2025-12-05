import GRN from "../models/GRN.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import mongoose from "mongoose";
import { addBatchToProductWithSession } from "../utils/inventory.js";

/**
 * CREATE GRN (Hybrid Mode)
 * - If PO exists → validate items & update receivedQty
 * - If NO PO → free-style receiving (DreamPOS mode)
 * - Always update stock using FIFO batches
 */
export async function createGRN(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = req.body;

    if (!body.items || body.items.length === 0) {
      return res.status(400).json({ error: "GRN must contain products." });
    }

    // 1️⃣ Validate supplier exists
    const supplier = await Supplier.findById(body.supplier).session(session);
    if (!supplier) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Supplier not found" });
    }

    let po = null;

    // 2️⃣ If PO is linked → validate it
    if (body.poId) {
      po = await PurchaseOrder.findById(body.poId).session(session);

      if (!po) {
        await session.abortTransaction();
        return res.status(400).json({ error: "Purchase Order not found" });
      }
    }

    // 3️⃣ For each item → update stock using FIFO Batch
    for (const item of body.items) {
      await addBatchToProductWithSession(
        {
          product: item.product,
          receivedQty: item.receivedQty,
          cost: item.rate || item.costPrice,
          batchNo: item.batchNo,
          expiry: item.expiry,
          supplierId: body.supplier,
        },
        session
      );
    }

    // 4️⃣ If PO exists → update receivedQty inside PO
    if (po) {
      body.items.forEach((grnItem) => {
        const poItem = po.items.find(
          (i) => i.product.toString() === grnItem.product.toString()
        );

        if (poItem) {
          poItem.receivedQty = (poItem.receivedQty || 0) + grnItem.receivedQty;

          // Mark if fully received
          poItem.status =
            poItem.receivedQty >= poItem.quantity ? "received" : "partial";
        }
      });

      // Check overall PO status
      const allReceived = po.items.every(
        (i) => (i.receivedQty || 0) >= i.quantity
      );

      po.status = allReceived ? "completed" : "partial";

      await po.save({ session });
    }

    // 5️⃣ Create GRN Document
    const grnNumber = `GRN-${Date.now()}`;

    const newGRN = await GRN.create(
      [
        {
          ...body,
          grnNo: grnNumber,
          status: "received",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newGRN[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("GRN Error:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * LIST ALL GRNs
 */
export async function listGRN(req, res) {
  try {
    const grns = await GRN.find()
      .populate("supplier", "name phone")
      .sort({ createdAt: -1 });

    res.json(grns);
  } catch (err) {
    console.error("List GRN Error:", err);
    res.status(500).json({ message: "Failed to fetch GRNs" });
  }
}

/**
 * GET SINGLE GRN DETAILS
 */
export async function getGRN(req, res) {
  try {
    const grn = await GRN.findById(req.params.id)
      .populate("supplier")
      .populate("items.product");

    if (!grn) {
      return res.status(404).json({ message: "GRN not found" });
    }

    res.json(grn);
  } catch (err) {
    console.error("Get GRN Error:", err);
    res.status(500).json({ message: "Failed to fetch GRN" });
  }
}
