const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { upgrade } = require("../controllers/subscription/subscriptionController");

// simulate payment upgrade
router.post("/upgrade", protect, upgrade);

module.exports = router;