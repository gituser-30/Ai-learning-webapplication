const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
  type: String,
  required: true,
},
public_id: String,
    extractedText: {
      type: String, // 👈 store extracted text
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pdf", pdfSchema);
