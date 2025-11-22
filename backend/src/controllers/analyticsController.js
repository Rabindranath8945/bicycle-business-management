import Sale from "../models/Sale.js";

export const getSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const todaySales = await Sale.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);

    const monthSales = await Sale.aggregate([
      { $match: { createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);

    const avgOrder = await Sale.aggregate([
      { $group: { _id: null, avg: { $avg: "$grandTotal" } } },
    ]);

    const itemsSold = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, count: { $sum: "$items.qty" } } },
    ]);

    res.json({
      todaySales: todaySales[0]?.total || 0,
      monthSales: monthSales[0]?.total || 0,
      avgOrder: avgOrder[0]?.avg || 0,
      itemsSold: itemsSold[0]?.count || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics error", error: err.message });
  }
};
