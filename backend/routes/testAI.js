const express = require("express");
const router = express.Router();
const askLLM = require("../utils/askLLM");

router.get("/", async (req, res) => {

  const system = `
  You are a strict interviewer.
  Ask first introduction question.
  Respond JSON:
  { "question":"...", "stage":"intro", "difficulty":"easy", "followUp":false }
  `;

  const reply = await askLLM(system, "Start interview");

  res.send(reply);
});

module.exports = router;
