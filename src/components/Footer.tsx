"use client";

import { Heart, Mail, MapPin } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";

export default function Footer() {
  const year = new Date().getFullYear();
  const { theme, isDark } = useTheme();

  return (
    <footer
      className={cn(
        "border-t transition-colors duration-300",
        isDark ? "bg-[#090D16] text-slate-300 border-white/10" : "bg-slate-50 text-slate-600 border-slate-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-slate-950" fill="currentColor" />
              </div>
              <span className={cn("font-bold text-lg", token("heading", theme))}>Siluvai Media</span>
            </div>
            <p className={cn("text-sm leading-relaxed", token("body", theme))}>
              Propagating messages of love, salvation, and redemption through Christian
              broadcasting and community outreach.
            </p>
          </div>

          <div>
            <h3 className={cn("font-semibold mb-4", token("heading", theme))}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-amber-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-amber-500 transition-colors">
                  Videos
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-amber-500 transition-colors">
                  Register
                </a>
              </li>
              <li>
                <a href="#donate" className="hover:text-amber-500 transition-colors">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("font-semibold mb-4", token("heading", theme))}>Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>info@siluvaimedia.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm",
            token("hairline", theme),
            token("muted", theme)
          )}
        >
          <p>&copy; {year} Siluvai Media. All rights reserved.</p>
          <p className={cn("font-medium", token("body", theme))}>UK Registered Charity No. 1205248</p>
        </div>
      </div>
    </footer>
  );
}
