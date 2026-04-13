import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Plane, Hotel, Utensils, Server, Cloud,
  Clock, Train, Star, Award, Plus, Check, MapPin, Landmark, X,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";

// ─── Helpers ────────────────────────────────────────────────────

function cleanMessageContent(text) {
  if (!text) return "";
  return text
    .replace(/```(?:json)?\s*[\s\S]*?```/g, "")
    .replace(/\[CARDS\][\s\S]*?\[\/CARDS\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeDays(itinerary) {
  if (!itinerary || !Array.isArray(itinerary)) return [];
  const map = new Map();
  for (const day of itinerary) {
    const key = day.day;
    if (map.has(key)) {
      map.get(key).activities.push(...(day.activities || []));
    } else {
      map.set(key, { ...day, activities: [...(day.activities || [])] });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.day - b.day);
}

// ─── Activity type config ───────────────────────────────────────

const TYPE_CONFIG = {
  food:     { icon: Utensils, color: "text-amber-400", bg: "bg-amber-400/10" },
  hotel:    { icon: Hotel,    color: "text-blue-400",  bg: "bg-blue-400/10" },
  travel:   { icon: Plane,    color: "text-purple-400", bg: "bg-purple-400/10" },
  activity: { icon: Landmark, color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

// ─── Logistics card components ──────────────────────────────────

function FlightCard({ card, onAdd }) {
  const [added, setAdded] = useState(false);
  const { t } = useTheme();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
          <Plane size={14} className="text-purple-400" />
        </div>
        <span className={`text-[11px] font-medium uppercase tracking-wider ${t("text-zinc-500", "text-slate-500")}`}>Flight</span>
      </div>
      <p className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>{card.airline}</p>
      <p className={`text-xs ${t("text-zinc-400", "text-slate-500")}`}>{card.route}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${t("text-zinc-500", "text-slate-500")}`}>{card.duration} · {card.class}</span>
        <span className="font-semibold text-accent">{card.price}</span>
      </div>
      {card.scenic && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[11px] text-emerald-400">
          <Star size={10} /> {card.scenic}
        </div>
      )}
      {card.rewards && (
        <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-400">
          <Award size={10} /> {card.rewards}
        </div>
      )}
      <button
        onClick={() => { if (!added) { onAdd({ time: "TBD", label: `${card.airline} — ${card.route} (${card.price})`, type: "travel", cost: parseInt(card.price?.replace(/[^0-9]/g, "")) || 0 }); setAdded(true); } }}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${added ? "bg-emerald-500/15 text-emerald-400" : "bg-accent-dim text-accent hover:bg-accent/20"}`}
      >
        {added ? <><Check size={12} /> Added to Itinerary</> : <><Plus size={12} /> Add to Itinerary</>}
      </button>
    </motion.div>
  );
}

function HotelCard({ card, onAdd }) {
  const [added, setAdded] = useState(false);
  const { t } = useTheme();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
          <Hotel size={14} className="text-blue-400" />
        </div>
        <span className={`text-[11px] font-medium uppercase tracking-wider ${t("text-zinc-500", "text-slate-500")}`}>Hotel</span>
      </div>
      <p className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>{card.name}</p>
      <p className={`text-xs ${t("text-zinc-400", "text-slate-500")}`}>{card.location}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${t("text-zinc-500", "text-slate-500")}`}>{"★".repeat(card.stars || 4)} · {card.rating || "4.5"}</span>
        <span className="font-semibold text-accent">{card.price}</span>
      </div>
      {card.scenic && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[11px] text-emerald-400">
          <Star size={10} /> {card.scenic}
        </div>
      )}
      {card.rewards && (
        <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-400">
          <Award size={10} /> {card.rewards}
        </div>
      )}
      <button
        onClick={() => { if (!added) { onAdd({ time: "TBD", label: `Check in at ${card.name} (${card.price})`, type: "hotel", cost: parseInt(card.price?.replace(/[^0-9]/g, "")) || 0 }, card.nearDay != null ? card.nearDay - 1 : 0); setAdded(true); } }}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${added ? "bg-emerald-500/15 text-emerald-400" : "bg-accent-dim text-accent hover:bg-accent/20"}`}
      >
        {added ? <><Check size={12} /> Added to Itinerary</> : <><Plus size={12} /> Add to Itinerary</>}
      </button>
    </motion.div>
  );
}

function TransitCard({ card, onAdd }) {
  const [added, setAdded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
          <Train size={14} className="text-teal-400" />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">Transit</span>
      </div>
      <p className="text-sm font-semibold text-ink">{card.name}</p>
      <p className="text-xs text-ink-muted">{card.route}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-ink-muted">{card.duration}</span>
        <span className="font-semibold text-accent">{card.price}</span>
      </div>
      {card.scenic && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[11px] text-emerald-400">
          <Star size={10} /> {card.scenic}
        </div>
      )}
      <button
        onClick={() => { if (!added) { onAdd({ time: "TBD", label: `${card.name} — ${card.route} (${card.price})`, type: "travel", cost: parseInt(card.price?.replace(/[^0-9]/g, "")) || 0 }); setAdded(true); } }}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${added ? "bg-emerald-500/15 text-emerald-400" : "bg-accent-dim text-accent hover:bg-accent/20"}`}
      >
        {added ? <><Check size={12} /> Added to Itinerary</> : <><Plus size={12} /> Add to Itinerary</>}
      </button>
    </motion.div>
  );
}

function LogisticsCards({ cards, onAddToItinerary }) {
  if (!cards || cards.length === 0) return null;
  return (
    <div className="mt-2 grid gap-2">
      {cards.map((card, i) => {
        if (card.type === "flight") return <FlightCard key={i} card={card} onAdd={(act) => onAddToItinerary(0, act)} />;
        if (card.type === "hotel") return <HotelCard key={i} card={card} onAdd={(act, day) => onAddToItinerary(day ?? 0, act)} />;
        if (card.type === "transit") return <TransitCard key={i} card={card} onAdd={(act) => onAddToItinerary(0, act)} />;
        return null;
      })}
    </div>
  );
}

// ─── Editable itinerary canvas (right pane) ─────────────────────

function ItineraryCanvas({ itinerary, destination, onRemove }) {
  const days = useMemo(() => normalizeDays(itinerary), [itinerary]);
  const { t } = useTheme();
  if (!days.length) return null;

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
          <MapPin size={14} className="text-accent" />
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>
            {destination?.name || "Your Itinerary"}
          </h3>
          <p className={`text-[10px] ${t("text-zinc-500", "text-slate-500")}`}>
            {days.length} days · Live working document
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {days.map((day, dayIdx) => (
          <div key={`day-${day.day}`}>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-dim text-[11px] font-bold text-accent">
                D{day.day}
              </div>
              <span className={`text-xs font-semibold ${t("text-zinc-300", "text-slate-700")}`}>
                {day.title}
              </span>
            </div>
            <div className={`ml-3.5 space-y-1.5 border-l pl-5 ${t("border-white/10", "border-slate-200")}`}>
              <AnimatePresence initial={false}>
                {day.activities.map((act, ai) => {
                  const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.activity;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={`${day.day}-${ai}-${act.label}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${t("bg-white/[0.03] hover:bg-white/[0.06]", "bg-slate-100/50 hover:bg-slate-100")}`}
                    >
                      <div className={`absolute -left-[1.65rem] h-2 w-2 rounded-full border group-hover:border-accent group-hover:bg-accent ${t("border-zinc-700 bg-zinc-800", "border-slate-300 bg-slate-200")}`} />
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${cfg.bg}`}>
                        <Icon size={11} className={cfg.color} />
                      </div>
                      <p className={`flex-1 text-[11px] leading-snug ${t("text-zinc-400", "text-slate-600")}`}>
                        {act.label}
                      </p>
                      <span className={`text-[10px] ${t("text-zinc-600", "text-slate-400")}`}>{act.time}</span>
                      <button
                        onClick={() => onRemove(dayIdx, ai)}
                        className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity hover:bg-red-500/20 group-hover:opacity-100"
                      >
                        <X size={10} className="text-red-400" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main agent page ────────────────────────────────────────────

export default function AgentPage() {
  const {
    messages, addMessage, setAgentTyping, appendAssistantMessage,
    isAgentTyping, settings,
    agentItinerary, agentBudget, agentDestination,
    agentItineraryInjected, markItineraryInjected,
    addToAgentItinerary, removeFromAgentItinerary,
  } = useAppStore();
  const { t } = useTheme();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const hasInjected = useRef(false);

  const hasItinerary = !!agentItinerary;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentTyping]);

  useEffect(() => {
    if (agentItinerary && !agentItineraryInjected && !hasInjected.current) {
      hasInjected.current = true;
      markItineraryInjected();

      const destName = agentDestination?.name || "your destination";
      const dayCount = normalizeDays(agentItinerary).length;
      appendAssistantMessage({
        id: `itinerary-greeting-${Date.now()}`,
        role: "assistant",
        content: `I see your ${dayCount}-day foodie itinerary for ${destName}! I've loaded it into my working canvas on the right. I can help you:\n\n• Find flights and compare prices\n• Book hotels near your Day 1–${dayCount} restaurants\n• Discover scenic transit routes between stops\n• Optimize for credit card reward points\n• Swap out restaurants or adjust the schedule\n\nWhat would you like to refine first?`,
      });
    }
  }, [agentItinerary, agentItineraryInjected, agentDestination, markItineraryInjected, appendAssistantMessage]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isAgentTyping) return;

    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    addMessage(userMsg);
    setInput("");
    setAgentTyping(true);

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));
    history.push({ role: "user", content: text });

    const itineraryContext = agentItinerary
      ? { itinerary: normalizeDays(agentItinerary), budget: agentBudget, destination: agentDestination }
      : undefined;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          forceOllama: settings.forceOllama,
          apiKey: settings.openaiApiKey,
          itineraryContext,
        }),
      });
      const data = await res.json();
      appendAssistantMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        cards: data.cards || null,
        provider: data.provider,
      });
    } catch {
      appendAssistantMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't connect to the AI service. Please check your settings and make sure the server is running.",
      });
    }
  }, [input, isAgentTyping, messages, settings, agentItinerary, agentBudget, agentDestination, addMessage, setAgentTyping, appendAssistantMessage]);

  const providerLabel = settings.forceOllama || !settings.openaiApiKey
    ? { icon: Server, label: "Ollama (llama3.2)", color: "text-amber-400" }
    : { icon: Cloud, label: "OpenAI (gpt-4o-mini)", color: "text-emerald-400" };
  const ProviderIcon = providerLabel.icon;

  return (
    <div className="flex h-full">
      {/* ── Left: Chat pane ── */}
      <div className={`flex min-w-0 flex-1 flex-col ${hasItinerary ? `border-r ${t("border-white/5", "border-slate-200")}` : ""}`}>
        {/* Header */}
        <div className={`flex shrink-0 items-center gap-3 border-b px-6 py-4 ${t("border-white/5", "border-slate-200")}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white">
            <Bot size={18} />
          </div>
          <div className="flex-1">
            <h2 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>AI Travel Concierge</h2>
            <div className="flex items-center gap-1.5">
              <ProviderIcon size={10} className={providerLabel.color} />
              <p className={`text-[11px] ${providerLabel.color}`}>{providerLabel.label}</p>
            </div>
          </div>
          {hasItinerary && (
            <div className="flex items-center gap-1.5 rounded-full bg-accent-dim px-3 py-1">
              <MapPin size={10} className="text-accent" />
              <span className="text-[10px] font-medium text-accent">Itinerary loaded</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.map((msg) => {
            const displayContent = msg.role === "assistant" ? cleanMessageContent(msg.content) : msg.content;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "user"
                    ? t("bg-zinc-800 text-zinc-400", "bg-slate-200 text-slate-500")
                    : "bg-accent-dim text-accent"
                }`}>
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="max-w-[80%]">
                  {displayContent && (
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-accent text-white"
                        : t("bg-white/5 text-zinc-300", "bg-slate-100 text-slate-700")
                    }`}>
                      {displayContent}
                    </div>
                  )}
                  {msg.cards && (
                    <LogisticsCards cards={msg.cards} onAddToItinerary={addToAgentItinerary} />
                  )}
                </div>
              </motion.div>
            );
          })}

          {isAgentTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim text-accent">
                <Bot size={14} />
              </div>
              <div className={`flex items-center gap-1 rounded-2xl px-4 py-3 ${t("bg-white/5", "bg-slate-100")}`}>
                <span className={`h-2 w-2 animate-bounce rounded-full [animation-delay:0ms] ${t("bg-zinc-500", "bg-slate-400")}`} />
                <span className={`h-2 w-2 animate-bounce rounded-full [animation-delay:150ms] ${t("bg-zinc-500", "bg-slate-400")}`} />
                <span className={`h-2 w-2 animate-bounce rounded-full [animation-delay:300ms] ${t("bg-zinc-500", "bg-slate-400")}`} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`shrink-0 border-t p-4 ${t("border-white/5", "border-slate-200")}`}>
          <div className={`glass flex items-center gap-3 rounded-2xl px-4 py-3`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={hasItinerary ? "Ask about flights, hotels, transit, or modify your itinerary..." : "Ask about destinations, food, or travel plans..."}
              className={`flex-1 bg-transparent text-sm outline-none ${t("text-white placeholder-zinc-600", "text-slate-800 placeholder-slate-400")}`}
            />
            <button
              onClick={send}
              disabled={!input.trim() || isAgentTyping}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white transition-opacity hover:opacity-80 disabled:opacity-30"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Scrollable itinerary canvas ── */}
      {hasItinerary ? (
        <div className="hidden w-[380px] shrink-0 flex-col lg:flex" style={{ height: "calc(100vh - 0px)" }}>
          <div className={`flex shrink-0 items-center gap-2 border-b px-5 py-4 ${t("border-white/5", "border-slate-200")}`}>
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <h3 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>Live Itinerary Canvas</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ItineraryCanvas
              itinerary={agentItinerary}
              destination={agentDestination}
              onRemove={removeFromAgentItinerary}
            />
          </div>
        </div>
      ) : (
        <div className="hidden w-96 flex-col lg:flex">
          <div className={`border-b px-6 py-4 ${t("border-white/5", "border-slate-200")}`}>
            <h3 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>Quick Start</h3>
            <p className={`text-[11px] ${t("text-zinc-500", "text-slate-500")}`}>Generate an itinerary first, then refine it here</p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${t("bg-white/5", "bg-slate-100")}`}>
              <MapPin size={22} className={t("text-zinc-600", "text-slate-400")} />
            </div>
            <p className={`text-xs ${t("text-zinc-500", "text-slate-500")}`}>
              Discover a destination on the Explore tab, generate an itinerary,
              then click &ldquo;Refine with AI Concierge&rdquo; to load it here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
