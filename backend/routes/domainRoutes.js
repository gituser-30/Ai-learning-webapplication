const express = require("express");
const router = express.Router();
const { getDomains } = require("../controllers/domainController.js");

router.get("/", getDomains);

module.exports = router;
