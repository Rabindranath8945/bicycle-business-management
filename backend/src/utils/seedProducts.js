// backend/src/utils/seedProducts.js
import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

const seed = async () => {
  await connectDB();
  const sample = [
    {
      name: 'City Bike 26"',
      sku: "CB-26-001",
      saleRate: 7500,
      purchaseRate: 5200,
      gstPercent: 12,
      stock: 12,
    },
    {
      name: 'Mountain Bike 29"',
      sku: "MB-29-001",
      saleRate: 18500,
      purchaseRate: 14000,
      gstPercent: 12,
      stock: 5,
    },
    {
      name: "Tube 26 inch",
      sku: "TUBE-26",
      saleRate: 150,
      purchaseRate: 90,
      gstPercent: 18,
      stock: 200,
    },
  ];

  await Product.deleteMany({});
  const created = await Product.insertMany(sample);
  console.log("Seeded products:", created.length);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
