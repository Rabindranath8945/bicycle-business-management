// src/routes/grnRoutes.js
import express from "express";
import { createGRN, listGRN, getGRN } from "../controllers/grnController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createGRN as createGRNSchema } from "../validators/purchaseSchemas.js";

const router = express.Router();

// CREATE GRN (validated)
router.post("/", validate(createGRNSchema), createGRN);

// LIST GRNs
router.get("/", listGRN);

// GET single GRN
router.get("/:id", getGRN);

export default router;
