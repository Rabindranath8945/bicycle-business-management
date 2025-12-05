// src/routes/purchaseOrderRoutes.js
import express from "express";
import {
  createPO,
  listPO,
  getPO,
  updatePO,
  confirmPO,
  cancelPO,
} from "../controllers/purchaseOrderController.js";

const router = express.Router();

router.post("/", createPO);
router.get("/", listPO);
router.get("/:id", getPO);
router.put("/:id", updatePO);
router.post("/:id/confirm", confirmPO);
router.post("/:id/cancel", cancelPO);

export default router;
