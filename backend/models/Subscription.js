const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },

  validUntil: Date,

  coursesUnlocked: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
