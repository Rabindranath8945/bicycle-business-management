import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import Product from "../models/Product.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductByBarcode,
} from "../controllers/productController.js";

const router = express.Router();

/* -----------------------------
   DASHBOARD ENDPOINTS
------------------------------ */

// TOTAL PRODUCT COUNT
router.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Product count error:", err);
    res.status(500).json({ message: err.message });
  }
});

// LOW STOCK COUNT
router.get("/low-stock/count", async (req, res) => {
  try {
    const LOW_STOCK_LIMIT = 5;
    const count = await Product.countDocuments({
      stock: { $lt: LOW_STOCK_LIMIT },
    });
    res.json({ count });
  } catch (err) {
    console.error("Low stock count error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------
   PRODUCT CRUD
------------------------------ */

// CREATE — supports single photo upload
router.post("/", upload.single("photo"), createProduct);

// UPDATE
router.patch("/:id", upload.single("photo"), updateProduct);

// GET ALL
router.get("/", getProducts);

// SEARCH
router.get("/search", searchProducts);

// BARCODE LOOKUP
router.get("/barcode/:code", getProductByBarcode);

// GET ONE
router.get("/:id", getProductById);

// DELETE
router.delete("/:id", deleteProduct);

export default router;
