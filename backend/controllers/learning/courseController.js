const axios = require("axios");
const Course = require("../../models/learning/Course");
const Topic = require("../../models/learning/Topic");
const LearningProfile = require("../../models/learning/LearningProfile");

// ==============================
// CREATE COURSE (AI ROADMAP)
// ==============================
exports.createCourse = async (req, res) => {
  try {
    const { domain } = req.body;
    const userId = req.userId;

    if (!domain) return res.status(400).json({ message: "Domain required" });

    // 1️⃣ Prevent duplicate enrollment
    const existing = await Course.findOne({ user: userId, domain });
    if (existing) {
      return res.json({
        message: "Course already exists",
        courseId: existing._id,
      });
    }

    // 2️⃣ Ask AI for roadmap
    // 2️⃣ Ask AI for roadmap
    const ai = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a senior software engineer mentor designing a professional course.

Create a COMPLETE structured curriculum for learning ${domain}.

Return ONLY JSON:
[
  {
    "module": "Module name",
    "concepts": ["Concept 1", "Concept 2"]
  }
]

No explanations. No markdown.

`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // SAFE PARSE
    let modules;
    try {
      let text = ai.data.choices[0].message.content;
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      modules = JSON.parse(text);
    } catch (err) {
      console.error("AI RAW RESPONSE:\n", ai.data.choices[0].message.content);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    // 3️⃣ Create course
    const course = await Course.create({
      user: userId,
      domain,
      title: `${domain} Mastery Path`,
    });

    // 4️⃣ Create topics
    let order = 1;

    for (const module of modules) {
      for (const concept of module.concepts) {
        await Topic.create({
          course: course._id,
          title: concept,
          order: order,
          status: order === 1 ? "unlocked" : "locked",
        });
        order++;
      }
    }

   

    // 5️⃣ Ensure learning profile exists
    let profile = await LearningProfile.findOne({ user: userId });
    if (!profile) {
      profile = await LearningProfile.create({ user: userId });
    }

    // add domain progress tracking
    profile.domains.push({ domain, progress: 0 });
    await profile.save();

    res.json({
      success: true,
      courseId: course._id,
      message: "Course created successfully",
    });
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to create course" });
  }
};

exports.getCourseRoadmap = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    const topics = await Topic.find({ course: courseId }).sort({ order: 1 });

    res.json({
      course,
      topics,
    });
  } catch (err) {
    console.error("ROADMAP ERROR:", err.message);
    res.status(500).json({ message: "Failed to load roadmap" });
  }
};
