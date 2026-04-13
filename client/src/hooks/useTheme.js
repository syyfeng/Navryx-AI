import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export function useTheme() {
  const theme = useAppStore((s) => s.settings.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className =
      theme === "light"
        ? "bg-slate-50 text-slate-800 antialiased"
        : "bg-zinc-950 text-white antialiased";
  }, [theme]);

  const isDark = theme === "dark";
  const t = (dark, light) => (isDark ? dark : light);

  return { theme, isDark, isLight: !isDark, t };
}
