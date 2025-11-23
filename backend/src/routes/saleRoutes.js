import express from "express";
import {
  createSale,
  getSale,
  listSales,
  getByBarcode,
} from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";
import Sale from "../models/Sale.js";

const router = express.Router();

/* -----------------------------
   DASHBOARD ENDPOINTS
------------------------------ */
router.get("/top-products", protect, async (req, res) => {
  const top = await Sale.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        qtySold: { $sum: "$items.qty" },
      },
    },
    { $sort: { qtySold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 1,
        name: "$product.name",
        qtySold: 1,
        img: "$product.photo",
      },
    },
  ]);

  res.json(top);
});

// TODAY'S TOTAL SALES
router.get("/today", protect, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    console.error("Today sales error:", err);
    res.status(500).json({ message: err.message });
  }
});

// RECENT SALES (LIMIT 5)
router.get("/recent", protect, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const recent = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("invoiceNo total createdAt");

    res.json(recent);
  } catch (err) {
    console.error("Recent sales error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------
   SALE CRUD
------------------------------ */

// CREATE SALE
router.post("/", protect, createSale);

// GET ALL SALES
router.get("/", protect, listSales);

// GET SINGLE SALE
router.get("/:id", protect, getSale);

// FIND BY BARCODE (no auth)
router.get("/barcode/:code", getByBarcode);

export default router;
