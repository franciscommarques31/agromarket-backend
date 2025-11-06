
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");


router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar favoritos" });
  }
});


router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    const index = user.favorites.indexOf(req.params.productId);
    if (index > -1) user.favorites.splice(index, 1);
    else user.favorites.push(req.params.productId);

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar favoritos" });
  }
});

module.exports = router;
