import Account from "../models/Account.js";
import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Expense from "../models/Expense.js";

// 📋 Get all transactions (ledger)
export const getLedger = async (req, res, next) => {
  try {
    const ledger = await Account.find().sort({ date: -1 });
    res.json(ledger);
  } catch (error) {
    next(error);
  }
};

// 📝 Add manual transaction
export const addTransaction = async (req, res, next) => {
  try {
    const { type, referenceId, amount, date, description, paymentMethod } =
      req.body;

    if (!type || !amount)
      return res.status(400).json({ message: "Type and amount required" });

    const transaction = await Account.create({
      type,
      referenceId,
      amount,
      date,
      description,
      paymentMethod,
    });

    res
      .status(201)
      .json({ success: true, message: "Transaction added", transaction });
  } catch (error) {
    next(error);
  }
};

// 📊 Get Profit & Loss summary
export const getProfitLoss = async (req, res, next) => {
  try {
    const sales = await Sale.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const purchases = await Purchase.aggregate([
      { $group: { _id: null, totalPurchases: { $sum: "$totalAmount" } } },
    ]);
    const expenses = await Expense.aggregate([
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);

    const totalSales = sales[0]?.totalSales || 0;
    const totalPurchases = purchases[0]?.totalPurchases || 0;
    const totalExpenses = expenses[0]?.totalExpenses || 0;
    const netProfit = totalSales - totalPurchases - totalExpenses;

    res.json({ totalSales, totalPurchases, totalExpenses, netProfit });
  } catch (error) {
    next(error);
  }
};
