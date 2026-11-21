import { create } from "zustand";

export type ThemeMode = "light" | "dark";
const KEY = "sensorik:theme";

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Single source of truth: toggles the `dark` class + color-scheme on <html>. */
export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
}

function readStored(): ThemeMode {
  let v: string | null = null;
  try {
    v = localStorage.getItem(KEY);
  } catch {
    /* ignore */
  }
  if (v === "light" || v === "dark") return v;
  return systemPrefersDark() ? "dark" : "light"; // sensible first-run default
}

interface ThemeState {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

export const useTheme = create<ThemeState>((set, get) => {
  const initial = readStored();
  return {
    mode: initial,
    setMode: (m) => {
      try {
        localStorage.setItem(KEY, m);
      } catch {
        /* ignore */
      }
      applyTheme(m);
      set({ mode: m });
    },
    toggle: () => get().setMode(get().mode === "dark" ? "light" : "dark"),
  };
});
