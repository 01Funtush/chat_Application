import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ✅ Increase payload size limit (fix for PayloadTooLargeError)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Cookie support
app.use(cookieParser());

// ✅ CORS setup to allow frontend access
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ Start server and connect to database
server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB();
});
