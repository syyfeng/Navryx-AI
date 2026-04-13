import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Utensils, Hotel, Plane, Clock, DollarSign,
  ChefHat, Salad, Coffee, Mountain, ShoppingBag, Palette,
  Landmark, Sparkles, Zap, Leaf, Timer, Heart,
  ArrowRight, Loader2, AlertCircle, Bot,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";
import { CUISINES, TASTE_PROFILES, CUISINE_FOOD_MAP } from "../data/cities";

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

// ─── Option data ────────────────────────────────────────────────

const PACE_OPTIONS = [
  { value: "Relaxed & Slow", icon: Coffee, label: "Relaxed & Slow" },
  { value: "Moderate", icon: Timer, label: "Moderate" },
  { value: "Action-Packed", icon: Zap, label: "Action-Packed" },
];

const DIETARY_OPTIONS = [
  "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Nut-Free", "Dairy-Free", "Kosher",
];

const DINING_STYLES = [
  { value: "Michelin/Fine Dining", icon: Sparkles },
  { value: "Street Food & Night Markets", icon: ChefHat },
  { value: "Local Hole-in-the-Wall", icon: Heart },
  { value: "Scenic Views (Mountains/Lakeside)", icon: Mountain },
  { value: "Cafe & Bakery Culture", icon: Coffee },
];

const MEAL_RHYTHMS = [
  { value: "standard", label: "Standard 3 Meals", desc: "Breakfast, lunch, dinner" },
  { value: "grazing", label: "Grazing Mode", desc: "5+ small food stops throughout the day" },
];

const BUDGET_STRATEGIES = [
  "Splurge on Food, Save on Hotels",
  "Balanced Budget",
  "Luxury Across the Board",
  "Budget-Friendly Foodie",
];

const ACTIVITY_OPTIONS = [
  { value: "Museums & Culture", icon: Landmark },
  { value: "Nature & Light Hiking", icon: Mountain },
  { value: "Shopping", icon: ShoppingBag },
  { value: "Historical Sites", icon: Landmark },
  { value: "Cooking Classes", icon: ChefHat },
  { value: "Markets & Bazaars", icon: ShoppingBag },
];


// ─── Reusable UI ────────────────────────────────────────────────

