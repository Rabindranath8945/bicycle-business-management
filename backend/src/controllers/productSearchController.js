import Product from "../models/Product.js";

export const searchProducts = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 30 } = req.query;

    const filter = {
      name: { $regex: q, $options: "i" },
    };

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("categoryId", "name");

    res.json(
      products.map((p) => ({
        ...p._doc,
        categoryName: p.categoryId?.name || "Uncategorized",
      }))
    );
  } catch (err) {
    console.log("❌ Product Search Error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};
