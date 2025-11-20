import express from "express";
import {
  createSale,
  listSales,
  getSaleById,
  downloadInvoicePDF,
} from "../controllers/saleController.js";

const router = express.Router();

router.post("/", createSale);
router.get("/", listSales);
router.get("/:id", getSaleById);
router.get("/:id/pdf", downloadInvoicePDF);

export default router;
