const mongoose = require("mongoose");
const PdfChunkSchema = new mongoose.Schema(
    {
        pdfId: {type:mongoose.Schema.Types.ObjectId, ref: "pdf"},
        text:String,
        embedding :[Number]
    }
);
module.exports = mongoose.model("PdfChunk",PdfChunkSchema);