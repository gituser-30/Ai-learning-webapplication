const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware");
const {
  generateAssignment,
  submitAssignment,
  getAssignment
} = require("../../controllers/learning/assignmentController");

router.post("/generate/:topicId", protect, generateAssignment);
router.post("/submit/:assignmentId", protect, submitAssignment);
router.get("/:assignmentId", protect, getAssignment);
module.exports = router;
