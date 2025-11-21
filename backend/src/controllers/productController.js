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
    } = req.body;

    if (!name || !sellingPrice || !costPrice) {
      return res.status(400).json({
        message: "name, sellingPrice and costPrice are required.",
      });
    }

    let categoryData = null;
    if (categoryId) {
      categoryData = await Category.findById(categoryId);
    }

    const categoryName = categoryData ? categoryData.name : "Uncategorized";

    const productNumber = await generateProductNumber(Product);
    const sku = generateSKU(categoryName);
    const barcode = generateBarcode();
    const auto_hsn = hsn || autoHSN(categoryName);

    const photos = req.files?.map((f) => f.path) || [];

    const product = await Product.create({
      name,
      categoryId: categoryData?._id || null,
      category: categoryName,
      sellingPrice,
      costPrice,
      wholesalePrice,
      stock,
      unit,
      hsn: auto_hsn,
      sku,
      barcode,
      productNumber,
      photos,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ createProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------------
   ✔  GET ALL PRODUCTS
   🔥 FIXED strictPopulateError → removed populate
-------------------------------------------------------- */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ getProducts error:", error);
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

    // validate ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const body = req.body || {};
    const updates = {};

    // ------------ CATEGORY HANDLING (SAFE) ------------
    let categoryId = body.categoryId;

    // Normalize empty/unusable values
    if (
      !categoryId ||
      categoryId === "" ||
      categoryId === "null" ||
      categoryId === "undefined"
    ) {
      updates.categoryId = null;
    } else if (mongoose.Types.ObjectId.isValid(categoryId)) {
      updates.categoryId = categoryId; // Mongoose will auto-cast
    } else {
      updates.categoryId = null; // fallback
    }

    // ------------ BASIC STRING FIELDS ------------

    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.unit !== undefined) updates.unit = String(body.unit).trim();
    if (body.sku !== undefined) updates.sku = String(body.sku).trim();
    if (body.category !== undefined) updates.category = String(body.category);

    // ------------ NUMERIC FIELDS (SAFE CAST) ------------
    const castNum = (v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const sp = castNum(body.sellingPrice);
    if (sp !== undefined) updates.sellingPrice = sp;

    const cp = castNum(body.costPrice);
    if (cp !== undefined) updates.costPrice = cp;

    const wp = castNum(body.wholesalePrice);
    if (wp !== undefined) updates.wholesalePrice = wp;

    const st = castNum(body.stock);
    if (st !== undefined) updates.stock = st;

    // ------------ HSN ------------

    if (body.hsn !== undefined) updates.hsn = String(body.hsn).trim();

    // ------------ PHOTOS HANDLING ------------
    let existingPhotos = Array.isArray(product.photos)
      ? [...product.photos]
      : [];

    // If "clearPhotos" flag sent → wipe existing photos
    if (
      body.clearPhotos === "1" ||
      body.clearPhotos === 1 ||
      body.clearPhotos === true
    ) {
      existingPhotos = [];
    }

    // New uploaded files (via multer/cloudinary)
    const newPhotos =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((f) => f.path)
        : [];

    // Merge old + new
    updates.photos = [...existingPhotos, ...newPhotos];

    // ------------ APPLY UPDATE ------------
    const updated = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ updateProduct error:", error);
    return res.status(500).json({ message: error.message });
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
