// src/controllers/purchaseOrderController.js
import PurchaseOrder from "../models/PurchaseOrder.js";
import connectDB from "../config/db.js";

/**
 * Create PO, List PO, Get PO, Update PO, Confirm PO, Cancel PO
 */

export async function createPO(req, res) {
  try {
    await connectDB();
    const poNumber = `PO-${Date.now()}`;
    const po = await PurchaseOrder.create({ ...req.body, poNumber });
    return res.status(201).json(po);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listPO(req, res) {
  try {
    await connectDB();
    const list = await PurchaseOrder.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getPO(req, res) {
  try {
    await connectDB();
    const { id } = req.params;
    const po = await PurchaseOrder.findById(id)
      .populate("supplier")
      .populate("items.product");
    if (!po) return res.status(404).json({ error: "PO not found" });
    return res.json(po);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function updatePO(req, res) {
  try {
    await connectDB();
    const { id } = req.params;
    const po = await PurchaseOrder.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!po) return res.status(404).json({ error: "PO not found" });
    return res.json(po);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function confirmPO(req, res) {
  try {
    await connectDB();
    const { id } = req.params;
    const po = await PurchaseOrder.findById(id);
    if (!po) return res.status(404).json({ error: "PO not found" });
    po.status = "confirmed";
    await po.save();
    return res.json(po);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function cancelPO(req, res) {
  try {
    await connectDB();
    const { id } = req.params;
    const po = await PurchaseOrder.findById(id);
    if (!po) return res.status(404).json({ error: "PO not found" });
    po.status = "cancelled";
    await po.save();
    return res.json(po);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
