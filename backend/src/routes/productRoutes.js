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

router.post("/", upload.array("photos", 10), createProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.put("/:id", upload.array("photos", 10), updateProduct);

router.delete("/:id", deleteProduct);

export default router;
