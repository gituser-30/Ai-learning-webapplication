const express = require("express");
const router = express.Router();
const InterviewSession = require("../models/InterviewSession");
const { interviewerSystemPrompt } = require("../prompts/interviewerPrompt");
const askLLM = require("../utils/askLLM"); // your existing LLM function

// START INTERVIEW
router.post("/start", async (req, res) => {
  const { domain } = req.body;
  const userId = req.user.id;

  const session = await InterviewSession.create({
    user: userId,
    domain
  });

  const systemPrompt = interviewerSystemPrompt(domain);

  const aiResponse = await askLLM(systemPrompt, "Start the interview");

  const parsed = JSON.parse(aiResponse);

  session.questions.push(parsed.question);
  session.stage = parsed.stage;
  await session.save();

  res.json({ sessionId: session._id, question: parsed.question });
});
router.post("/answer", async (req, res) => {
  const { sessionId, answer } = req.body;

  const session = await InterviewSession.findById(sessionId);

  // save answer
  session.answers.push(answer);

  /* ---------------- STOP AFTER 5 QUESTIONS ---------------- */
  if (session.questions.length >= 5) {
    session.stage = "end";
    session.completed = true;
    await session.save();

    return res.json({
      question: "Thank you. The interview is finished.",
      stage: "end"
    });
  }

  /* ---------------- NORMAL FLOW ---------------- */

  const conversation = `
Previous Question: ${session.questions.at(-1)}
Candidate Answer: ${answer}
Current Stage: ${session.stage}
Domain: ${session.domain}
`;

  const aiResponse = await askLLM(
    interviewerSystemPrompt(session.domain),
    conversation
  );

  const parsed = JSON.parse(aiResponse);

  session.questions.push(parsed.question);
  session.stage = parsed.stage;

  await session.save();

  res.json(parsed);
});


// GET FINAL RESULT
router.get("/result/:sessionId", async (req, res) => {
  const session = await InterviewSession.findById(req.params.sessionId);

  if (!session) return res.status(404).json({ message: "Session not found" });

  const conversation = session.questions
    .map((q, i) => `Q: ${q}\nA: ${session.answers[i] || ""}`)
    .join("\n");

  const prompt = `
You are a senior hiring manager.

Evaluate the candidate interview below.

Give JSON response:

{
  "technicalScore": number (0-10),
  "communicationScore": number (0-10),
  "confidenceScore": number (0-10),
  "strengths": ["point", "point"],
  "weaknesses": ["point", "point"],
  "finalVerdict": "Reject | Maybe | Hire"
}

Interview:
${conversation}
`;

  const result = await askLLM(prompt, "Evaluate candidate");
  res.json(JSON.parse(result));
});

module.exports = router;
