
const axios = require("axios");
const PdfChunk = require("../models/PdfChunk");
const {createEmbedding} = require("../utils/embed");
const cosineSimilarity = require("../utils/similarity");


exports.chatWithPdf = async (req, res) => {
  try {
    console.log("STEP 0 → request hit");

    const { question, pdfId } = req.body;
    console.log("STEP 1 → question:", question);
    console.log("STEP 1 → pdfId:", pdfId);

    // 1️⃣ Embed user question
    console.log("STEP 2 → creating embedding...");
    const questionEmbedding = await createEmbedding(question);
    console.log("STEP 2 DONE → embedding length:", questionEmbedding.length);

    // 2️⃣ Get all chunks
    console.log("STEP 3 → fetching chunks...");
    const chunks = await PdfChunk.find({ pdfId });
    console.log("STEP 3 DONE → chunks:", chunks.length);

    if (!chunks.length) {
      return res.json({ answer: "No extracted text found for this PDF" });
    }

    // 3️⃣ Rank chunks
    console.log("STEP 4 → ranking chunks...");
    const ranked = chunks
      .map(chunk => ({
        text: chunk.text,
        score: cosineSimilarity(questionEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const context = ranked.map(c => c.text).join("\n");
    console.log("STEP 4 DONE → context length:", context.length);

    // 4️⃣ Ask LLM
    console.log("STEP 5 → calling LLM...");
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `Answer ONLY using the provided context.
            RESPONSE RULES:
                 - Use headings (###)
                 - Use bullet points for explanations
                - When user asks for comparison, ALWAYS use a Markdown table
                - Keep paragraphs short
                - Avoid long continuous text
                - Do NOT use HTML tags
            
            `,
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${question}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    console.log("STEP 5 DONE → sending answer");
    res.json({ answer: response.data.choices[0].message.content });

  } catch (err) {
    console.error("RAG ERROR:", err);
    res.status(500).json("RAG failed");
  }
};
