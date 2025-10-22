// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { Readable } = require("stream");

// Configuração do multer (memória)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Função para enviar buffer para Cloudinary
const streamUpload = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products", public_id: filename },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    // Converte o buffer em stream e envia
    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};

// Rota de upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum ficheiro enviado" });
    }

    console.log("Recebendo upload...");
    console.log("Ficheiro recebido:", req.file);

    const result = await streamUpload(req.file.buffer, req.file.originalname);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    res.status(500).json({ error: "Erro ao fazer upload" });
  }
});

module.exports = router;
