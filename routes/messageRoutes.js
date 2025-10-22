const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Todas as conversas do utilizador (lista geral)
router.get("/", authMiddleware, messageController.getUserConversations);

// ✅ Enviar mensagem
router.post("/", authMiddleware, messageController.addMessage);

// ✅ Mensagens do utilizador para um produto específico
router.get("/:productId/user", authMiddleware, messageController.getUserMessages);

// ✅ Todas as mensagens de um produto (para o proprietário)
router.get("/:productId", authMiddleware, messageController.getAllMessages);

module.exports = router;
