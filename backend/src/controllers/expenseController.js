import Expense from "../models/Expense.js";

// 📋 Get all expenses
export const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

// 📝 Create a new expense
export const createExpense = async (req, res, next) => {
  try {
    const { type, amount, date, description, paymentMethod } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ message: "Type and Amount are required" });
    }

    const expense = await Expense.create({
      type,
      amount,
      date,
      description,
      paymentMethod,
    });

    res.status(201).json({ success: true, message: "Expense added", expense });
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete an expense
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();
    res.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    next(error);
  }
};

// 📌 Get single expense by ID
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    next(error);
  }
};
