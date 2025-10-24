const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const favoritesRoutes = require("./routes/favoritesRoutes");
const adminRoutes = require("./routes/adminRoutes");


const app = express();
const PORT = process.env.PORT || 3000;


connectDB();


app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5175", "http://localhost:5174"],
  credentials: true
}));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/users/favorites", favoritesRoutes);
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => res.send("🚀 Servidor a correr com MongoDB!"));

app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

if (require.main == module){
  app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
}

module.exports = app;