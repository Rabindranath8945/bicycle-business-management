// src/routes/purchaseRoutes.js
import express from "express";
import {
  createPurchase,
  listPurchases,
  getPurchase,
} from "../controllers/purchaseController.js";

import { validate } from "../middleware/validateMiddleware.js";
import { createPurchase as createPurchaseSchema } from "../validators/purchaseSchemas.js";

const router = express.Router();

// Create Purchase (with validation)
router.post("/", validate(createPurchaseSchema), createPurchase);

// List purchases
router.get("/", listPurchases);

// Get single purchase
router.get("/:id", getPurchase);

export default router;
