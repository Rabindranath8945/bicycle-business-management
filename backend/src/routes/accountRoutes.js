import express from "express";
import {
  getLedger,
  addTransaction,
  getProfitLoss,
} from "../controllers/accountController.js";

const router = express.Router();

// Ledger
router.get("/", getLedger);

// Add manual transaction
router.post("/", addTransaction);

// Profit & Loss summary
router.get("/profit-loss", getProfitLoss);

export default router;