function PillToggle({ options, selected, onToggle, multi = false }) {
  const { t } = useTheme();
  const isSelected = (v) => multi ? selected.includes(v) : selected === v;
  const handleClick = (v) => {
    if (multi) {
      onToggle(isSelected(v) ? selected.filter((s) => s !== v) : [...selected, v]);
    } else {
      onToggle(v);
    }
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : (opt.label || opt.value);
        const Icon = typeof opt === "object" ? opt.icon : null;
        const active = isSelected(val);
        return (
          <button
            key={val}
            onClick={() => handleClick(val)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              active
                ? "bg-accent text-white shadow-md shadow-purple-500/20"
                : `${t("bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200", "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700")}`
            }`}
          >
            {Icon && <Icon size={12} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ControlSection({ label, children }) {
  const { t } = useTheme();
  return (
    <div>
      <label className={`mb-2 block text-[11px] font-semibold uppercase tracking-widest ${t("text-zinc-500", "text-slate-500")}`}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Activity type config ───────────────────────────────────────

const TYPE_CONFIG = {
  food: { icon: Utensils, color: "text-amber-400", bg: "bg-amber-400/10" },
  hotel: { icon: Hotel, color: "text-blue-400", bg: "bg-blue-400/10" },
  travel: { icon: Plane, color: "text-purple-400", bg: "bg-purple-400/10" },
  activity: { icon: Landmark, color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

function BudgetBar({ label, amount, total, color }) {
  const { t } = useTheme();
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className={`text-xs font-medium ${t("text-zinc-400", "text-slate-500")}`}>{label}</span>
        <span className={`text-xs font-semibold ${t("text-zinc-300", "text-slate-700")}`}>
          ${amount.toLocaleString()}
        </span>
      </div>
      <div className={`h-2 overflow-hidden rounded-full ${t("bg-white/5", "bg-slate-100")}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────

export default function ItineraryPage() {
  const {
    planDestination, planParams, updatePlanParams,
    generatedItinerary, generatedBudget,
    isGenerating, setIsGenerating, setGeneratedItinerary,
    settings, setActiveTab, sendItineraryToAgent,
  } = useAppStore();
  const { t } = useTheme();

  const [error, setError] = useState(null);

  const dest = planDestination;
  const rawItinerary = generatedItinerary;
  const itinerary = useMemo(() => normalizeDays(rawItinerary), [rawItinerary]);
  const budget = generatedBudget;

  const availableFoods = planParams.cuisines
    .flatMap((c) => CUISINE_FOOD_MAP[c] || [])
    .filter((v, i, a) => a.indexOf(v) === i);

  const handleGenerate = async () => {
    if (!dest) return;
    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          params: { ...planParams, destination: dest.name },
          forceOllama: settings.forceOllama,
          apiKey: settings.openaiApiKey,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.message || "Failed to generate itinerary");
        setIsGenerating(false);
        return;
      }
      setGeneratedItinerary(data.itinerary, data.budget);
    } catch (err) {
      setError("Network error. Make sure the server is running.");
      setIsGenerating(false);
    }
  };

  // ── No destination selected ──
  if (!dest) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-dim">
          <MapPin size={28} className="text-accent" />
        </div>
        <h2 className={`font-display text-2xl font-bold ${t("text-white", "text-slate-800")}`}>
          No Destination Selected
        </h2>
        <p className={`max-w-sm text-center text-sm ${t("text-zinc-500", "text-slate-500")}`}>
          Head to the Explore tab, discover a destination, then click
          &quot;Plan Itinerary&quot; to start building your food-focused trip.
        </p>
        <button
          onClick={() => setActiveTab("explore")}
          className="mt-2 flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
        >
          Go to Explore
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* ── Left: Controls Panel ── */}
      <div className={`w-[380px] shrink-0 overflow-y-auto border-r p-6 ${t("border-white/5", "border-slate-200")}`}>
        {/* Destination header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="glow-marker flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim">
            <MapPin size={18} className="text-accent" />
          </div>
          <div>
            <h2 className={`font-display text-lg font-bold ${t("text-white", "text-slate-800")}`}>
              {dest.name}
            </h2>
            <p className={`text-xs ${t("text-zinc-500", "text-slate-500")}`}>{dest.description}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* ── Trip Basics ── */}
          <div className="glass rounded-xl p-4">
            <h3 className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t("text-zinc-400", "text-slate-500")}`}>
              <Plane size={12} /> Trip Basics
            </h3>

            <ControlSection label="Duration (days)">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={planParams.duration}
                  onChange={(e) => updatePlanParams({ duration: +e.target.value })}
                  className={`h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-purple-500 ${t("bg-white/10", "bg-slate-200")}`}
                />
                <span className={`w-8 text-center text-sm font-bold ${t("text-white", "text-slate-800")}`}>
                  {planParams.duration}
                </span>
              </div>
            </ControlSection>

            <div className="mt-3">
              <ControlSection label="Pace of Travel">
                <PillToggle
                  options={PACE_OPTIONS}
                  selected={planParams.pace}
                  onToggle={(v) => updatePlanParams({ pace: v })}
                />
              </ControlSection>
            </div>
          </div>

          {/* ── Foodie Profile ── */}
          <div className="glass rounded-xl p-4">
            <h3 className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t("text-zinc-400", "text-slate-500")}`}>
              <ChefHat size={12} /> Foodie Profile
            </h3>

            <div className="space-y-4">
              <ControlSection label="Dietary & Allergies">
                <PillToggle
                  options={DIETARY_OPTIONS}
                  selected={planParams.dietary}
                  onToggle={(v) => updatePlanParams({ dietary: v })}
                  multi
                />
              </ControlSection>

              <ControlSection label="Dining Style & Vibe">
                <PillToggle
                  options={DINING_STYLES}
                  selected={planParams.diningStyle}
                  onToggle={(v) => updatePlanParams({ diningStyle: v })}
                  multi
                />
              </ControlSection>

              <ControlSection label="Meal Rhythm">
                <div className="flex gap-2">
                  {MEAL_RHYTHMS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => updatePlanParams({ mealRhythm: r.value })}
                      className={`flex-1 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                        planParams.mealRhythm === r.value
                          ? "bg-accent-dim ring-1 ring-accent/40"
                          : `${t("bg-white/5 hover:bg-white/8", "bg-slate-100 hover:bg-slate-200")}`
                      }`}
                    >
                      <p className={`text-xs font-semibold ${
                        planParams.mealRhythm === r.value ? "text-accent" : t("text-zinc-300", "text-slate-700")
                      }`}>
                        {r.label}
                      </p>
                      <p className={`mt-0.5 text-[10px] ${t("text-zinc-500", "text-slate-400")}`}>{r.desc}</p>
                    </button>
                  ))}
                </div>
              </ControlSection>

              <ControlSection label="Cuisine Selection">
                <PillToggle
                  options={CUISINES}
                  selected={planParams.cuisines}
                  onToggle={(v) => updatePlanParams({ cuisines: v, specificFoods: [] })}
                  multi
                />
                {availableFoods.length > 0 && (
                  <div className="mt-2">
                    <p className={`mb-1 text-[10px] font-medium ${t("text-zinc-500", "text-slate-400")}`}>
                      Specific dishes (optional)
                    </p>
                    <PillToggle
                      options={availableFoods}
                      selected={planParams.specificFoods}
                      onToggle={(v) => updatePlanParams({ specificFoods: v })}
                      multi
                    />
                  </div>
                )}
              </ControlSection>

              <ControlSection label="Taste Profile">
                <PillToggle
                  options={TASTE_PROFILES}
                  selected={planParams.tasteProfiles}
                  onToggle={(v) => updatePlanParams({ tasteProfiles: v })}
                  multi
                />
                <p className={`mt-1.5 text-[10px] ${t("text-zinc-600", "text-slate-400")}`}>
                  Influences restaurant selection and flavor focus
                </p>
              </ControlSection>
            </div>
          </div>

          {/* ── Budget Strategy ── */}
          <div className="glass rounded-xl p-4">
            <h3 className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t("text-zinc-400", "text-slate-500")}`}>
              <DollarSign size={12} /> Smart Budget
            </h3>
            <PillToggle
              options={BUDGET_STRATEGIES}
              selected={planParams.budgetStrategy}
              onToggle={(v) => updatePlanParams({ budgetStrategy: v })}
            />
          </div>

          {/* ── Space Between Meals ── */}
          <div className="glass rounded-xl p-4">
            <h3 className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t("text-zinc-400", "text-slate-500")}`}>
              <Leaf size={12} /> Between Meals
            </h3>
            <PillToggle
              options={ACTIVITY_OPTIONS}
              selected={planParams.activities}
              onToggle={(v) => updatePlanParams({ activities: v })}
              multi
            />
          </div>

          {/* ── Generate button ── */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="glow-marker flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/30 transition-all hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating Your Foodie Itinerary…
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Foodie Itinerary
              </>
            )}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-400"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Right: Timeline + Budget ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mb-8">
            <h1 className={`font-display text-3xl font-bold ${t("text-white", "text-slate-800")}`}>
              Your Itinerary
            </h1>
            <p className={`mt-1 text-sm ${t("text-zinc-500", "text-slate-500")}`}>
              {dest.name} · {planParams.duration} Days · {planParams.pace}
            </p>
          </div>

          {itinerary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${t("bg-white/5", "bg-slate-100")}`}>
                <Sparkles size={28} className={t("text-zinc-600", "text-slate-400")} />
              </div>
              <p className={`mt-4 text-sm ${t("text-zinc-500", "text-slate-500")}`}>
                Configure your preferences and hit Generate
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Refine with AI Concierge */}
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sendItineraryToAgent(rawItinerary, budget, dest);
                  setActiveTab("agent");
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
              >
                <Bot size={18} />
                Refine with AI Concierge
                <Sparkles size={14} className="ml-1 opacity-70" />
              </motion.button>

              <AnimatePresence>
                {itinerary.map((day, di) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: di * 0.1 }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim font-display text-sm font-bold text-accent">
                        D{day.day}
                      </div>
                      <div>
                        <h2 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>
                          {day.title}
                        </h2>
                        <p className={`text-[11px] ${t("text-zinc-500", "text-slate-500")}`}>Day {day.day}</p>
                      </div>
                    </div>

                    <div className={`ml-5 border-l pl-8 ${t("border-white/10", "border-slate-200")}`}>
                      <div className="space-y-3">
                        {day.activities.map((act, ai) => {
                          const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.activity;
                          const Icon = cfg.icon;
                          return (
                            <motion.div
                              key={ai}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: di * 0.1 + ai * 0.05 }}
                              className={`glass group relative flex items-center gap-4 rounded-xl p-4 transition-colors ${t("hover:bg-white/[0.07]", "hover:bg-slate-50")}`}
                            >
                              <div className={`absolute -left-[2.55rem] h-3 w-3 rounded-full border-2 group-hover:border-accent group-hover:bg-accent ${t("border-zinc-800 bg-zinc-600", "border-slate-300 bg-slate-200")}`} />
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                                <Icon size={16} className={cfg.color} />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${t("text-zinc-200", "text-slate-700")}`}>
                                  {act.label}
                                </p>
                                {act.cost > 0 && (
                                  <p className={`text-[11px] ${t("text-zinc-500", "text-slate-500")}`}>
                                    ~${act.cost} per person
                                  </p>
                                )}
                              </div>
                              <div className={`flex items-center gap-1.5 ${t("text-zinc-600", "text-slate-400")}`}>
                                <Clock size={12} />
                                <span className="text-xs">{act.time}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Budget sidebar */}
        {budget && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`hidden w-72 shrink-0 border-l lg:block ${t("border-white/5", "border-slate-200")}`}
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>
                  Budget Breakdown
                </h3>
                <p className={`text-[11px] ${t("text-zinc-500", "text-slate-500")}`}>Estimated total cost</p>
              </div>

              <div className="glass mb-6 rounded-2xl p-5 text-center">
                <DollarSign className="mx-auto mb-1 text-accent" size={24} />
                <p className={`font-display text-3xl font-bold ${t("text-white", "text-slate-800")}`}>
                  ${budget.total?.toLocaleString() || 0}
                </p>
                <p className={`mt-1 text-xs ${t("text-zinc-500", "text-slate-500")}`}>Total estimated budget</p>
              </div>

              <div className="space-y-4">
                <BudgetBar label="Flights" amount={budget.flights || 0} total={budget.total || 1} color="bg-purple-500" />
                <BudgetBar label="Hotels" amount={budget.hotels || 0} total={budget.total || 1} color="bg-blue-500" />
                <BudgetBar label="Food & Dining" amount={budget.food || 0} total={budget.total || 1} color="bg-amber-500" />
                <BudgetBar label="Activities" amount={budget.activities || 0} total={budget.total || 1} color="bg-emerald-500" />
              </div>

              <div className={`mt-6 space-y-2 rounded-xl p-4 ${t("bg-white/5", "bg-slate-50")}`}>
                <div className="flex justify-between text-xs">
                  <span className={t("text-zinc-500", "text-slate-500")}>Per day average</span>
                  <span className={t("text-zinc-300", "text-slate-700")}>
                    ${Math.round((budget.total || 0) / planParams.duration).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={t("text-zinc-500", "text-slate-500")}>Food % of budget</span>
                  <span className={t("text-zinc-300", "text-slate-700")}>
                    {budget.total ? Math.round(((budget.food || 0) / budget.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={t("text-zinc-500", "text-slate-500")}>Trip duration</span>
                  <span className={t("text-zinc-300", "text-slate-700")}>{planParams.duration} days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={t("text-zinc-500", "text-slate-500")}>Budget strategy</span>
                  <span className={t("text-zinc-300", "text-slate-700")}>{planParams.budgetStrategy}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
