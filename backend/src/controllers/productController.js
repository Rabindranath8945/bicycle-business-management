import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import {
  generateBarcode,
  generateSKU,
  generateProductNumber,
} from "../utils/generateCode.js";

// ✅ Helper: Auto HSN by Category Name
const autoHSN = (categoryName = "") => {
  const name = categoryName.toLowerCase();
  if (name.includes("cycle")) return "8712";
  if (name.includes("accessory")) return "8714";
  if (name.includes("part")) return "8714";
  if (name.includes("tyre")) return "4011";
  if (name.includes("tube")) return "4013";
  return "9999";
};

/* --------------------------------------------------------
   ✔  CREATE PRODUCT
-------------------------------------------------------- */
// ------------------------------------------------------------
// CLEAN, FINAL, FULLY FIXED createProduct
// ------------------------------------------------------------
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      sellingPrice,
      costPrice,
      wholesalePrice,
      stock,
      unit,
      hsn,
      sku,
      barcode,
      productNumber,
    } = req.body;

    // Required fields
    if (!name || !sellingPrice || !costPrice || !categoryId) {
      return res.status(400).json({
        message: "Name, Category, Selling Price, Cost Price are required.",
      });
    }

    // ------------------------------------------------------------
    // CATEGORY FIX
    // ------------------------------------------------------------
    let categoryName = "Uncategorized";

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      const catData = await Category.findById(categoryId);
      if (catData) categoryName = catData.name;
    }

    // ------------------------------------------------------------
    // PHOTO UPLOAD FIX
    // ------------------------------------------------------------
    let photos = [];

    // If multiple photos uploaded: req.files
    if (Array.isArray(req.files) && req.files.length > 0) {
      photos = req.files.map((f) => f.path);
    }

    // If single photo uploaded: req.file (rare case, support anyway)
    if (req.file) {
      photos.push(req.file.path);
    }

    // ------------------------------------------------------------
    // CREATE PRODUCT
    // ------------------------------------------------------------
    const product = await Product.create({
      name,
      categoryId,
      category: categoryName,

      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      wholesalePrice: Number(wholesalePrice) || 0,

      stock: Number(stock),
      unit,
      hsn,

      sku,
      barcode,
      productNumber,

      photos, // array of photos
      photo: photos[0] || null, // backward compatibility
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("❌ createProduct error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------------------
   ✔  GET ALL PRODUCTS
   🔥 FIXED strictPopulateError → removed populate
-------------------------------------------------------- */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name") // GET CATEGORY NAME
      .sort({ createdAt: -1 })
      .lean();

    const formatted = products.map((p) => ({
      _id: p._id,
      name: p.name,
      productNumber: p.productNumber,
      sku: p.sku,
      categoryId: p.categoryId?._id || null,
      categoryName: p.categoryId?.name || "Uncategorized",
      sellingPrice: p.sellingPrice,
      costPrice: p.costPrice,
      wholesalePrice: p.wholesalePrice,
      stock: p.stock,
      hsn: p.hsn,
      barcode: p.barcode,
      photo: p.photo,
      photos: p.photos || [],
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ getProducts error:", err);
    return res.status(500).json({ message: "Server error in getProducts" });
  }
};

/* --------------------------------------------------------
   ✔  GET PRODUCT BY ID
-------------------------------------------------------- */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------------------
   ✔  UPDATE PRODUCT
-------------------------------------------------------- */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const existing = await Product.findById(productId);
    if (!existing)
      return res.status(404).json({ message: "Product not found" });

    // ---------------------------
    // Update BASIC FIELDS
    // ---------------------------
    existing.name = req.body.name || existing.name;
    existing.categoryId = req.body.categoryId || existing.categoryId;
    existing.sellingPrice = req.body.sellingPrice || existing.sellingPrice;
    existing.costPrice = req.body.costPrice || existing.costPrice;
    existing.wholesalePrice =
      req.body.wholesalePrice || existing.wholesalePrice;
    existing.stock = req.body.stock || existing.stock;
    existing.unit = req.body.unit || existing.unit;
    existing.hsn = req.body.hsn || existing.hsn;
    existing.sku = req.body.sku || existing.sku;

    // ---------------------------
    // FIX: Category Auto Populate
    // ---------------------------
    await existing.populate("categoryId", "name");

    // ---------------------------
    // IMAGE LOGIC
    // ---------------------------
    const incomingFiles = req.files ? req.files.map((f) => f.path) : [];

    // CLEAR ALL PHOTOS
    if (req.body.clearPhotos === "1") {
      existing.photos = [];
    }

    // ADD NEW PHOTOS
    if (incomingFiles.length > 0) {
      existing.photos = [...existing.photos, ...incomingFiles];
    }

    // Save final result
    const updated = await existing.save();

    // Ensure category is included in response
    await updated.populate("categoryId", "name");

    res.json(updated);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------------
   ✔  DELETE PRODUCT
-------------------------------------------------------- */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
