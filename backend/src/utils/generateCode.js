// utils/generateCode.js
import crypto from "crypto";

/**
 * Generate a 12-digit numeric barcode (EAN-like).
 * Ensures the barcode is always numeric and unique enough.
 */
export function generateBarcode() {
  // 6 digits from timestamp + 6 digits random
  const part1 = Date.now().toString().slice(-6);
  const part2 = Math.floor(100000 + Math.random() * 900000);
  return `${part1}${part2}`;
}

/**
 * Generate SKU using product name prefix + random 4 digits
 * Example: "Cycle Pump" → "CYC-4821"
 */
export function generateSKU(name = "") {
  const prefix = name.trim().substring(0, 3).toUpperCase() || "PRD";
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

/**
 * Generate internal product number with date
 * Example: PRD20250221-174
 */
export function generateProductNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(100 + Math.random() * 900); // 3 digits

  return `PRD${y}${m}${d}-${random}`;
}
