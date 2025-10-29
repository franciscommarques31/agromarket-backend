const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Registo e login
router.post("/register", authController.register);
router.post("/login", authController.login);

// Esqueci / Redefinir password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Perfil (autenticado)
router.put("/update-profile", authMiddleware, authController.updateProfile);
router.get("/me", authMiddleware, authController.getMe);

// Apagar conta (autenticado)
router.delete("/delete-account", authMiddleware, authController.deleteAccount);

module.exports = router;
