// middleware/adminMiddleware.js
module.exports = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado: apenas administradores" });
  }
  next();
};