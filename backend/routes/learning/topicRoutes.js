const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware");
const { learnTopic } = require("../../controllers/learning/topicController");
const courseAccess = require("../../middleware/courseAccess");
router.get("/learn/:topicId", protect, learnTopic);
router.get("/learn/:topicId", protect, courseAccess, learnTopic);

module.exports = router;
