const Message = require("../models/Message");
const Product = require("../models/product");

// ✅ Todas as conversas do utilizador (sem duplicar)
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "name surname email")
      .populate("recipient", "name surname email")
      .populate({
        path: "product",
        select: "produto marca modelo imagens user",
        populate: { path: "user", select: "name surname _id" },
      })
      .sort({ createdAt: -1 });

    const uniqueConversations = [];
    const seen = new Set();

    messages.forEach((msg) => {
      if (!msg.product || !msg.product._id) return;

      const id1 = `${msg.product._id}-${msg.sender._id}-${msg.recipient._id}`;
      const id2 = `${msg.product._id}-${msg.recipient._id}-${msg.sender._id}`;

      if (!seen.has(id1) && !seen.has(id2)) {
        seen.add(id1);
        seen.add(id2);
        uniqueConversations.push(msg);
      }
    });

    res.json(uniqueConversations);
  } catch (error) {
    console.error("Erro ao obter conversas do utilizador:", error);
    res.status(500).json({ error: "Erro ao obter conversas" });
  }
};

// ✅ Enviar mensagem
exports.addMessage = async (req, res) => {
  try {
    const { recipientId, productId, content } = req.body;

    if (!recipientId || !productId || !content) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      product: productId,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name surname email")
      .populate("recipient", "name surname email")
      .populate({
        path: "product",
        select: "produto marca modelo imagens user",
        populate: { path: "user", select: "name surname _id" },
      });

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
};

// ✅ Mensagens do utilizador para um produto específico
exports.getUserMessages = async (req, res) => {
  try {
    const { productId } = req.params;

    const messages = await Message.find({
      product: productId,
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .populate("sender", "name surname email")
      .populate("recipient", "name surname email")
      .populate({
        path: "product",
        select: "produto marca modelo imagens user",
        populate: { path: "user", select: "name surname _id" },
      })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Erro ao obter mensagens:", error);
    res.status(500).json({ error: "Erro ao obter mensagens" });
  }
};

// ✅ Todas as mensagens de um produto (para o proprietário)
exports.getAllMessages = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("user", "_id name surname");
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    if (product.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const messages = await Message.find({ product: productId })
      .populate("sender", "name surname email")
      .populate("recipient", "name surname email")
      .populate({
        path: "product",
        select: "produto marca modelo imagens user",
        populate: { path: "user", select: "name surname _id" },
      })
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error("Erro ao obter todas mensagens:", error);
    res.status(500).json({ error: "Erro ao obter mensagens" });
  }
};


// ✅ Remover uma conversa entre dois utilizadores referente a um produto
exports.deleteConversation = async (req, res) => {
  try {
    const { productId, otherUserId } = req.params;
    const userId = req.user.id;

    const result = await Message.deleteMany({
      product: productId,
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Conversa eliminada com sucesso",
    });

  } catch (error) {
    console.error("Erro ao eliminar conversa:", error);
    res.status(500).json({ error: "Erro ao eliminar conversa" });
  }
};