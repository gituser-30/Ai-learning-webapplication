const axios = require("axios");
const TutorMemory = require("../models/TutorMemory");
const TutorChat = require("../models/TutorChat");



exports.aiTutorChat = async (req, res) => {
  try {
    const { message, history, chatId } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // 🔹 Load learner memory
    const memory = await TutorMemory.findOne({ user: userId });

    // 🔹 Ask LLM
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are an AI Tutor.

RULES FOR RESPONSE FORMAT:
- Use headings (###)
- Use bullet points
- Use short paragraphs
- Separate sections clearly
- Use emojis for clarity (📘 📅 🧠 ✍️)

Student Profile:
- Skill Level: ${memory?.skillLevel || "Unknown"}
- Topics Covered: ${memory?.topicsCovered?.join(", ") || "None"}
- Weak Areas: ${memory?.weakAreas?.join(", ") || "None"}

If skill level unknown → ask level first
Then teach step by step and give quiz
`,
          },
          ...(history || []),
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // =========================
    // 💾 SAVE CHAT TO DATABASE
    // =========================

    let chat;

    // existing chat
    if (chatId) {
      chat = await TutorChat.findById(chatId);

      chat.messages.push({ role: "user", content: message });
      chat.messages.push({ role: "assistant", content: reply });

      await chat.save();
    }

    // new chat
    else {
      chat = await TutorChat.create({
        user: userId,
        title: message.substring(0, 40),
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: reply },
        ],
      });
    }

    res.json({
      reply,
      chatId: chat._id,
    });

  } catch (err) {
    console.error("AI TUTOR ERROR:", err.response?.data || err.message);
    res.status(500).json("Tutor failed");
  }
};
exports.getMyChats = async (req, res) => {
  const chats = await TutorChat.find({ user: req.userId })
    .select("title updatedAt")
    .sort({ updatedAt: -1 });

  res.json(chats);
};
exports.getChatMessages = async (req, res) => {
  const chat = await TutorChat.findById(req.params.chatId);
  res.json(chat.messages);
};