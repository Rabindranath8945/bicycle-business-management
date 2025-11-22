import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
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

// CREATE — supports single photo upload
router.post("/", upload.single("photo"), createProduct);

// UPDATE — same input as create
router.patch("/:id", upload.single("photo"), updateProduct);

// GET ALL
router.get("/", getProducts);

// SEARCH (POS drawer + inventory page)
router.get("/search", searchProducts);

// BARCODE lookup (POS Scan Mode)
router.get("/barcode/:code", getProductByBarcode);

// GET ONE
router.get("/:id", getProductById);

// DELETE
router.delete("/:id", deleteProduct);

export default router;
