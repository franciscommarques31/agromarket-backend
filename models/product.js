const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    setor: {
      type: String,
      required: true,
      enum: ["Agrícola", "Construção", "Florestal", "Jardinagem", "Transporte"],
    },
    produto: { type: String, required: true },
    modelo: { type: String },
    marca: { type: String, required: true },
    distrito: { type: String, required: true },
    anos: { type: Number, default: 0 },
    quilometros: { type: Number, default: 0 },
    horas: { type: Number, required: true },
    preco: { type: Number, required: true },
    descricao: { type: String },
    imagens: [{ type: String }],
    estado: { 
      type: String,
      enum: ["novo", "usado"],
      required: true,
    },
    views: { type: Number, default: 0 }, // contador de visualizações
    viewedBy: [{ type: String }], // lista de IDs ou IPs para controlar views únicas
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
