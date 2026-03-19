const Pdf = require("../models/Pdf");
const fs = require("fs");
const pdfParse = require("pdf-parse/lib/pdf-parse");
 
const splitText = require("../utils/chunkText");
const {createEmbedding} = require("../utils/embed");
const PdfChunk = require("../models/PdfChunk");



const cloudinary = require("../config/cloudinary");




exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // important for pdf
          folder: "ai-pdfs",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Download buffer from cloudinary
    const axios = require("axios");
    const response = await axios.get(uploadResult.secure_url, {
      responseType: "arraybuffer",
    });

    const data = await pdfParse(response.data);
    const extractedText = data.text;

    // Save PDF
    const pdf = await Pdf.create({
      user: req.userId,
      title: req.body.title,
      fileUrl: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      extractedText,
    });

    // RAG indexing
    const chunks = splitText(extractedText);

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);

      await PdfChunk.create({
        pdfId: pdf._id,
        text: chunk,
        embedding,
      });
    }

    res.json({ message: "PDF uploaded & indexed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
};


exports.getMyPdfs = async (req, res) => {
  const pdfs = await Pdf.find({ user: req.userId });
  res.json(pdfs);
};

exports.getPdfById = async (req, res) => {
  const pdf = await Pdf.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!pdf) {
    return res.status(404).json({ message: "PDF not found" });
  }

  res.json(pdf);
};

// exports.extractPdfText = async (req, res) => {
//   try {
//     const pdf = await Pdf.findOne({
//       _id: req.params.id,
//       user: req.userId,
//     });

//     if (!pdf) {
//       return res.status(404).json({ message: "PDF not found" });
//     }

//     // Read PDF file
//     const dataBuffer = fs.readFileSync(pdf.filePath);

//     // Extract text
//     const data = await pdfParse(dataBuffer);

//     // Save extracted text in DB
//     pdf.extractedText = data.text;
//     await pdf.save();

//     res.json({
//       message: "Text extracted successfully",
//       textLength: data.text.length,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.extractPdfText = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const axios = require("axios");
    const response = await axios.get(pdf.fileUrl, {
      responseType: "arraybuffer",
    });

    const data = await pdfParse(response.data);

    pdf.extractedText = data.text;
    await pdf.save();

    res.json({
      message: "Text extracted successfully",
      textLength: data.text.length,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};