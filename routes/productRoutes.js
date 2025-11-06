const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/optionalAuth");


router.post("/", authMiddleware, productController.createProduct);


router.get("/search", productController.searchProducts);


router.get("/", productController.getAllProducts);


router.get("/me", authMiddleware, productController.getMyProducts);


router.get("/:id", optionalAuth, productController.getProductByID);


router.patch("/:id", authMiddleware, productController.updateProduct);


router.delete("/:id", authMiddleware, productController.deleteProduct);


router.post("/:id/favorite", authMiddleware, productController.toggleFavorite);

module.exports = router;
