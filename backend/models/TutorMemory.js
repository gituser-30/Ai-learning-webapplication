const mongoose = require("mongoose");

const tutorMemorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skillLevel: String,
  topicsCovered: [String],
  weakAreas: [String]
});

module.exports = mongoose.model("TutorMemory", tutorMemorySchema);
