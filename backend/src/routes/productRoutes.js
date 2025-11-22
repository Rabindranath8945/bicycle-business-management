import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// CREATE with multiple photos
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 6 },
    { name: "photos", maxCount: 6 },
  ]),
  createProduct
);

// UPDATE with multiple photos
router.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 6 },
    { name: "photos", maxCount: 6 },
  ]),
  updateProduct
);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
