"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type SkybazzTheme = "gold";

interface ThemeContextType {
  theme: SkybazzTheme;
  setTheme: (theme: SkybazzTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "gold",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "gold");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "gold", setTheme: () => {}, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
