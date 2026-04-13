import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "./store/useAppStore";
import { useTheme } from "./hooks/useTheme";
import Sidebar from "./components/Sidebar";
import ExplorePage from "./pages/ExplorePage";
import AgentPage from "./pages/AgentPage";
import ItineraryPage from "./pages/ItineraryPage";
import SettingsPage from "./pages/SettingsPage";

const pages = {
  explore: ExplorePage,
  agent: AgentPage,
  itinerary: ItineraryPage,
  settings: SettingsPage,
};

export default function App() {
  const activeTab = useAppStore((s) => s.activeTab);
  const { t } = useTheme();
  const ActivePage = pages[activeTab];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${t("bg-zinc-950", "bg-slate-50")}`}>
      <Sidebar />
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <ActivePage />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
