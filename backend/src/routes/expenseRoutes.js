import express from "express";
import {
  getAllExpenses,
  createExpense,
  deleteExpense,
  getExpenseById,
} from "../controllers/expenseController.js";

const router = express.Router();

router.route("/").get(getAllExpenses).post(createExpense);

router.route("/:id").get(getExpenseById).delete(deleteExpense);

export default router;
