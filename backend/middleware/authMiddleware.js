

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach userId to request  ⭐ IMPORTANT
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;
