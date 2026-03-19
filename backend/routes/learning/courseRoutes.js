const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware");

const { createCourse, getCourseRoadmap } = require("../../controllers/learning/courseController");

router.get("/:courseId", protect, getCourseRoadmap);

router.post("/create", protect, createCourse);

module.exports = router;
