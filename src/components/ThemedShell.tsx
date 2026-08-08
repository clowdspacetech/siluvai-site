"use client";

import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";

export default function ThemedShell({
  hero,
  children,
}: {
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const { theme, isDark } = useTheme();

  return (
    <main className={cn(token("page", theme), "transition-colors duration-300")}>
      {hero}

      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div
            className={cn(
              "absolute -top-24 left-[-12%] h-[42rem] w-[42rem] rounded-full blur-[150px]",
              isDark ? "bg-amber-500/5" : "bg-amber-300/25"
            )}
          />
          <div
            className={cn(
              "absolute top-[18%] right-[-14%] h-[38rem] w-[38rem] rounded-full blur-[150px]",
              isDark ? "bg-blue-600/5" : "bg-sky-300/20"
            )}
          />
          <div
            className={cn(
              "absolute top-[48%] left-[6%] h-[36rem] w-[36rem] rounded-full blur-[150px]",
              isDark ? "bg-amber-500/5" : "bg-amber-200/30"
            )}
          />
          <div
            className={cn(
              "absolute bottom-[6%] right-[12%] h-[40rem] w-[40rem] rounded-full blur-[150px]",
              isDark ? "bg-blue-600/5" : "bg-indigo-200/25"
            )}
          />
        </div>
        {children}
      </div>
    </main>
  );
}
