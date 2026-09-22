"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type SkybazzTheme = "cobalt" | "gold";

interface ThemeContextType {
  theme: SkybazzTheme;
  setTheme: (theme: SkybazzTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "skybazz_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SkybazzTheme>("cobalt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as SkybazzTheme | null;
      if (stored === "cobalt" || stored === "gold") {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", "cobalt");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "cobalt");
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: SkybazzTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (err) {
      console.warn("Could not save theme preference:", err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "cobalt" ? "gold" : "cobalt");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    return {
      theme: "cobalt",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
