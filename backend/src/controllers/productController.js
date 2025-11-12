import Product from "../models/Product.js";
import Category from "../models/Category.js";
import {
  generateBarcode,
  generateSKU,
  generateProductNumber,
} from "../utils/generateCode.js";

// ✅ Helper: Auto HSN Code by Category
const autoHSN = (categoryName = "") => {
  const name = categoryName.toLowerCase();
  if (name.includes("cycle")) return "8712";
  if (name.includes("accessory")) return "8714";
  if (name.includes("part")) return "8714";
  if (name.includes("tyre")) return "4011";
  if (name.includes("tube")) return "4013";
  return "9999"; // default
};

// ✅ CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      sellingPrice, // frontend field
      costPrice,
      wholesalePrice,
      stock,
      unit,
      hsn,
    } = req.body;

    // 🛑 Validate required fields
    if (!name || !categoryId || !sellingPrice || !costPrice) {
      return res
        .status(400)
        .json({
          message: "Name, category, salePrice and costPrice are required.",
        });
    }

    // 🧭 Find category name by ID
    let categoryData = await Category.findById(categoryId);
    const categoryName = categoryData ? categoryData.name : "Uncategorized";

    // 🧩 Generate auto fields
    const sku = generateSKU(categoryName);
    const barcode = generateBarcode();
    const productNumber = generateProductNumber();

    // ☁️ Get Cloudinary photo path
    const photo = req.file ? req.file.path : req.body.photo || null;

    // ✅ Create and save product
    const product = new Product({
      name,
      category: categoryName, // backend expects 'category'
      categoryId,
      salePrice: sellingPrice, // backend expects salePrice
      costPrice,
      wholesalePrice,
      stock,
      unit,
      hsn,
      sku,
      barcode,
      productNumber,
      photo,
    });

    const savedProduct = await product.save();
    const populated = await savedProduct.populate("categoryId", "name");

    res.status(201).json(populated);
  } catch (error) {
    console.error("❌ createProduct error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    const formatted = products.map((p) => ({
      ...p._doc,
      category: p.categoryId?.name || p.category || "Uncategorized",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ getProducts error:", err);
    res.status(500).json({ message: "Server error in getProducts" });
  }
};

// ✅ GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedData = { ...req.body };
    if (req.file) updatedData.photo = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
