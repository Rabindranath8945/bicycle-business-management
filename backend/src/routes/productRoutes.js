import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import Product from "../models/Product.js";

const router = express.Router();

// ☁️ Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bicycle-pos/products", // your Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), createProduct);
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name").lean();

    return res.status(200).json(products);
  } catch (error) {
    console.error("GET /api/products ERROR:", error);
    res.status(500).json({
      message: "Server error in getProducts",
      error: error.message,
      stack: error.stack,
    });
  }
});

router.get("/:id", getProductById);
router.put("/:id", upload.single("photo"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
