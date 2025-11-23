import express from "express";
import {
  createSale,
  getSale,
  listSales,
  getByBarcode,
} from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js"; // <— update path if needed

const router = express.Router();

// ================================
// CREATE SALE
// ================================
router.post("/", protect, createSale);

// ================================
// GET ALL SALES
// ================================
router.get("/", protect, listSales);

// ================================
// GET SINGLE SALE
// ================================
router.get("/:id", protect, getSale);

// ================================
// GET BY BARCODE
// ================================
router.get("/barcode/:code", getByBarcode);

// GET TODAY SALES — Dashboard
router.get("/today", protect, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const total = await Sale.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.json({ total: total[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RECENT 5 SALES — Dashboard
router.get("/recent", protect, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const recent = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("invoiceNo total createdAt");

    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
