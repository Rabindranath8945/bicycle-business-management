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

export default router;
