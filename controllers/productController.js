const Product = require("../models/product");
const User = require("../models/User");


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name surname email");
    res.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};


exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ user: userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos do utilizador:", error);
    res.status(500).json({ error: "Erro ao listar produtos do utilizador" });
  }
};

// Obter produto por ID e incrementar visualizações
exports.getProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "name surname email phone"
    );
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

   
    const visitorId = req.user?.id || `guest:${req.ip}`;
    const isOwner = req.user?.id && req.user.id === product.user._id.toString();

    if (!isOwner && !product.viewedBy.includes(visitorId)) {
      product.views += 1;
      product.viewedBy.push(visitorId);
      await product.save();
    }

    res.json(product);
  } catch (error) {
    console.error("Erro ao obter produto:", error);
    res.status(500).json({ error: "Erro ao obter produto" });
  }
};

// Criar produto
exports.createProduct = async (req, res) => {
  try {
    const {
      setor,
      produto,
      modelo,
      marca,
      distrito,
      anos,
      quilometros,
      horas,
      preco,
      descricao,
      imagens,
      estado,
      empresa,
    } = req.body;

    const newProduct = await Product.create({
      user: req.user.id,
      setor,
      produto,
      modelo,
      marca,
      distrito,
      anos,
      quilometros,
      horas,
      preco,
      descricao,
      imagens,
      estado,
      empresa,
      views: 0,
      viewedBy: [],
    });

    res.status(201).json({ message: "Produto criado com sucesso", product: newProduct });
  } catch (error) {
    console.error("Erro no createProduct:", error);
    res.status(500).json({ error: error.message });
  }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    if (product.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Não autorizado a atualizar este produto" });

    Object.assign(product, req.body);
    await product.save();
    res.json({ message: "Produto atualizado com sucesso", product });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

// Apagar produto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    if (product.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Não autorizado a apagar este produto" });

    await product.deleteOne();
    res.json({ message: "Produto apagado com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar produto:", error);
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
};

// Pesquisa de produtos com filtros
exports.searchProducts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.setor) filters.setor = req.query.setor;
    if (req.query.produto) filters.produto = { $regex: req.query.produto, $options: "i" };
    if (req.query.marca) filters.marca = { $regex: req.query.marca, $options: "i" };
    if (req.query.distrito) filters.distrito = { $regex: req.query.distrito, $options: "i" };
    if (req.query.empresa) filters.empresa = { $regex: req.query.empresa, $options: "i" };
    if (req.query.estado) filters.estado = req.query.estado;
    if (req.query.precoMin || req.query.precoMax) {
      filters.preco = {};
      if (req.query.precoMin) filters.preco.$gte = Number(req.query.precoMin);
      if (req.query.precoMax) filters.preco.$lte = Number(req.query.precoMax);
    }

    const products = await Product.find(filters)
      .populate("user", "name surname email phone")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Erro na pesquisa de produtos:", error);
    res.status(500).json({ error: "Erro ao pesquisar produtos" });
  }
};


exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    const index = user.favorites.indexOf(productId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Erro ao atualizar favorito:", error);
    res.status(500).json({ error: "Erro ao atualizar favorito" });
  }
};
