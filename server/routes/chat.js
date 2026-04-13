import { Router } from "express";
import { chat } from "../services/ai.js";

const router = Router();

router.post("/", async (req, res) => {
  const { messages, forceOllama, apiKey, itineraryContext } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const history = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const result = await chat(history, { forceOllama, apiKey, itineraryContext });
    res.json(result);
  } catch (err) {
    res.status(502).json({
      role: "assistant",
      content:
        "I'm having trouble connecting to the AI service. Please check your API key in Settings, or ensure Ollama is running locally.",
      error: true,
      detail: err.message,
    });
  }
});

export default router;
