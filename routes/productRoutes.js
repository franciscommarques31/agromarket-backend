const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/optionalAuth");

// Criar produto (autenticado)
router.post("/", authMiddleware, productController.createProduct);

// Pesquisa de produtos (público)
router.get("/search", productController.searchProducts);

// Listar todos os produtos (público)
router.get("/", productController.getAllProducts);

// Listar produtos do user logado (autenticado)
router.get("/me", authMiddleware, productController.getMyProducts);

// Obter produto por ID (público, com middleware opcional)
router.get("/:id", optionalAuth, productController.getProductByID);

// Atualizar produto (autenticado)
router.patch("/:id", authMiddleware, productController.updateProduct);

// Apagar produto (autenticado)
router.delete("/:id", authMiddleware, productController.deleteProduct);

// Toggle favorito (autenticado)
router.post("/:id/favorite", authMiddleware, productController.toggleFavorite);

module.exports = router;
