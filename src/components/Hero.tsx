"use client";

import { motion } from "framer-motion";
import { Play, HeartHandshake } from "lucide-react";
import { useAppData } from "@/lib/data-context";

const HERO_VIDEO_URL = "/videos/vid3.mp4";


export default function Hero() {
  const { data } = useAppData();
  const { heroHeadline, heroSubheadline } = data.siteContent;

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
          <img src="/fallback.jpg" alt="Background" />
        </video>
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4"
          >
            UK Registered Charity No. 1205248
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            {heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl"
          >
            {heroSubheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#videos"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Live
            </a>
            <a
              href="#donate"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
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
