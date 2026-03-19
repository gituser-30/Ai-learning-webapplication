const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },

  answer: String,

  aiScore: Number,

  aiFeedback: String,

  passed: Boolean

}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
