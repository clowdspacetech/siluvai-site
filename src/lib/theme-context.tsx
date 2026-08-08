"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "siluvai-theme";

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    const fromDom = document.documentElement.dataset.theme;
    const stored = localStorage.getItem(STORAGE_KEY);
    const next =
      fromDom === "light" || fromDom === "dark"
        ? fromDom
        : stored === "light" || stored === "dark"
          ? stored
          : defaultTheme;
    setThemeState(next);
    applyTheme(next);
  }, [defaultTheme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / private mode */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
