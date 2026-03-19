const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  language: String, // python, java, cpp etc
});

module.exports = mongoose.model("Domain", domainSchema);
