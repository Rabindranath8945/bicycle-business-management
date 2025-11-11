import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Expense from "../models/Expense.js";
import Account from "../models/Account.js";

// 📊 Dashboard summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const totalSalesAgg = await Sale.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalPurchasesAgg = await Purchase.aggregate([
      { $group: { _id: null, totalPurchases: { $sum: "$totalAmount" } } },
    ]);
    const totalExpensesAgg = await Expense.aggregate([
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);
    const totalCashInAgg = await Account.aggregate([
      { $match: { paymentMethod: "Cash" } },
      { $group: { _id: null, totalCashIn: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSalesAgg[0]?.totalSales || 0;
    const totalPurchases = totalPurchasesAgg[0]?.totalPurchases || 0;
    const totalExpenses = totalExpensesAgg[0]?.totalExpenses || 0;
    const totalCashIn = totalCashInAgg[0]?.totalCashIn || 0;
    const netProfit = totalSales - totalPurchases - totalExpenses;

    res.json({
      totalSales,
      totalPurchases,
      totalExpenses,
      totalCashIn,
      netProfit,
    });
  } catch (error) {
    next(error);
  }
};

// 📋 Report by date range
export const getReportByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const sales = await Sale.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const purchases = await Purchase.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const expenses = await Expense.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const accounts = await Account.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    res.json({ sales, purchases, expenses, accounts });
  } catch (error) {
    next(error);
  }
};
