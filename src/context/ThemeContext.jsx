import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "wasooli-aab-theme";
function readMode() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return ["light", "dark", "system"].includes(stored) ? stored : "light";
  } catch { return "light"; }
}
function prefersDark() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readMode);
  const [systemDark, setSystemDark] = useState(prefersDark);
  const theme = mode === "system" ? (systemDark ? "dark" : "light") : mode;
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return undefined;
    const update = (event) => setSystemDark(event.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    try { window.localStorage.setItem(STORAGE_KEY, mode); } catch { /* Storage may be unavailable in private contexts. */ }
  }, [mode, theme]);
  const toggleTheme = () => setMode((current) => {
    const currentTheme = current === "system" ? (prefersDark() ? "dark" : "light") : current;
    return currentTheme === "dark" ? "light" : "dark";
  });
  return <ThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
