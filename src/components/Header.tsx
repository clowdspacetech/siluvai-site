"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";

const navLinks = [
  { href: "#about", label: "About Us" },
  { href: "#videos", label: "Videos" },
  { href: "#events", label: "Events" },
  { href: "#register", label: "Register" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b", token("header", theme))}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-shadow">
              <Heart className="w-5 h-5 text-slate-950" fill="currentColor" />
            </div>
            <span className={cn("font-bold text-lg tracking-tight", token("heading", theme))}>
              Siluvai <span className={token("eyebrow", theme)}>Media</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn("text-sm font-medium transition-colors", token("nav", theme))}
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
            <a
              href="#donate"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 shadow-md shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
            >
              Donate
            </a>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={cn(
            "md:hidden border-t backdrop-blur-md",
            isDark ? "border-white/10 bg-slate-950/95" : "border-slate-200 bg-white/95"
          )}
        >
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl font-medium transition-colors",
                  isDark
                    ? "text-slate-300 hover:bg-white/5 hover:text-amber-400"
                    : "text-slate-700 hover:bg-slate-50 hover:text-amber-700"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#donate"
              className="mt-2 mx-4 py-3 rounded-full text-center font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-600 shadow-md"
              onClick={() => setMobileOpen(false)}
            >
              Donate
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
