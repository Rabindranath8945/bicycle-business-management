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

    // 🛑 Validate required fields
    if (!name || !sellingPrice || !costPrice) {
      return res.status(400).json({
        message: "name, sellingPrice and costPrice are required.",
      });
    }

    // 🧭 Find category (optional)
    const categoryData = categoryId
      ? await Category.findById(categoryId)
      : null;

    const categoryName = categoryData ? categoryData.name : "Uncategorized";

    // 🧩 Auto fields
    const productNumber = generateProductNumber();
    const sku = generateSKU(categoryName);
    const barcode = generateBarcode();
    const auto_hsn = hsn || autoHSN(categoryName);

    // 📸 Photo (cloudinary or local)
    const photo = req.file ? req.file.path : req.body.photo || null;

    // ✅ Create product
    const product = await Product.create({
      name,
      categoryId: categoryData ? categoryData._id : null,
      sellingPrice,
      costPrice,
      wholesalePrice,
      stock,
      unit,
      hsn: auto_hsn,
      sku,
      barcode,
      productNumber,
      photo,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ createProduct error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------------------
   ✔  GET ALL PRODUCTS
   🔥 FIXED strictPopulateError → removed populate
-------------------------------------------------------- */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const formatted = products.map((p) => ({
      _id: p._id,
      name: p.name,
      categoryId: p.categoryId || null,
      price: p.sellingPrice ?? 0,
      stock: p.stock ?? 0,
      hsn: p.hsn || "N/A",
      createdAt: p.createdAt,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ getProducts error:", error);
    res.status(500).json({ message: "Server error in getProducts" });
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedData = { ...req.body };

    if (req.file) updatedData.photo = req.file.path;

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
