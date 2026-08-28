import productRoutes from "./api/routes/productRoutes.js";
import companyRoutes from "./api/routes/companyRoutes.js";
import authRoutes from "./api/routes/authRoutes.js";
import userRoutes from "./api/routes/userRoutes.js";
import devRoutes from "./api/routes/devRoutes.js";
import { protect } from "./api/middlewares/authMiddleware.js";
import { attachPrismaWithTenant } from "./api/middlewares/attachTenant.js";
import seedDeveloper from "./api/utils/seed.js";
import prisma from "./api/config/prisma.js";
import cookieParser from "cookie-parser";
import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";

config();
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173", // ganti dengan URL frontend-mu
  credentials: true, // penting supaya cookie bisa dikirim
};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/dev", devRoutes);
app.use("/usr", userRoutes);
app.use("/co", companyRoutes);

app.use(protect);
app.use(attachPrismaWithTenant);
app.use("/order", productRoutes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma");
    await seedDeveloper();
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
}

startServer();
