const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
  },

  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },

  testCases: [
    {
      input: String,
      output: String,
    },
  ],
});

module.exports = mongoose.model("Problem", problemSchema);
