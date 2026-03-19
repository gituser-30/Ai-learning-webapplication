const express = require("express");
const router = express.Router();

const {runCode,submitCode} = require("../controllers/codeController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/run",runCode);
router.post("/submit/:problemId",submitCode);
module.exports = router;