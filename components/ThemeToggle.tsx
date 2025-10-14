"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const root = document.documentElement;
      const current = root.classList.contains("dark");
      setIsDark(current);
    } catch {}
  }, []);

  function toggle() {
    try {
      const root = document.documentElement;
      const next = !root.classList.contains("dark");
      root.classList.toggle("dark", next);
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      setIsDark(next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 px-3 py-1.5 text-sm shadow-sm hover:shadow transition-colors"
    >
      {isDark ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21.64 13a9 9 0 1 1-10.63-10 7 7 0 1 0 10.63 10z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm0-20a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm10 10a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm14.95 7.05a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 1 1 1.41-1.41l.7.7a1 1 0 0 1 0 1.41zM6.16 6.16a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7zM6.16 17.84a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0zm12.02-12.02a1 1 0 0 1-1.41-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7z" />
        </svg>
      )}
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

