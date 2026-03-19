const axios = require("axios");
const Topic = require("../../models/learning/Topic");
const Course = require("../../models/learning/Course");


// =======================================
// LEARN TOPIC (AI TEACHING MODE)
// =======================================
exports.learnTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.userId;

    const topic = await Topic.findById(topicId).populate("course");
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    // 🔐 Security — user must own course
    if (topic.course.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    // 🔒 Topic locked
    if (topic.status === "locked")
      return res.status(400).json({ message: "Topic locked. Complete previous topic first." });

    // ⚡ Already generated → return cached
    if (topic.explanation) {
      return res.json({
        cached: true,
        title: topic.title,
        explanation: topic.explanation
      });
    }

    // ==========================
    // 🤖 AI TEACHING PROMPT
    // ==========================
    const ai = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a Senior Software Engineer teaching a junior developer.

Teach ONE small concept deeply.

STRICT RULES:
- Assume student does not know previous concept
- Give intuition first
- Then explanation
- Then at least ONE solved example
- Then one practice question (do not solve it)

FORMAT:

### 🧠 Intuition
### 📘 Explanation
### 💻 Worked Example (step-by-step solved)
### 🧪 Try Yourself
### ⚠️ Common Mistakes
### 📌 Key Takeaways

Concept: ${topic.title}
`
          },
          {
            role: "user",
            content: `Teach this topic: ${topic.title}`
          }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const explanation = ai.data.choices[0].message.content;

    // 💾 Save explanation (CACHE)
    topic.explanation = explanation;
    await topic.save();

    res.json({
      cached: false,
      title: topic.title,
      explanation
    });

  } catch (err) {
    console.error("LEARN TOPIC ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to generate lesson" });
  }
};


// 