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
    const id = req.params.id;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    let product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const body = req.body;

    // -------------------------------------------------------------
    // CATEGORY FIX
    // -------------------------------------------------------------
    let categoryId = body.categoryId;

    if (
      !categoryId ||
      categoryId === "null" ||
      categoryId === "undefined" ||
      categoryId === ""
    ) {
      categoryId = null;
    } else if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      categoryId = null;
    }

    let categoryName = product.category; // default old category name

    if (categoryId) {
      const catData = await Category.findById(categoryId);
      if (catData) categoryName = catData.name;
    } else {
      categoryName = "Uncategorized";
    }

    // -------------------------------------------------------------
    // PHOTO FIX
    // -------------------------------------------------------------
    let existingPhotos = [];

    if (Array.isArray(product.photos)) existingPhotos = [...product.photos];
    if (product.photo) existingPhotos.push(product.photo); // legacy field

    // clearPhotos flag
    if (body.clearPhotos == "1") {
      existingPhotos = [];
    }

    // new uploaded photos
    const newPhotos =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((f) => f.path)
        : [];

    const finalPhotos = [...existingPhotos, ...newPhotos];

    // -------------------------------------------------------------
    // NUMERIC FIELDS FIX
    // -------------------------------------------------------------
    const castNum = (v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    // -------------------------------------------------------------
    // UPDATE OBJECT
    // -------------------------------------------------------------
    const updates = {
      name: body.name ?? product.name,
      categoryId: categoryId,
      category: categoryName,
      sellingPrice: castNum(body.sellingPrice) ?? product.sellingPrice,
      costPrice: castNum(body.costPrice) ?? product.costPrice,
      wholesalePrice: castNum(body.wholesalePrice) ?? product.wholesalePrice,
      stock: castNum(body.stock) ?? product.stock,
      unit: body.unit ?? product.unit,
      hsn: body.hsn ?? product.hsn,
      sku: body.sku ?? product.sku,
      photos: finalPhotos,
    };

    // -------------------------------------------------------------
    // UPDATE PRODUCT
    // -------------------------------------------------------------
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });

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
