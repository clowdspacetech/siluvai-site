"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/theme-styles";

export default function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
        isDark
          ? "border-white/10 bg-slate-900/60 text-amber-300 hover:bg-slate-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
