const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  domain: {
    type: String,
    required: true
  },

  title: String,

  description: String,

  progress: {
    type: Number,
    default: 0
  },

  currentTopicIndex: {
    type: Number,
    default: 0
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
