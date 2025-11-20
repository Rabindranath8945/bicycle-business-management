import express from "express";
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import Category from "../models/Category.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/categories
router.get("/", getCategories);

// POST /api/categories
router.post("/", addCategory);

// DELETE /api/categories/:id
router.delete("/:id", deleteCategory);

// GET /api/categories/all-with-count
router.get("/all-with-count", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const products = await Product.find().select("categoryId").lean();

    const result = categories.map((cat) => ({
      ...cat,
      productCount: products.filter(
        (p) => String(p.categoryId) === String(cat._id)
      ).length,
    }));

    res.json(result);
  } catch (err) {
    console.error("Category count error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
