const client = require("../config/aiClient");

/**
 * Universal AI function
 * Always returns SAFE JSON STRING
 */
async function askLLM(systemPrompt, userMessage) {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.MODEL,

      messages: [
        {
          role: "system",
          content: systemPrompt + "\nYou MUST respond in valid JSON only."
        },
        {
          role: "user",
          content: sanitize(userMessage),
        },
      ],

      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: "json_object" } // 🔥 forces JSON
    });

    let reply = completion.choices[0].message.content;

    return ensureJSON(reply);

  } catch (error) {
    console.error("LLM ERROR:", error?.response?.data || error.message);

    // fallback question so interview never stops
    return JSON.stringify({
      question: "Explain difference between stack and heap memory.",
      stage: "fundamental",
      difficulty: "easy",
      followUp: false
    });
  }
}

module.exports = askLLM;


/* ---------------- SECURITY ---------------- */

function sanitize(text = "") {
  return text
    .replace(/ignore previous instructions/gi, "")
    .replace(/system prompt/gi, "")
    .replace(/act as/gi, "")
    .replace(/you are now/gi, "")
    .slice(0, 2000); // prevent token abuse
}

function ensureJSON(text) {
  if (!text) return fallback();

  // remove code blocks
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  // find JSON object
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first !== -1 && last !== -1) {
    const possible = text.slice(first, last + 1);

    try {
      JSON.parse(possible);
      return possible;
    } catch {}
  }

  return fallback();
}

function fallback() {
  return JSON.stringify({
    question: "Introduce yourself.",
    stage: "intro",
    difficulty: "easy",
    followUp: false,
    evaluationHint: "fallback"
  });
}

