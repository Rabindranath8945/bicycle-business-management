import express from "express";
import {
  addSale,
  getSales,
  getSaleById,
} from "../controllers/saleController.js";

const router = express.Router();

router.route("/").get(getSales).post(addSale);

router.route("/:id").get(getSaleById);

export default router;
