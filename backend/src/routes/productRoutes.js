import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByBarcode,
} from "../controllers/productController.js";
import { searchProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.single("photo"), createProduct);
router.patch("/:id", upload.single("photo"), updateProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.get("/search", searchProducts);
router.get("/barcode/:code", getProductByBarcode);

export default router;
