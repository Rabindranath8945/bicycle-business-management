export const generateBarcode = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000000);
};

export const generateSKU = (categoryName = "") => {
  const prefix = categoryName.substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

export const generateProductNumber = async (Product) => {
  const latest = await Product.findOne().sort({ createdAt: -1 });
  const next = latest ? Number(latest.productNumber?.slice(-4)) + 1 : 1;
  return `PRD${String(next).padStart(4, "0")}`;
};
