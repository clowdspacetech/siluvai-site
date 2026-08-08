"use client";

import Image from "next/image";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";
import { Globe, GraduationCap, HandHelping, Heart, type LucideIcon } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion/FadeInUp";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  "book-open": GraduationCap,
  "graduation-cap": GraduationCap,
  globe: Globe,
  users: HandHelping,
  "hand-helping": HandHelping,
};

const iconMotion: Record<string, { animate: TargetAndTransition; transition: Transition }> = {
  heart: {
    animate: { scale: [1, 1.08, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  "book-open": {
    animate: { y: [0, -4, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  "graduation-cap": {
    animate: { y: [0, -4, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  globe: {
    animate: { rotate: 360 },
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
  users: {
    animate: { rotate: [-3, 3, -3] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  "hand-helping": {
    animate: { rotate: [-3, 3, -3] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

function motionForIcon(iconKey: string) {
  if (iconMotion[iconKey]) return iconMotion[iconKey];
  if (iconKey.includes("heart")) return iconMotion.heart;
  if (iconKey.includes("book") || iconKey.includes("grad")) return iconMotion["book-open"];
  if (iconKey.includes("globe")) return iconMotion.globe;
  return iconMotion.users;
}

export default function About() {
  const { data } = useAppData();
  const { aboutIntro, pillars, trustees } = data.siteContent;
  const { theme, isDark } = useTheme();
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <p className={cn(token("eyebrow", theme), "font-semibold text-sm uppercase tracking-[0.22em] mb-4")}>
            About Us
          </p>
          <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6", token("heading", theme))}>
            Serving Communities Through Faith &amp; Media
          </h2>
          <p className={cn("text-base sm:text-lg leading-relaxed", token("body", theme))}>{aboutIntro}</p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-20 sm:mb-24">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon] ?? Heart;
            const motionProps = motionForIcon(pillar.icon);
            return (
              <StaggerItem key={pillar.id}>
                <motion.article
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className={cn(
                    "group glass-card h-full p-6 cursor-default",
                    token("cardHover", theme)
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl border flex items-center justify-center mb-5",
                      isDark
                        ? "bg-gradient-to-br from-amber-400/15 to-yellow-600/10 border-amber-400/20"
                        : "bg-gradient-to-br from-amber-100 to-yellow-50 border-amber-200"
                    )}
                  >
                    <motion.span
                      className="inline-flex"
                      animate={reduceMotion ? undefined : motionProps.animate}
                      transition={reduceMotion ? undefined : motionProps.transition}
                    >
                      <Icon className="w-6 h-6 text-amber-500" />
                    </motion.span>
                  </div>
                  <h3 className={cn("font-bold text-lg mb-2", token("heading", theme))}>{pillar.title}</h3>
                  <p className={cn("text-sm leading-relaxed", token("body", theme))}>{pillar.description}</p>
                </motion.article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeInUp>
          <div className="text-center mb-10 sm:mb-12">
            <p className={cn(token("eyebrow", theme), "font-semibold text-sm uppercase tracking-[0.22em] mb-3")}>
              Leadership
            </p>
            <h3 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", token("heading", theme))}>
              Our Leadership Team
            </h3>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {trustees.map((trustee, i) => (
            <FadeInUp key={trustee.id} delay={i * 0.12}>
              <article className="group glass-card glass-card-hover p-6 sm:p-8 text-center">
                <div
                  className={cn(
                    "relative w-28 h-28 mx-auto mb-6 overflow-hidden rounded-full ring-2 ring-amber-400/30 ring-offset-4",
                    isDark ? "ring-offset-slate-950" : "ring-offset-slate-50"
                  )}
                >
                  <Image
                    src={
                      trustee.image ??
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                    }
                    alt={trustee.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className={cn("font-bold text-xl", token("heading", theme))}>{trustee.name}</h4>
                <p className={cn(token("eyebrow", theme), "font-medium text-sm mt-1.5")}>{trustee.role}</p>
                <blockquote
                  className={cn(
                    "mt-5 text-sm leading-relaxed italic transition-colors duration-300",
                    token("body", theme),
                    isDark ? "group-hover:text-amber-200/90" : "group-hover:text-amber-800"
                  )}
                >
                  &ldquo;{trustee.quote}&rdquo;
                </blockquote>
              </article>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
