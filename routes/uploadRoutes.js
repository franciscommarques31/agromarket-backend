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

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};

// Rota de upload de **uma ou várias imagens**
router.post("/", upload.array("imagens", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Nenhum ficheiro enviado" });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const result = await streamUpload(file.buffer, file.originalname);
      uploadedFiles.push(result.secure_url);
    }

    res.json({ urls: uploadedFiles });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    res.status(500).json({ error: "Erro ao fazer upload" });
  }
});

module.exports = router;
