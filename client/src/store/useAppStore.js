import { create } from "zustand";
import { getTopCities } from "../data/cities";

// ─── Persistence helpers ────────────────────────────────────────

function loadSettings() {
  try {
    const raw = localStorage.getItem("navryx-ai-settings");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem("navryx-ai-settings", JSON.stringify(settings));
  } catch { /* noop */ }
}

// ─── Constants ──────────────────────────────────────────────────

const WELCOME_MESSAGE = {
  id: "1",
  role: "assistant",
  content:
    "Welcome to Navryx AI! I'm your AI Travel Concierge. Tell me — what kind of food experience are you craving, and I'll craft the perfect journey for you.",
};

const savedSettings = loadSettings();

const DEFAULT_SETTINGS = {
  openaiApiKey: "",
  forceOllama: false,
  theme: "dark",
};

const DEFAULT_PLAN_PARAMS = {
  duration: 3,
  pace: "Moderate",
  dietary: [],
  diningStyle: [],
  mealRhythm: "standard",
  cuisines: [],
  tasteProfiles: [],
  specificFoods: [],
  budgetStrategy: "Balanced Budget",
  activities: [],
};

// ─── Store ──────────────────────────────────────────────────────

export const useAppStore = create((set, get) => ({
  // ── Navigation ──
  activeTab: "explore",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ── Globe overlay ──
  showOverlay: true,
  toggleOverlay: () => set((s) => ({ showOverlay: !s.showOverlay })),

  // ── Explore filters & recommendations ──
  selectedCuisine: null,
  selectedTaste: null,
  selectedVibe: null,
  activeDestination: null,
  discoveredCities: [],

  setFilters: (cuisine, taste, vibe) => {
    const results = getTopCities({ cuisine, taste, vibe }, 3);
    const top = results[0] || null;
    set({
      selectedCuisine: cuisine,
      selectedTaste: taste,
      selectedVibe: vibe,
      discoveredCities: results,
      activeDestination: top
        ? {
            key: top.cityName.toLowerCase().replace(/\s+/g, "-"),
            name: `${top.cityName}, ${top.country}`,
            lat: top.lat,
            lng: top.lng,
            description: top.description,
            cuisine: top.cuisineType[0],
            vibe: top.vibe[0],
            matchPct: top.matchPct,
          }
        : null,
    });
  },

  selectDiscoveredCity: (city) => {
    set({
      activeDestination: {
        key: city.cityName.toLowerCase().replace(/\s+/g, "-"),
        name: `${city.cityName}, ${city.country}`,
        lat: city.lat,
        lng: city.lng,
        description: city.description,
        cuisine: city.cuisineType[0],
        vibe: city.vibe[0],
        matchPct: city.matchPct,
      },
    });
  },

  clearFilters: () =>
    set({
      selectedCuisine: null,
      selectedTaste: null,
      selectedVibe: null,
      activeDestination: null,
      discoveredCities: [],
    }),

  // ── Settings (persisted) ──
  settings: { ...DEFAULT_SETTINGS, ...savedSettings },

  updateSettings: (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    saveSettings(next);
  },

  // ── AI Chat ──
  messages: [WELCOME_MESSAGE],
  isAgentTyping: false,

  addMessage: (msg) => {
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  setAgentTyping: (v) => set({ isAgentTyping: v }),

  appendAssistantMessage: (msg) => {
    set((s) => ({
      isAgentTyping: false,
      messages: [...s.messages, msg],
    }));
  },

  clearChat: () => set({ messages: [WELCOME_MESSAGE], isAgentTyping: false }),

  // ── Agent itinerary context (shared between Itinerary → Agent tabs) ──
  agentItinerary: null,
  agentBudget: null,
  agentDestination: null,
  agentItineraryInjected: false,

  sendItineraryToAgent: (itinerary, budget, destination) => {
    set({
      agentItinerary: JSON.parse(JSON.stringify(itinerary)),
      agentBudget: budget ? JSON.parse(JSON.stringify(budget)) : null,
      agentDestination: destination,
      agentItineraryInjected: false,
      messages: [WELCOME_MESSAGE],
    });
  },

  markItineraryInjected: () => set({ agentItineraryInjected: true }),

  addToAgentItinerary: (dayIndex, activity) => {
    set((s) => {
      if (!s.agentItinerary) return {};
      const updated = JSON.parse(JSON.stringify(s.agentItinerary));
      if (dayIndex >= 0 && dayIndex < updated.length) {
        updated[dayIndex].activities.push(activity);
      } else if (updated.length > 0) {
        updated[0].activities.push(activity);
      }
      return { agentItinerary: updated };
    });
  },

  removeFromAgentItinerary: (dayIndex, activityIndex) => {
    set((s) => {
      if (!s.agentItinerary) return {};
      const updated = JSON.parse(JSON.stringify(s.agentItinerary));
      if (dayIndex >= 0 && dayIndex < updated.length) {
        updated[dayIndex].activities.splice(activityIndex, 1);
      }
      return { agentItinerary: updated };
    });
  },

  // ── Itinerary planning ──
  planDestination: null,
  planParams: { ...DEFAULT_PLAN_PARAMS },
  generatedItinerary: null,
  generatedBudget: null,
  isGenerating: false,

  setPlanDestination: (dest) => {
    const { selectedCuisine, selectedTaste } = get();
    const cuisines = [];
    if (selectedCuisine) cuisines.push(selectedCuisine);
    if (dest?.cuisine && !cuisines.includes(dest.cuisine)) cuisines.push(dest.cuisine);
    const tasteProfiles = selectedTaste ? [selectedTaste] : [];
    set({
      planDestination: dest,
      planParams: {
        ...DEFAULT_PLAN_PARAMS,
        cuisines,
        tasteProfiles,
      },
    });
  },

  updatePlanParams: (patch) => {
    set((s) => ({ planParams: { ...s.planParams, ...patch } }));
  },

  setGeneratedItinerary: (itinerary, budget) => {
    set({ generatedItinerary: itinerary, generatedBudget: budget, isGenerating: false });
  },

  setIsGenerating: (v) => set({ isGenerating: v }),

  clearItinerary: () =>
    set({
      generatedItinerary: null,
      generatedBudget: null,
    }),
}));
