import Product from "../models/Product.js";

export const searchProducts = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 30 } = req.query;

    const filter = q ? { name: { $regex: q, $options: "i" } } : {};

    const products = await Product.find(filter)
      .populate("category", "name") // ✔ FIXED!
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(
      products.map((p) => ({
        ...p._doc,
        categoryName: p.category?.name || "Uncategorized",
      }))
    );
  } catch (err) {
    console.log("❌ Product Search Error:", err);
    res.status(500).json({ message: err.message || "Search failed" });
  }
};
