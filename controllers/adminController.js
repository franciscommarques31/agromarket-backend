// controllers/adminController.js
const User = require("../models/User");
const Product = require("../models/product");

// ✅ Listar todos os utilizadores
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // não enviar passwords
    res.json(users);
  } catch (error) {
    console.error("Erro ao listar utilizadores:", error);
    res.status(500).json({ error: "Erro ao listar utilizadores" });
  }
};

// ✅ Atualizar utilizador
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    Object.assign(user, req.body);
    if (req.body.password) {
      const bcrypt = require("bcrypt");
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.json({ message: "Utilizador atualizado com sucesso", user });
  } catch (error) {
    console.error("Erro ao atualizar utilizador:", error);
    res.status(500).json({ error: "Erro ao atualizar utilizador" });
  }
};

// ✅ Apagar utilizador
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilizador apagado com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar utilizador:", error);
    res.status(500).json({ error: "Erro ao apagar utilizador" });
  }
};

// ✅ Listar todos os produtos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name surname email");
    res.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

// ✅ Atualizar produto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    Object.assign(product, req.body);
    await product.save();
    res.json({ message: "Produto atualizado com sucesso", product });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

// ✅ Apagar produto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    await product.deleteOne();
    res.json({ message: "Produto apagado com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar produto:", error);
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
};
