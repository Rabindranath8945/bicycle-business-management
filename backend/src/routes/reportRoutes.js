import express from "express";
import {
  getDashboardSummary,
  getReportByDateRange,
} from "../controllers/reportController.js";

const router = express.Router();

// Dashboard summary
router.get("/dashboard", getDashboardSummary);

// Reports by date
router.get("/date-range", getReportByDateRange);

export default router;
