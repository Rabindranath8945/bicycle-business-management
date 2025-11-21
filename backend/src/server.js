import dotenv from "dotenv";
dotenv.config(); // <-- FIXED

import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 10000; // <-- FIXED

console.log("Loaded MONGO_URI:", !!process.env.MONGO_URI);
console.log("Starting server. NODE_ENV:", process.env.NODE_ENV);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);
  });
