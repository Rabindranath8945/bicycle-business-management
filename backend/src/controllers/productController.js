import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import {
  generateBarcode,
  generateSKU,
  generateProductNumber,
} from "../utils/generateCode.js";

const autoHSN = (name = "") => {
  name = name.toLowerCase();
  if (name.includes("cycle")) return "8712";
  if (name.includes("accessory")) return "8714";
  if (name.includes("part")) return "8714";
  if (name.includes("tyre")) return "4011";
  if (name.includes("tube")) return "4013";
  return "9999";
};

// ----------------------------------------------------------
// CREATE PRODUCT (backend generates codes)
// ----------------------------------------------------------
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

    if (!name || !categoryId || !sellingPrice || !costPrice)
      return res.status(400).json({ message: "Missing required fields" });

    // Fetch category name
    let categoryName = "Uncategorized";
    const cat = await Category.findById(categoryId);
    if (cat) categoryName = cat.name;

    // Photos from Cloudinary
    let photos = [];
    if (Array.isArray(req.files)) photos = req.files.map((f) => f.path);

    // Auto-generate codes
    const sku = generateSKU(categoryName);
    const barcode = generateBarcode();
    const productNumber = await generateProductNumber(Product);
    const auto_hsn = hsn || autoHSN(categoryName);

    // Save
    const created = await Product.create({
      name,
      categoryId,
      category: categoryName,
      sellingPrice,
      costPrice,
      wholesalePrice: wholesalePrice || 0,
      stock,
      unit,
      hsn: auto_hsn,
      sku,
      barcode,
      productNumber,
      photos,
      photo: photos[0] || null,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------------
// GET PRODUCTS
// ----------------------------------------------------------
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.json(
      products.map((p) => ({
        ...p._doc,
        categoryName: p.categoryId?.name || "Uncategorized",
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------------
// GET ONE PRODUCT
// ----------------------------------------------------------
export const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate(
      "categoryId",
      "name"
    );
    if (!p) return res.status(404).json({ message: "Not found" });

    res.json({
      ...p._doc,
      categoryName: p.categoryId?.name || "Uncategorized",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------------
// UPDATE PRODUCT
// ----------------------------------------------------------
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Not found" });

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

    if (name) product.name = name;
    if (categoryId) product.categoryId = categoryId;
    if (sellingPrice) product.sellingPrice = sellingPrice;
    if (costPrice) product.costPrice = costPrice;
    if (wholesalePrice) product.wholesalePrice = wholesalePrice;
    if (stock) product.stock = stock;
    if (unit) product.unit = unit;
    if (hsn) product.hsn = hsn;

    // Update category snapshot
    if (categoryId) {
      const cat = await Category.findById(categoryId);
      product.category = cat?.name || product.category;
    }

    // Handle clear photos
    if (req.body.clearPhotos === "1") product.photos = [];

    // Add new photos
    if (req.files?.length > 0) {
      product.photos = [...product.photos, ...req.files.map((f) => f.path)];
    }

    product.photo = product.photos[0] || null;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------------
// DELETE PRODUCT
// ----------------------------------------------------------
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
