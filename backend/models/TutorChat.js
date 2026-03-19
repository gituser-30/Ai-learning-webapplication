const mongoose = require("mongoose");

const tutorChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String, // first message = chat name
  messages: [
    {
      role: String,
      content: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("TutorChat", tutorChatSchema);
