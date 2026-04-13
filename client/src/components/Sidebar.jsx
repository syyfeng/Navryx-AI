import { Globe, Bot, CalendarRange, Settings } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";

const NAV_ITEMS = [
  { id: "explore", label: "Explore", icon: Globe },
  { id: "agent", label: "AI Agent", icon: Bot },
  { id: "itinerary", label: "Itinerary", icon: CalendarRange },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const { t } = useTheme();

  return (
    <aside className={`flex h-full w-20 flex-col items-center border-r py-6 lg:w-64 ${t("border-white/5 bg-zinc-950", "border-slate-200 bg-white")}`}>
      <div className="mb-10 flex items-center gap-3 px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 font-display text-lg font-bold text-white">
          G
        </div>
        <span className={`hidden font-display text-lg font-semibold tracking-tight lg:block ${t("text-white", "text-slate-800")}`}>
          GastroGlobe
        </span>
      </div>

      <nav className="flex w-full flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                ${active
                  ? "bg-accent-dim text-accent shadow-lg shadow-purple-500/10"
                  : `${t("text-zinc-500 hover:bg-white/5 hover:text-zinc-300", "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}`}
              `}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="hidden lg:block">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        <div className={`glass flex items-center gap-3 rounded-xl p-3`}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
          <div className="hidden lg:block">
            <p className={`text-xs font-medium ${t("text-zinc-300", "text-slate-700")}`}>Traveler</p>
            <p className={`text-[11px] ${t("text-zinc-600", "text-slate-400")}`}>Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
