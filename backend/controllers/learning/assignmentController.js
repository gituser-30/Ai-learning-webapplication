const axios = require("axios");
const Assignment = require("../../models/learning/Assignment");
const Topic = require("../../models/learning/Topic");


// ===============================
// GENERATE ASSIGNMENT
// ===============================
exports.generateAssignment = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.userId;

    const topic = await Topic.findById(topicId).populate("course");
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    if (topic.course.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    // if already exists → reuse
    let assignment = await Assignment.findOne({ topic: topicId });
    if (assignment) return res.json(assignment);

    // 🤖 AI create task
    const ai = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `

You are a senior developer mentor.

Create homework based strictly on the lesson below.

The task must use ideas present in the lesson.
Do not introduce new technologies.
Difficulty must match the lesson level.

Return ONLY valid JSON in this exact format:

{
  "question": "string",
  "expectedConcepts": ["concept1","concept2"],
  "difficulty": "easy|medium|hard"
}

No markdown.
No explanation.
No extra text.

LESSON:
${topic.explanation}




`
          },
          {
            role: "user",
            content: `Topic: ${topic.title}`
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

    const data = JSON.parse(ai.data.choices[0].message.content);

    assignment = await Assignment.create({
      topic: topicId,
      question: data.question,
      expectedConcepts: data.expectedConcepts,
      difficulty: data.difficulty
    });

    res.json(assignment);

  } catch (err) {
    console.error("ASSIGNMENT GEN ERROR:", err.message);
    res.status(500).json({ message: "Failed to generate assignment" });
  }
};


const Submission = require("../../models/learning/Submission");
const Course = require("../../models/learning/Course");
const LearningProfile = require("../../models/learning/LearningProfile");


// ===============================
// SUBMIT ANSWER
// ===============================
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answer } = req.body;
    const userId = req.userId;

    const assignment = await Assignment.findById(assignmentId).populate({
      path: "topic",
      populate: { path: "course" }
    });

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // 🤖 AI evaluate
    const ai = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are reviewing a student's homework.

Grade based ONLY on whether the student used the required concepts.

Required concepts:
${assignment.expectedConcepts.join(", ")}

Rules:
- If concepts missing → fail
- If answer unrelated → score below 40
- Do NOT reward long explanations
- Do NOT assume knowledge not in lesson

Return ONLY JSON:
{
 "score": number,
 "feedback": "short explanation",
 "pass": boolean
}
`
          },
          {
            role: "user",
            content: `
Question: ${assignment.question}

Expected Concepts: ${assignment.expectedConcepts.join(", ")}

Student Answer:
${answer}
`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = JSON.parse(ai.data.choices[0].message.content);

    // save submission
    await Submission.create({
      user: userId,
      assignment: assignmentId,
      answer,
      aiScore: result.score,
      aiFeedback: result.feedback,
      passed: result.pass
    });

    // if passed → unlock next topic
    if (result.pass) {
      await unlockNextTopic(assignment.topic, userId);
    }

    res.json(result);

  } catch (err) {
    console.error("SUBMISSION ERROR:", err.message);
    res.status(500).json({ message: "Evaluation failed" });
  }
};

async function unlockNextTopic(topic, userId) {

  topic.status = "completed";
  await topic.save();

  const next = await Topic.findOne({
    course: topic.course,
    order: topic.order + 1
  });

  if (next) {
    next.status = "unlocked";
    await next.save();
  }

  // update course progress
  const course = await Course.findById(topic.course);
  course.currentTopicIndex += 1;
  await course.save();

  // 🔥 update streak
  let profile = await LearningProfile.findOne({ user: userId });
  const today = new Date().toDateString();

  if (!profile.lastStudyDate)
    profile.streak = 1;
  else if (new Date(profile.lastStudyDate).toDateString() === today)
    profile.streak = profile.streak;
  else
    profile.streak += 1;

  profile.lastStudyDate = new Date();
  profile.totalTopicsCompleted += 1;
  await profile.save();
}

exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assignment" });
  }
};


// Choose the most suitable format automatically:
// - explanation (for theoretical concepts)
// - implementation task (for coding concepts)
// - debugging task (for error-prone concepts)
// - scenario design (for architectural concepts)

// Rules:
// - No generic web development questions
// - The student should not be able to answer without learning this concept
// - Make it practical whenever possible
// - Do not include the solution

// Return strictly JSON only.