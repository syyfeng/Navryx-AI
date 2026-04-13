import Globe3D from "../components/Globe3D";
import ControlPanel from "../components/ControlPanel";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";

export default function ExplorePage() {
  const dest = useAppStore((s) => s.activeDestination);
  const { t } = useTheme();

  return (
    <div className="relative h-full w-full">
      <Globe3D />
      <ControlPanel />

      <div className="pointer-events-none absolute bottom-8 left-8 z-50">
        <h1 className={`font-display text-4xl font-bold tracking-tight ${t("text-white/90", "text-slate-800/90")}`}>
          {dest ? dest.name : "Explore the World"}
        </h1>
        <p className={`mt-2 max-w-md text-sm leading-relaxed ${t("text-zinc-500", "text-slate-500")}`}>
          {dest
            ? dest.description
            : "Select cuisine, taste, and vibe to discover your next culinary destination."}
        </p>
      </div>

      <div className={`pointer-events-none absolute bottom-0 left-0 right-0 z-40 h-32 bg-gradient-to-t ${t("from-zinc-950", "from-slate-50")} to-transparent`} />
    </div>
  );
}
