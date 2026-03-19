const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const { uploadPdf, getMyPdfs,getPdfById } = require("../controllers/pdfController");
const { extractPdfText } = require("../controllers/pdfController");
const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  uploadPdf
);

router.get("/my-pdfs", protect, getMyPdfs);
router.get("/:id", protect, getPdfById);


router.post("/:id/extract", protect, extractPdfText);

module.exports = router;
