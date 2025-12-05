// src/routes/purchaseReturnRoutes.js
import express from "express";
import { createPurchaseReturn } from "../controllers/purchaseReturnController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createPurchaseReturn as schemaCreatePurchaseReturn } from "../validators/purchaseSchemas.js";

const router = express.Router();
router.post("/", validate(schemaCreatePurchaseReturn), createPurchaseReturn);
export default router;
