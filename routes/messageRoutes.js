const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, messageController.getUserConversations);
router.post("/", authMiddleware, messageController.addMessage);
router.get("/:productId/user", authMiddleware, messageController.getUserMessages);
router.get("/:productId", authMiddleware, messageController.getAllMessages);
router.delete("/:productId/:otherUserId", authMiddleware, messageController.deleteConversation);


module.exports = router;
