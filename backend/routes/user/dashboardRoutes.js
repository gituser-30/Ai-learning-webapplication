const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware");
const { getDashboard } = require("../../controllers/user/dashboardController");

router.get("/", protect, getDashboard);

module.exports = router;