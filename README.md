# GastroGlobe

A luxury travel & food recommendation web app built with the MERN stack — featuring an interactive 3D globe, a weighted city recommendation engine, AI-powered travel concierge, personalized foodie itinerary generation, and a dual Dark/Light theme system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (Vite), TailwindCSS v4, Framer Motion |
| 3D Globe | React Three Fiber + Drei, TopoJSON country borders |
| State | Zustand (with localStorage persistence for settings) |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| AI | OpenAI SDK — supports **OpenAI API** and **local Ollama** (auto-fallback) |
| Database | MongoDB + Mongoose (ready to connect) |

## Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **AI Provider** (one of the following):
  - An [OpenAI API key](https://platform.openai.com/api-keys) — uses `gpt-4o-mini` by default
  - [Ollama](https://ollama.com) running locally with `llama3.2` pulled — used automatically when no OpenAI key is set

#### Setting up Ollama (free, local AI)

```bash
# Install Ollama (macOS)
brew install ollama

# Start the Ollama server
ollama serve

# Pull the llama3.2 model (in another terminal)
ollama pull llama3.2
```

Ollama runs at `http://localhost:11434` by default. GastroGlobe will auto-detect and use it when no OpenAI API key is configured.

### Install & Run

```bash
# 1. Install dependencies (from project root)
cd client && npm install
cd ../server && npm install

# 2. Configure environment (optional — edit server/.env)
#    Set OPENAI_API_KEY if you have one, or leave blank for Ollama
cd ../server
cp .env .env.local  # optional, .env works fine

# 3. Start both services (in separate terminals)

# Terminal 1 — Backend API server
cd server && node index.js        # → http://localhost:3001

# Terminal 2 — Frontend dev server
cd client && npm run dev           # → http://localhost:5173
```

> **Important:** Both the client (`localhost:5173`) and server (`localhost:3001`) must be running for AI features (chat and itinerary generation) to work. The Vite dev server proxies `/api` requests to the backend.

### Environment Variables (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `OPENAI_API_KEY` | _(empty)_ | Your OpenAI key. Leave blank to use Ollama |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Ollama model to use |
| `MONGODB_URI` | `mongodb://localhost:27017/gastroglobe` | MongoDB connection string |

You can also set the OpenAI API key and toggle Ollama directly in the app's **Settings** page — those values are stored in the browser and sent with each request.

## Project Structure

```
GastroGlobe/
├── client/                       # React (Vite) frontend
│   ├── public/                   # Static assets (globe textures, GeoJSON)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe3D.jsx       # Interactive 3D globe (R3F + country borders/labels)
│   │   │   ├── ControlPanel.jsx  # Discover panel + scoring results + "Plan Itinerary"
│   │   │   └── Sidebar.jsx       # Navigation sidebar (theme-aware)
│   │   ├── data/
│   │   │   └── cities.js         # 50-city database + weighted scoring algorithm
│   │   ├── hooks/
│   │   │   └── useTheme.js       # Theme hook — syncs Zustand settings to DOM
│   │   ├── pages/
│   │   │   ├── ExplorePage.jsx   # 3D globe + cuisine discovery
│   │   │   ├── AgentPage.jsx     # AI chat concierge + recommendation cards
│   │   │   ├── ItineraryPage.jsx # Foodie itinerary builder + AI generation
│   │   │   └── SettingsPage.jsx  # API key, theme, Ollama toggle
│   │   ├── store/
│   │   │   └── useAppStore.js    # Zustand store (settings, chat, itinerary, globe)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # TailwindCSS + custom styles + light/dark themes
│   └── index.html
├── server/                       # Express.js backend
│   ├── services/
│   │   └── ai.js                 # AI service — OpenAI/Ollama routing, chat & itinerary
│   ├── routes/
│   │   ├── chat.js               # POST /api/chat — conversational AI with memory
│   │   └── itinerary.js          # POST /api/itinerary/generate — AI itinerary builder
│   ├── index.js                  # Server entry
│   └── .env                      # Environment configuration
└── README.md
```

## Features

### Explore Tab — 3D Globe & Smart Recommendations

Interactive 3D globe with NASA Blue Marble texture, toggleable country borders (constant-width 3D lines), and billboard labels. The globe adapts to the active theme — dark space background with stars in Dark Mode, bright sky-toned lighting in Light Mode.

**Discover Panel** — Filter by **Cuisine Type** (25 options: Mediterranean, East Asian, Latin American, Nordic, Alpine, Middle Eastern, and more), **Taste Profile** (10 options: Umami-rich, Spicy & Bold, Citrus & Fresh, etc.), and **Vibe** (12 options: Neon Cyberpunk, Historic Cobblestones, Alpine Retreat, etc.).

**Weighted Recommendation Engine** — Instead of strict filtering, a scoring algorithm ensures you always get relevant results:

| Filter Match | Points |
|-------------|--------|
| Cuisine match | +3 |
| Vibe match | +2 |
| Taste Profile match | +1 |

The engine scores all 50 cities in the database, sorts by total score, and returns the **top 3 matches** — each displayed with a **match percentage** and **"Why this city?"** breakdown showing which filters matched. Click any result to rotate the globe to that city. Click **"Plan Itinerary"** to jump directly to the itinerary builder with the destination pre-filled.

**Discover → Itinerary State Sync** — When navigating to the Itinerary tab via "Plan Itinerary", the Cuisine Type and Taste Profile filters from the Discover panel are automatically carried over and pre-filled into the Itinerary's customization controls. No manual re-entry required.

### AI Agent Tab — Dual-Pane Chat + Live Canvas

Chat with an AI Travel Concierge powered by OpenAI or local Ollama. Full conversation memory within the session.

**Dual-Pane Layout:**
- **Left pane:** Chat interface with structured UI cards (Flight, Hotel, Transit recommendations) rendered inline. Each card has an **"Add to Itinerary"** button that instantly updates the live canvas.
- **Right pane:** Scrollable Live Itinerary Canvas showing the working itinerary with per-activity **"Remove"** buttons for real-time editing.

The AI receives itinerary context and can suggest logistics, swap restaurants, and optimize for budget or reward points.

### Itinerary Tab — Foodie-Focused Trip Builder

A comprehensive itinerary builder with:
- **Trip Basics** — Duration slider (1–14 days), pace toggle (Relaxed, Moderate, Action-Packed)
- **Foodie Profile** — Dietary restrictions, dining style (Michelin, street food, cafes…), meal rhythm (standard 3 meals vs. grazing mode with 5+ stops)
- **Cuisine Selection** — All 25 cuisine types available. Selecting a cuisine dynamically renders its specific dishes (e.g. "Alpine" shows Cheese Fondue, Raclette, Rösti; "Mediterranean" shows Paella, Grilled Octopus, Shakshuka). Cascading tags update instantly when the parent cuisine changes.
- **Taste Profile** — Multi-select tags (Umami-rich, Spicy & Bold, Artisanal Dairy, etc.) injected into the AI system prompt to influence restaurant and dish selection
- **Smart Budget Allocator** — Strategy selector (splurge on food, balanced, luxury, budget-friendly)
- **Between-Meals Activities** — Museums, hiking, shopping, cooking classes, markets
- **AI Generation** — Sends all parameters (including cuisines, taste profiles, and specific dishes) to the backend, returns a day-by-day timeline interleaving restaurants with activities, plus a full budget breakdown
- **"Refine with AI Concierge"** — One-click handoff to the Agent tab with full itinerary context

### Settings Tab

- **AI Provider** — OpenAI API Key input (masked) with test-connection button, Force-Ollama toggle
- **Appearance** — Dark/Light mode toggle (fully functional — changes propagate across all components and the 3D globe)
- **Data & Privacy** — Clear chat history

### Theme System — Dark & Light Modes

| Aspect | Dark Mode | Light Mode |
|--------|-----------|------------|
| Background | Deep zinc (#09090b) | Off-white cream (#FAFAFA) |
| Cards | Glassmorphism (blur + transparency) | White with soft drop shadows |
| Text | White / zinc tones | Slate-800 / slate tones |
| Globe | Stars + space background | Bright sky-toned lighting, no stars |
| Accent | Purple glow | Purple (deeper, no glow) |

The theme is stored in localStorage and applies instantly via CSS custom properties + a `data-theme` attribute on the document root. Every component uses the `useTheme()` hook's `t(dark, light)` helper for conditional styling.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat` | Send conversation history, get AI response (with optional itinerary context) |
| `POST` | `/api/itinerary/generate` | Generate a foodie itinerary from parameters |
| `GET` | `/api/health` | Health check + current AI provider status |

## Troubleshooting

**"Network error. Make sure the server is running."**
- Ensure the backend is started: `cd server && node index.js`
- Check it's listening on port 3001: visit `http://localhost:3001/api/health`

**AI replies with "I'm having trouble connecting to the AI service"**
- If using OpenAI: verify your API key is valid in Settings
- If using Ollama: make sure `ollama serve` is running and `llama3.2` is pulled
- Check the server terminal for detailed error messages

**Globe not loading / white screen**
- Hard-refresh the browser (`Cmd+Shift+R`)
- Ensure `client/public/earth-blue-marble.jpg` and `client/public/countries-110m.json` exist

**Theme not applying**
- Clear localStorage: open DevTools → Application → Local Storage → delete `gastroglobe-settings`
- Refresh the page — the default Dark Mode will apply
