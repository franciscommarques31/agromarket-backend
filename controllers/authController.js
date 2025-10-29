const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // 🔹 Import necessário
const User = require("../models/User");
const { sendResetPasswordEmail } = require("../utils/email");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// 🟢 Registo
exports.register = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      birthDate,
      city,
      country,
      phone,
      isCompany,
      companyName
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email já registado" });
    }

    if (isCompany && !companyName) {
      return res.status(400).json({ error: "O nome da empresa é obrigatório se for empresa." });
    }

    if (!birthDate) {
      return res.status(400).json({ error: "A data de nascimento é obrigatória" });
    }

    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) age--;

    if (age < 18 || age > 130) {
      return res.status(400).json({ error: "A idade deve ser entre 18 e 130 anos." });
    }

    const newUser = await User.create({
      name,
      surname,
      email,
      password,
      birthDate,
      city,
      country,
      phone,
      isCompany: isCompany || false,
      companyName: companyName || null
    });

    res.status(201).json({
      message: "Utilizador registado com sucesso",
      token: generateToken(newUser),
      user: {
        id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        birthDate: newUser.birthDate,
        city: newUser.city,
        country: newUser.country,
        phone: newUser.phone,
        isCompany: newUser.isCompany,
        companyName: newUser.companyName
      }
    });

  } catch (error) {
    console.error("Erro no register:", error);
    res.status(500).json({ error: "Erro ao registar utilizador" });
  }
};

// 🟢 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Credenciais inválidas" });

    res.json({
      message: "Login bem-sucedido",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        birthDate: user.birthDate,
        city: user.city,
        country: user.country,
        phone: user.phone,
        isCompany: user.isCompany,
        companyName: user.companyName,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

// 🟢 Atualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, surname, password, city, country, phone, isCompany, companyName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    if (typeof isCompany !== "undefined") {
      user.isCompany = isCompany;
      if (isCompany && !companyName) return res.status(400).json({ error: "O nome da empresa é obrigatório se for empresa." });
      user.companyName = companyName || null;
    }

    if (password) user.password = password;

    await user.save();

    res.json({
      message: "Perfil atualizado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        birthDate: user.birthDate,
        city: user.city,
        country: user.country,
        phone: user.phone,
        isCompany: user.isCompany,
        companyName: user.companyName,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
};

// 🟢 Obter dados do utilizador logado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({ error: "Erro ao obter perfil" });
  }
};

// 🟢 Apagar conta
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    await User.findByIdAndDelete(userId);
    res.json({ message: "Conta apagada com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar conta:", error);
    res.status(500).json({ error: "Erro ao apagar conta" });
  }
};

// 🔹 Esqueci a password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email não encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expire = Date.now() + 3600000; // 1 hora

    user.resetPasswordToken = token;
    user.resetPasswordExpire = expire;
    await user.save();

    // 🔹 Depuração: comentar se quiser testar sem email
    console.log("Token gerado:", token);
    await sendResetPasswordEmail(user, token);

    res.json({ message: "Email de redefinição enviado" });
  } catch (error) {
    console.error("Erro no forgotPassword:", error);
    res.status(500).json({ error: error.message || "Erro ao enviar email de redefinição" });
  }
};

// 🔹 Redefinir password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: "Token inválido ou expirado" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password redefinida com sucesso" });
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    res.status(500).json({ error: "Erro ao redefinir password" });
  }
};
