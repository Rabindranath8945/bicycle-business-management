import express from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  deletePurchase,
} from "../controllers/purchaseController.js";

const router = express.Router();

router.route("/").post(createPurchase).get(getAllPurchases);

router.route("/:id").get(getPurchaseById).delete(deletePurchase);

export default router;
