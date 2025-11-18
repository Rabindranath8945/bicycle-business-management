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
    const id = req.params.id;
    // validate product id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const body = req.body || {};

    // --- SAFE categoryId handling ---
    let categoryId = body.categoryId;
    // treat empty strings or "null"/"undefined" as no-category
    if (
      !categoryId ||
      categoryId === "" ||
      categoryId === "null" ||
      categoryId === "undefined"
    ) {
      categoryId = null;
    } else if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      // invalid ObjectId string -> reject or set to null (here we set to null to be forgiving)
      categoryId = null;
    } else {
      // convert to ObjectId
      categoryId = mongoose.Types.ObjectId(categoryId);
    }

    // --- Numeric cast helpers (only if present) ---
    const maybeNumber = (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const n = Number(val);
      return Number.isFinite(n) ? n : undefined;
    };

    const updates = {};

    if (body.name !== undefined) updates.name = String(body.name).trim();
    // categoryId: set either ObjectId or null (explicit)
    updates.categoryId = categoryId; // will set to null or ObjectId
    const sp = maybeNumber(body.sellingPrice);
    if (sp !== undefined) updates.sellingPrice = sp;
    const cp = maybeNumber(body.costPrice);
    if (cp !== undefined) updates.costPrice = cp;
    const wp = maybeNumber(body.wholesalePrice);
    if (wp !== undefined) updates.wholesalePrice = wp;
    const st = maybeNumber(body.stock);
    if (st !== undefined) updates.stock = st;
    if (body.unit !== undefined) updates.unit = body.unit;
    if (body.sku !== undefined) updates.sku = body.sku;

    // --- Handle photos ---
    // existing photos (array of urls) from DB
    let existingPhotos = Array.isArray(product.photos)
      ? product.photos.slice()
      : product.photo
      ? [product.photo]
      : [];

    // clearPhotos flag (frontend sends "clearPhotos": "1")
    if (
      body.clearPhotos === "1" ||
      body.clearPhotos === 1 ||
      body.clearPhotos === true
    ) {
      existingPhotos = [];
    }

    // newly uploaded files (CloudinaryStorage gives file.path)
    const newPhotos =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((f) => f.path)
        : [];

    // Merge: keep existingPhotos and append newPhotos
    const mergedPhotos = [...existingPhotos, ...newPhotos];

    // Only set photos field if there is value (could be empty array intentionally)
    updates.photos = mergedPhotos;

    // Perform update
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
