import cors from "cors";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

/* ✅ Proper CORS Setup */
/* ✅ Allow localhost + production frontend */
app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Server-to-server / mobile / curl (no origin)
      if (!origin) return callback(null, true);

      // 2. Local development
      if (origin.startsWith("http://localhost")) return callback(null, true);

      // 3. Allow ANY Vercel deployment (*.vercel.app)
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // 4. Allow Render internal calls
      if (origin.includes("onrender.com")) return callback(null, true);

      // 5. Block everything else
      console.log("❌ BLOCKED CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// // Handle ALL preflight requests
// app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

/* Routes */
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/accounting", accountRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("🚴 Bicycle Business Management API is running...");
});

/* Error handler */
app.use(errorHandler);

export default app;
