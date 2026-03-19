const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true
  },

  question: String,

  expectedConcepts: [String],

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  }

}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
