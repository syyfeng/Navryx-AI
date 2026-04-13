import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, MapPin, Utensils, Palette, Sparkles,
  Layers, Eye, EyeOff, CalendarRange, Trophy, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";
import { CUISINES, TASTE_PROFILES, VIBES } from "../data/cities";

function TagSelector({ label, icon: Icon, options, selected, onSelect, maxVisible = 8 }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTheme();
  const shown = expanded ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  return (
    <div>
      <label className={`mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${t("text-zinc-500", "text-slate-500")}`}>
        <Icon size={14} />
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt === selected ? null : opt)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              opt === selected
                ? "bg-accent text-white shadow-lg shadow-purple-500/20"
                : `bg-tag ${t("text-zinc-400 hover:bg-tag-hover hover:text-zinc-200", "text-slate-600 hover:bg-tag-hover hover:text-slate-800")}`
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${t("text-zinc-600 hover:text-zinc-400", "text-slate-500 hover:text-slate-700")}`}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Show less" : `+${options.length - maxVisible} more`}
        </button>
      )}
    </div>
  );
}

function CityResult({ city, rank, isActive, onSelect, onPlan }) {
  const { t } = useTheme();
  const medals = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-amber-600 to-amber-700"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-xl p-3 transition-all duration-200 ${
        isActive
          ? `ring-1 ring-accent/40 ${t("bg-purple-500/10", "bg-purple-50")}`
          : `${t("bg-white/[0.03] hover:bg-white/[0.06]", "bg-slate-100 hover:bg-slate-200/80")}`
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${medals[rank] || medals[2]} text-[11px] font-bold text-white`}>
          {rank + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>
              {city.cityName}
            </h4>
            <span className="ml-2 shrink-0 rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-bold text-accent">
              {city.matchPct}% match
            </span>
          </div>
          <p className={`text-[11px] ${t("text-zinc-500", "text-slate-500")}`}>{city.country}</p>
          <p className={`mt-1 text-[11px] leading-relaxed ${t("text-zinc-400", "text-slate-600")}`}>
            {city.description}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {city.matchReasons.map((reason) => (
              <span key={reason} className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${t("bg-white/5 text-zinc-500", "bg-slate-200 text-slate-600")}`}>
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isActive && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={(e) => { e.stopPropagation(); onPlan(); }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
        >
          <CalendarRange size={15} />
          Plan Itinerary
        </motion.button>
      )}
    </motion.div>
  );
}

export default function ControlPanel() {
  const [open, setOpen] = useState(true);
  const { t, isDark } = useTheme();
  const {
    selectedCuisine, selectedTaste, selectedVibe,
    setFilters, clearFilters, activeDestination,
    discoveredCities, selectDiscoveredCity,
    showOverlay, toggleOverlay,
    setPlanDestination, setActiveTab,
  } = useAppStore();
  const [cuisine, setCuisine] = useState(selectedCuisine);
  const [taste, setTaste] = useState(selectedTaste);
  const [vibe, setVibe] = useState(selectedVibe);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (discoveredCities.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  }, [discoveredCities]);

  const handleDiscover = () => {
    if (cuisine || taste || vibe) setFilters(cuisine, taste, vibe);
  };

  const handleClear = () => {
    setCuisine(null);
    setTaste(null);
    setVibe(null);
    clearFilters();
  };

  const handlePlanItinerary = () => {
    if (activeDestination) {
      setPlanDestination(activeDestination);
      setActiveTab("itinerary");
    }
  };

  return (
    <>
      {!open && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setOpen(true)}
          className={`glass glow-marker absolute right-6 top-6 z-50 rounded-2xl p-3 text-accent transition-colors ${t("hover:bg-white/10", "hover:bg-black/5")}`}
        >
          <SlidersHorizontal size={20} />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass absolute right-6 top-6 z-50 flex max-h-[calc(100vh-4rem)] w-80 flex-col rounded-2xl"
          >
            <div className="shrink-0 p-5 pb-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`font-display text-lg font-semibold ${t("text-white", "text-slate-800")}`}>
                  Discover
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className={`rounded-lg p-1.5 transition-colors ${t("text-zinc-500 hover:bg-white/10 hover:text-white", "text-slate-400 hover:bg-slate-200 hover:text-slate-700")}`}
                >
                  <X size={16} />
                </button>
              </div>

              <button
                onClick={toggleOverlay}
                className={`mb-5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                  showOverlay
                    ? "bg-accent-dim text-accent"
                    : `${t("bg-white/5 text-zinc-500 hover:bg-white/8 hover:text-zinc-300", "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700")}`
                }`}
              >
                <Layers size={14} />
                <span className="flex-1 text-left">Borders & Labels</span>
                {showOverlay ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <div className="space-y-5">
                <TagSelector
                  label="Cuisine Type"
                  icon={Utensils}
                  options={CUISINES}
                  selected={cuisine}
                  onSelect={setCuisine}
                  maxVisible={8}
                />
                <TagSelector
                  label="Taste Profile"
                  icon={Palette}
                  options={TASTE_PROFILES}
                  selected={taste}
                  onSelect={setTaste}
                  maxVisible={6}
                />
                <TagSelector
                  label="Vibe"
                  icon={Sparkles}
                  options={VIBES}
                  selected={vibe}
                  onSelect={setVibe}
                  maxVisible={6}
                />
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={handleDiscover}
                  disabled={!cuisine && !taste && !vibe}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MapPin size={16} />
                  Discover
                </button>
                {(cuisine || taste || vibe) && (
                  <button
                    onClick={handleClear}
                    className={`rounded-xl px-3 py-2.5 text-sm transition-colors ${t("bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white", "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700")}`}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* ── Scored results ── */}
              <AnimatePresence>
                {discoveredCities.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div ref={resultsRef} className="mt-5">
                      <div className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${t("text-zinc-500", "text-slate-500")}`}>
                        <Trophy size={12} className="text-amber-400" />
                        Top Matches
                      </div>
                      <div className="space-y-2">
                        {discoveredCities.map((city, i) => (
                          <CityResult
                            key={city.cityName}
                            city={city}
                            rank={i}
                            isActive={activeDestination?.name === `${city.cityName}, ${city.country}`}
                            onSelect={() => selectDiscoveredCity(city)}
                            onPlan={handlePlanItinerary}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
