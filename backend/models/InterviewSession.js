const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  domain: String,
  stage: { type: String, default: "intro" },
  questions: [String],
  answers: [String],
  difficulty: { type: String, default: "easy" },
  warnings: { type: Number, default: 0 },
  score: Object,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
