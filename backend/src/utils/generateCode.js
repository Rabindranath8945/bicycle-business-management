// utils/generateCode.js

// ✅ Generate a unique 12-digit barcode
export const generateBarcode = () => {
  // 12-digit numeric code
  const prefix = Date.now().toString().slice(-6); // last 6 digits of timestamp
  const random = Math.floor(100000 + Math.random() * 900000); // 6 random digits
  return `${prefix}${random}`; // total 12 digits
};

// ✅ Generate SKU: CategoryPrefix + Random 4 digits (e.g. "CYC-4821")
export const generateSKU = (categoryName = "GEN") => {
  const prefix = categoryName.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};

// ✅ Generate Product Number: PRD + Date + Counter
// Example: PRD20251112-001
export const generateProductNumber = async (Product) => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const datePrefix = `PRD${yyyy}${mm}${dd}`;

  // Find last product created today
  const lastProduct = await Product.findOne(
    { productNumber: { $regex: `^${datePrefix}` } },
    { productNumber: 1 }
  )
    .sort({ productNumber: -1 })
    .lean();

  let nextNumber = 1;

  if (lastProduct) {
    // Extract last suffix
    const lastSuffix = parseInt(lastProduct.productNumber.split("-")[1], 10);
    nextNumber = lastSuffix + 1;
  }

  return `${datePrefix}-${String(nextNumber).padStart(3, "0")}`;
};
