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

    const categoryData = categoryId
      ? await Category.findById(categoryId)
      : null;
    const categoryName = categoryData ? categoryData.name : "Uncategorized";

    const productNumber = await generateProductNumber(Product);
    const sku = generateSKU(categoryName);
    const barcode = generateBarcode();
    const auto_hsn = hsn || autoHSN(categoryName);

    // MULTIPLE PHOTOS
    const photos = req.files?.map((file) => file.path) || [];

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

    const body = req.body;

    // keep old photos unless overridden
    let existingPhotos = product.photos || [];

    // Handle clearPhotos flag
    if (body.clearPhotos === "1") {
      existingPhotos = [];
    }

    // Upload new images
    let newPhotos = [];
    if (req.files && req.files.length > 0) {
      newPhotos = req.files.map((file) => file.path);
    }

    // Final merged photos
    const updatedPhotos = [...existingPhotos, ...newPhotos];

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: body.name,
        categoryId: body.categoryId,
        sellingPrice: body.sellingPrice,
        costPrice: body.costPrice,
        wholesalePrice: body.wholesalePrice,
        stock: body.stock,
        unit: body.unit,
        sku: body.sku,
        photos: updatedPhotos,
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ updateProduct error:", error);
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
