const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("_id email");
    if (!req.user) return res.status(401).json({ error: "Utilizador não encontrado" });
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};
