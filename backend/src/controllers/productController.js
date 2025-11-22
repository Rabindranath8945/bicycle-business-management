import Product from "../models/Product.js";
import Category from "../models/Category.js";
import {
  generateBarcode,
  generateSKU,
  generateProductNumber,
} from "../utils/generateCode.js";

// Auto HSN helper
const autoHSN = (name = "") => {
  name = name.toLowerCase();
  if (name.includes("cycle")) return "8712";
  if (name.includes("accessory")) return "8714";
  if (name.includes("part")) return "8714";
  if (name.includes("tyre")) return "4011";
  if (name.includes("tube")) return "4013";
  return "9999";
};

/* ------------------------------------------------------------------
   CREATE PRODUCT  (backend also generates barcode + sku + productNumber)
--------------------------------------------------------------------- */
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

    // Backend always generates codes if missing
    const finalSKU = sku || generateSKU(name);
    const finalBarcode = generateBarcode();
    const finalProductNumber = generateProductNumber();
    const finalHSN = hsn || autoHSN(name);

    const product = new Product({
      name,
      categoryId: category,
      salePrice: Number(sellingPrice),
      costPrice: Number(costPrice || 0),
      wholesalePrice: Number(wholesalePrice || 0),
      stock: Number(stock || 0),

      sku: finalSKU,
      barcode: finalBarcode,
      productNumber: finalProductNumber,
      hsn: finalHSN,
    });

    if (req.file) {
      product.photo = req.file.path;
    }

    await product.save();

    return res.json({ message: "Product created", product });
  } catch (err) {
    console.log("❌ CREATE PRODUCT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ------------------------------------------------------------------
   GET PRODUCTS
--------------------------------------------------------------------- */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    const final = products.map((p) => ({
      ...p.toObject(),
      categoryName: p.categoryId?.name || "Uncategorized",
    }));

    res.json(final);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------------------------------------------
   GET ONE PRODUCT
--------------------------------------------------------------------- */
export const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate(
      "categoryId",
      "name"
    );

    if (!p) return res.status(404).json({ message: "Not found" });

    res.json({
      ...p.toObject(),
      categoryName: p.categoryId?.name || "Uncategorized",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------------------------------------------
   UPDATE PRODUCT
--------------------------------------------------------------------- */
// ----------------------------------------------------------
// UPDATE PRODUCT (supports photo update + all fields)
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

    const update = {};

    if (name) update.name = name;
    if (category) update.categoryId = category;
    if (sellingPrice !== undefined) update.salePrice = Number(sellingPrice);
    if (costPrice !== undefined) update.costPrice = Number(costPrice);
    if (wholesalePrice !== undefined)
      update.wholesalePrice = Number(wholesalePrice);
    if (stock !== undefined) update.stock = Number(stock);

    // codes (only update when sent by UI — do NOT regenerate automatically)
    if (sku) update.sku = sku;
    if (hsn) update.hsn = hsn;

    // If new image is uploaded
    if (req.file) {
      update.photo = req.file.path; // cloudinary URL
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate("categoryId", "name");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: {
        ...updatedProduct._doc,
        categoryName: updatedProduct.categoryId?.name || "",
      },
    });
  } catch (err) {
    console.log("❌ UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message || "Update failed" });
  }
};

/* ------------------------------------------------------------------
   DELETE PRODUCT
--------------------------------------------------------------------- */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------------------------------------------
   SEARCH PRODUCTS   (Used by ProductDrawer & POS)
--------------------------------------------------------------------- */
export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const query = {
      name: { $regex: q, $options: "i" },
    };

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("categoryId", "name")
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formatted = products.map((p) => ({
      ...p.toObject(),
      categoryName: p.categoryId?.name || "Uncategorized",
    }));

    res.json({
      items: formatted,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/* ------------------------------------------------------------------
   GET PRODUCT BY BARCODE   (Used by POS Scan Mode)
--------------------------------------------------------------------- */
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
