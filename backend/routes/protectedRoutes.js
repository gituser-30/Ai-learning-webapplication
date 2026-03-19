const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

module.exports = router;
