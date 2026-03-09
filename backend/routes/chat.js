// ─── ChatGPT API Integration Route ───

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

// ─── Initialize the OpenAI client ───
// Requires OPENAI_API_KEY from: https://platform.openai.com/api-keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── POST /chat/message ───
// Accepts: { "message": "Hello!", "history": [...] }
// Returns: { "reply": "AI response text" }
router.post("/message", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A 'message' string is required." });
    }

    // Check that the API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is not configured on the server." });
    }

    // Build the messages array for the OpenAI API
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful and friendly AI assistant called Chat Genius. You provide clear, concise, and accurate answers.",
      },
      // Include conversation history if provided
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
      // Add the new user message
      { role: "user", content: message },
    ];

    // ─── Call the OpenAI Chat Completions API ───
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Change to "gpt-4" if you have access
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    // Extract and return the assistant's reply
    const reply = completion.choices[0]?.message?.content || "No response.";
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error.message);

    if (error.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please wait and try again." });
    }

    res.status(500).json({ error: "Failed to get AI response." });
  }
});

module.exports = router;
