require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const serverless = require("serverless-http");

const favoritesRoutes = require("./routes/favoritesRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Conexão MongoDB
connectDB();

// CORS: middleware manual para serverless
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://agromarket-frontend-eight.vercel.app",
    "http://localhost:5173"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Permitir OPTIONS para preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// Rotas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/users/favorites", favoritesRoutes);
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("🚀 Servidor a correr com MongoDB!"));

// Export para Vercel Serverless
module.exports = serverless(app);
