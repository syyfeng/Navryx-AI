import { useState } from "react";
import { motion } from "framer-motion";
import {
  Key, Eye, EyeOff, Moon, Sun, Server, Cloud,
  Check, AlertCircle, RotateCcw,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";

function Toggle({ enabled, onToggle, labelOn, labelOff, iconOn: IconOn, iconOff: IconOff }) {
  const { t } = useTheme();
  return (
    <button
      onClick={onToggle}
      className={`relative flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-200 ${
        enabled
          ? "bg-accent-dim text-accent"
          : `${t("bg-white/5 text-zinc-400 hover:bg-white/8", "bg-slate-100 text-slate-500 hover:bg-slate-200")}`
      }`}
    >
      {enabled ? <IconOn size={16} /> : <IconOff size={16} />}
      {enabled ? labelOn : labelOff}
    </button>
  );
}

function Section({ title, description, children, delay = 0 }) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-4">
        <h3 className={`text-sm font-semibold ${t("text-white", "text-slate-800")}`}>{title}</h3>
        <p className={`mt-0.5 text-xs ${t("text-zinc-500", "text-slate-500")}`}>{description}</p>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, clearChat } = useAppStore();
  const { t } = useTheme();
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const handleKeyChange = (e) => {
    updateSettings({ openaiApiKey: e.target.value });
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.status === "ok") {
        setTestStatus("success");
        setTimeout(() => setTestStatus(null), 3000);
      } else {
        setTestStatus("error");
      }
    } catch {
      setTestStatus("error");
      setTimeout(() => setTestStatus(null), 3000);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-8 py-8">
        <div className="mb-8">
          <h1 className={`font-display text-3xl font-bold ${t("text-white", "text-slate-800")}`}>Settings</h1>
          <p className={`mt-1 text-sm ${t("text-zinc-500", "text-slate-500")}`}>
            Personalize your GastroGlobe experience
          </p>
        </div>

        <div className="space-y-4">
          {/* AI Provider */}
          <Section
            title="AI Provider"
            description="Configure which AI model powers your concierge and itinerary generation"
            delay={0}
          >
            <div className="space-y-4">
              <div>
                <label className={`mb-1.5 flex items-center gap-2 text-xs font-medium ${t("text-zinc-400", "text-slate-500")}`}>
                  <Key size={12} />
                  OpenAI API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? "text" : "password"}
                      value={settings.openaiApiKey}
                      onChange={handleKeyChange}
                      placeholder="sk-..."
                      className={`w-full rounded-xl px-4 py-2.5 pr-10 text-sm outline-none ring-1 transition-all focus:ring-accent/50 ${t(
                        "bg-white/5 text-white placeholder-zinc-600 ring-white/10",
                        "bg-slate-100 text-slate-800 placeholder-slate-400 ring-slate-200"
                      )}`}
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${t("text-zinc-500 hover:text-zinc-300", "text-slate-400 hover:text-slate-600")}`}
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <p className={`mt-1.5 text-[11px] ${t("text-zinc-600", "text-slate-400")}`}>
                  Leave empty to use local Ollama instance
                </p>
              </div>

              {/* Force Ollama toggle */}
              <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${t("bg-white/[0.03]", "bg-slate-50")}`}>
                <div className="flex items-center gap-3">
                  <Server size={16} className={t("text-zinc-400", "text-slate-500")} />
                  <div>
                    <p className={`text-sm font-medium ${t("text-zinc-200", "text-slate-700")}`}>
                      Force Local Ollama
                    </p>
                    <p className={`text-[11px] ${t("text-zinc-500", "text-slate-400")}`}>
                      Use llama3.2 even when an API key is set
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ forceOllama: !settings.forceOllama })}
                  className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                    settings.forceOllama ? "bg-accent" : t("bg-zinc-700", "bg-slate-300")
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      settings.forceOllama ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Provider indicator */}
              <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${t("bg-white/[0.03]", "bg-slate-50")}`}>
                {settings.forceOllama || !settings.openaiApiKey ? (
                  <>
                    <Server size={14} className="text-amber-500" />
                    <span className="text-xs font-medium text-amber-500">
                      Using Ollama (llama3.2) — make sure it&apos;s running locally
                    </span>
                  </>
                ) : (
                  <>
                    <Cloud size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">
                      Using OpenAI (gpt-4o-mini)
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleTestConnection}
                disabled={testStatus === "testing"}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all disabled:opacity-50 ${t(
                  "bg-white/5 text-zinc-300 hover:bg-white/10",
                  "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}`}
              >
                {testStatus === "testing" ? (
                  <div className={`h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent ${t("border-zinc-500", "border-slate-400")}`} />
                ) : testStatus === "success" ? (
                  <Check size={14} className="text-emerald-400" />
                ) : testStatus === "error" ? (
                  <AlertCircle size={14} className="text-red-400" />
                ) : (
                  <Server size={14} />
                )}
                {testStatus === "success"
                  ? "Connection OK"
                  : testStatus === "error"
                    ? "Connection failed"
                    : "Test Connection"}
              </button>
            </div>
          </Section>

          {/* Appearance */}
          <Section
            title="Appearance"
            description="Customize the look and feel"
            delay={0.06}
          >
            <div className="flex gap-2">
              <Toggle
                enabled={settings.theme === "dark"}
                onToggle={() => updateSettings({ theme: "dark" })}
                labelOn="Dark Mode"
                labelOff="Dark Mode"
                iconOn={Moon}
                iconOff={Moon}
              />
              <Toggle
                enabled={settings.theme === "light"}
                onToggle={() => updateSettings({ theme: "light" })}
                labelOn="Light Mode"
                labelOff="Light Mode"
                iconOn={Sun}
                iconOff={Sun}
              />
            </div>
            <p className={`mt-2 text-[11px] ${t("text-zinc-600", "text-slate-400")}`}>
              {settings.theme === "dark"
                ? "Neon glassmorphism — the classic GastroGlobe look"
                : "Luxury travel magazine — cream backgrounds with soft shadows"}
            </p>
          </Section>

          {/* Data & Privacy */}
          <Section
            title="Data & Privacy"
            description="Manage your conversation data"
            delay={0.12}
          >
            <div className="flex gap-2">
              <button
                onClick={() => {
                  clearChat();
                  handleSave();
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${t(
                  "bg-white/5 text-zinc-300 hover:bg-white/10",
                  "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}`}
              >
                <RotateCcw size={14} />
                Clear Chat History
              </button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-400"
                >
                  <Check size={14} />
                  Done
                </motion.span>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
