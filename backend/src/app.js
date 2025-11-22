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
const allowedOrigins = [
  "http://localhost:3000",
  "https://bicycle-datiuj2cl-rabindranath-mondals-projects.vercel.app",
  "https://bicycle-pos.vercel.app", // optional if you rename
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile / server requests

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ BLOCKED CORS:", origin);
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

/* Routes */
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
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
