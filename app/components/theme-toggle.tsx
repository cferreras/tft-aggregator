"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "tft-theme";

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("theme-dark", theme === "dark");
  root.style.colorScheme = theme;
}

function resolveInitialTheme(): Theme {
  const fromStorage = localStorage.getItem(THEME_STORAGE_KEY);
  if (fromStorage === "light" || fromStorage === "dark") {
    return fromStorage;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return resolveInitialTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-edge bg-surface px-3 text-xs font-mono text-muted transition hover:text-ink"
      aria-label="Cambiar tema"
      aria-pressed={theme === "dark"}
    >
      <span className="relative inline-flex h-4 w-8 items-center rounded-full border border-edge bg-canvas p-[2px]">
        <span
          className={`h-2.5 w-2.5 rounded-full bg-ink transition-transform ${
            theme === "dark" ? "translate-x-3.5" : "translate-x-0"
          }`}
        />
      </span>
      <span>{theme === "dark" ? "Oscuro" : "Claro"}</span>
    </button>
  );
}
