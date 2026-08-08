"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Play, HeartHandshake } from "lucide-react";
import { useAppData } from "@/lib/data-context";

const HERO_VIDEO_URL = "/videos/vid3.mp4";

export default function Hero() {
  const { data } = useAppData();
  const { heroHeadline, heroSubheadline } = data.siteContent;
  const reduceMotion = useReducedMotion();

  const fadeLift = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent" />

        {/* Soft mesh glow — ethereal light behind content */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="mesh-glow absolute -top-1/4 left-1/4 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35)_0%,transparent_70%)] blur-3xl" />
          <div className="mesh-glow-alt absolute bottom-0 right-0 h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle,rgba(248,250,252,0.2)_0%,transparent_65%)] blur-3xl" />
          <div className="mesh-glow absolute top-1/3 -left-10 h-[40vmin] w-[40vmin] rounded-full bg-[radial-gradient(circle,rgba(185,28,28,0.18)_0%,transparent_70%)] blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-3xl">
          <motion.p
            {...fadeLift(0.1)}
            className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4"
          >
            UK Registered Charity No. 1205248
          </motion.p>

          <motion.h1
            {...fadeLift(0.25)}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            {heroHeadline}
          </motion.h1>

          <motion.p
            {...fadeLift(0.4)}
            className="mt-6 text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl"
          >
            {heroSubheadline}
          </motion.p>

          <motion.div
            {...fadeLift(0.55)}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#videos"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg hover:shadow-xl hover:scale-[1.03] focus-visible:scale-[1.03] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
            >
              <Play className="w-5 h-5 relative z-10" fill="currentColor" />
              <span className="relative z-10">Watch Live</span>
            </a>
            <a
              href="#donate"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white border-2 border-white/30 hover:bg-white/10 hover:scale-[1.03] focus-visible:scale-[1.03] backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <HeartHandshake className="w-5 h-5" />
              Support Our Mission
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
