import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// CREATE with multiple photos
router.post("/", upload.single("photo"), createProduct);

// UPDATE with multiple photos
router.patch("/:id", upload.single("photo"), updateProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
