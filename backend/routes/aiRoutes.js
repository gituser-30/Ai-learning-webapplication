const express = require("express");
const protect = require("../middleware/authMiddleware");
const { chatWithPdf } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", protect, chatWithPdf);

module.exports = router;
