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
      category,
      sellingPrice,
      costPrice,
      wholesalePrice,
      stock,
      sku,
      hsn,
    } = req.body;

    if (!name || !sellingPrice || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = new Product({
      name,
      categoryId: category,
      salePrice: Number(sellingPrice),
      costPrice: Number(costPrice || 0),
      wholesalePrice: Number(wholesalePrice || 0),
      stock: Number(stock || 0),
      sku,
      hsn,
      // photo gets added below if exists
    });

    // If a file is uploaded
    if (req.file) {
      product.photo = req.file.path; // Cloudinary URL
    }

    await product.save();

    return res.json({ message: "Product created", product });
  } catch (err) {
    console.log("❌ CREATE PRODUCT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------------
// GET PRODUCTS
// ----------------------------------------------------------
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(
      products.map((p) => ({
        ...p._doc,
        categoryName: p.category?.name || "Uncategorized",
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
      "category",
      "name"
    );
    if (!p) return res.status(404).json({ message: "Not found" });

    res.json({
      ...p._doc,
      categoryName: p.category?.name || "Uncategorized",
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
    const {
      name,
      category,
      sellingPrice,
      costPrice,
      wholesalePrice,
      stock,
      sku,
      hsn,
    } = req.body;

    const update = {
      name,
      categoryId: category,
      salePrice: Number(sellingPrice),
      costPrice: Number(costPrice || 0),
      wholesalePrice: Number(wholesalePrice || 0),
      stock: Number(stock || 0),
      sku,
      hsn,
    };

    if (req.file) {
      update.photo = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({ message: "Updated", product: updated });
  } catch (err) {
    console.log("❌ UPDATE PRODUCT ERROR:", err);
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

export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";
    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    })
      .limit(50)
      .sort({ name: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    const code = req.params.code;

    const product = await Product.findOne({ barcode: code });

    if (!product) return res.status(404).json({ message: "Not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Barcode lookup failed" });
  }
};
