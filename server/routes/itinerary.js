import { Router } from "express";
import { generateItinerary } from "../services/ai.js";

const router = Router();

router.post("/generate", async (req, res) => {
  const { params, forceOllama, apiKey } = req.body;

  if (!params || !params.destination) {
    return res.status(400).json({ error: "params.destination is required" });
  }

  try {
    const result = await generateItinerary(params, { forceOllama, apiKey });
    res.json(result);
  } catch (err) {
    res.status(502).json({
      error: true,
      message: "Failed to generate itinerary. Check your AI provider settings.",
      detail: err.message,
    });
  }
});

export default router;
