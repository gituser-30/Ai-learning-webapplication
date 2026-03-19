const express = require("express");
const router = express.Router();
const {
  getAllProblems,
  getProblemById,
  getProblemsByDomain,
} = require("../controllers/problemController");

router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.get("/domain/:domainId", getProblemsByDomain);
module.exports = router;
