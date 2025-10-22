const mongoose = require("mongoose");
const Product = require("../models/Product"); // ajusta se o caminho for diferente
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const fixImages = async () => {
  await connectDB();

  // Substitui pelo _id do documento que queres corrigir
  const productId = "68dbd7af8cad4c636e02dd1d";

  // Corrige o array de imagens
  await Product.findByIdAndUpdate(productId, {
    imagens: ["/assets/trator.jpg"]
  });

  console.log("Documento corrigido!");
  mongoose.connection.close();
};

fixImages();
