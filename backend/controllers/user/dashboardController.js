const Course = require("../../models/learning/Course");
const Topic = require("../../models/learning/Topic");
const Submission = require("../../models/learning/Submission");
const LearningProfile = require("../../models/learning/LearningProfile");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // courses
    const courses = await Course.find({ user: userId });

    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const totalTopics = await Topic.countDocuments({ course: course._id });
        const completedTopics = await Topic.countDocuments({
          course: course._id,
          status: "completed"
        });

        return {
          id: course._id,
          title: course.domain,
          progress: totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100),
          completedTopics,
          totalTopics
        };
      })
    );

    // assignments solved
    const solvedAssignments = await Submission.countDocuments({
      user: userId,
      passed: true
    });

    // learning profile
    const profile = await LearningProfile.findOne({ user: userId });

    res.json({
      courses: courseStats,
      solvedAssignments,
      streak: profile?.streak || 0,
      totalTopicsCompleted: profile?.totalTopicsCompleted || 0
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err.message);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};