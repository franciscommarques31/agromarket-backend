const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
      } catch (err) {
  
      }
    }
  }


  if (!req.user) {
    if (!req.cookies?.tempVisitorId) {
      const tempId = `guest:${Math.random().toString(36).substring(2, 12)}`;
      res.cookie("tempVisitorId", tempId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        httpOnly: true,
      });
      req.tempVisitorId = tempId;
    } else {
      req.tempVisitorId = req.cookies.tempVisitorId;
    }
  }

  next();
};
