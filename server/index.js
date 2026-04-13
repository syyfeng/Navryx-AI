import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import itineraryRoutes from "./routes/itinerary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/chat", chatRoutes);
app.use("/api/itinerary", itineraryRoutes);

app.get("/api/health", (_req, res) => {
  const hasOpenAI =
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your_openai_api_key_here" &&
    process.env.OPENAI_API_KEY.trim() !== "";
  res.json({
    status: "ok",
    service: "GastroGlobe API",
    aiProvider: hasOpenAI ? "openai" : "ollama",
  });
});

app.listen(PORT, () => {
  console.log(`GastroGlobe server running on http://localhost:${PORT}`);
});
