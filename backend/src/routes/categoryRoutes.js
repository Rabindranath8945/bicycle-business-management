import express from "express";
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);
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
    res.status(500).json({ message: err.message });
  }
});

export default router;
