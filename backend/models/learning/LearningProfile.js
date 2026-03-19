const mongoose = require("mongoose");

const learningProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },

  streak: {
    type: Number,
    default: 0
  },

  lastStudyDate: Date,

  totalTopicsCompleted: {
    type: Number,
    default: 0
  },

  domains: [
    {
      domain: String,
      progress: { type: Number, default: 0 } // %
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("LearningProfile", learningProfileSchema);
