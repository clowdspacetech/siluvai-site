import type { ThemeMode } from "./theme-context";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const themeTokens = {
  page: {
    dark: "bg-[#090D16] text-slate-300",
    light: "bg-slate-50 text-slate-600",
  },
  heading: {
    dark: "text-white",
    light: "text-slate-900",
  },
  body: {
    dark: "text-slate-400",
    light: "text-slate-600",
  },
  muted: {
    dark: "text-slate-500",
    light: "text-slate-500",
  },
  eyebrow: "bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent",
  cardHover: {
    dark: "hover:bg-slate-800/60 hover:border-amber-500/35 hover:shadow-[inset_0_0_36px_rgba(245,158,11,0.1),0_0_48px_rgba(245,158,11,0.12)]",
    light:
      "hover:bg-white hover:border-amber-400/50 hover:shadow-[inset_0_0_36px_rgba(245,158,11,0.07),0_12px_32px_rgba(15,23,42,0.08)]",
  },
  hairline: {
    dark: "border-white/10",
    light: "border-slate-200",
  },
  surface: {
    dark: "bg-slate-900/60 border-white/10",
    light: "bg-white border-slate-200",
  },
  input: {
    dark: "bg-slate-900/60 border-white/10 text-white",
    light: "bg-white border-slate-200 text-slate-900",
  },
  option: {
    dark: "bg-slate-900 text-white",
    light: "bg-white text-slate-900",
  },
  nav: {
    dark: "text-slate-300 hover:text-amber-400",
    light: "text-slate-600 hover:text-amber-700",
  },
  header: {
    dark: "bg-slate-950/70 border-white/10",
    light: "bg-white/80 border-slate-200",
  },
} as const;

export function token(key: keyof typeof themeTokens, theme: ThemeMode): string {
  const value = themeTokens[key];
  if (typeof value === "string") return value;
  return value[theme];
}
