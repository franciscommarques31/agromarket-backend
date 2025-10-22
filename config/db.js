const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Ligação ao MongoDB estabelecida com sucesso");
  } catch (error) {
    console.error("❌ Erro ao ligar ao MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
