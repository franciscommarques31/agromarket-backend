require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const serverless = require("serverless-http"); // ⬅️ Necessário para Vercel

const favoritesRoutes = require("./routes/favoritesRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Conexão MongoDB
connectDB();

// CORS
app.use(cors({
  origin: [
    "https://agromarket-frontend-eight.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

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
