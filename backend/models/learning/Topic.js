const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  order: Number,

  explanation: String, // AI teaching content (cached)

  status: {
    type: String,
    enum: ["locked", "unlocked", "completed"],
    default: "locked"
  }

}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);
