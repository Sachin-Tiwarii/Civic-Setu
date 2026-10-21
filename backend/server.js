
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Allow the frontend to send authentication cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming request bodies and cookies
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to CivicSetu API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CivicSetu backend is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// Start server only after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`CivicSetu API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start CivicSetu:", error.message);
    process.exit(1);
  }
};

startServer();
