"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import {
  useAppData,
  categoryColors,
  extractYouTubeId,
  youtubeEmbedUrl,
  youtubeThumbnail,
} from "@/lib/data-context";
import { formatDate } from "@/lib/data-store";
import type { Video } from "@/lib/types";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion/FadeInUp";
import VideoModal from "./VideoModal";

function VideoThumb({ url, title }: { url: string; title: string }) {
  const id = extractYouTubeId(url);
  const [src, setSrc] = useState(youtubeThumbnail(url));
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div className="absolute inset-0 bg-slate-900" aria-hidden />
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`object-cover transition-[transform,opacity] duration-500 group-hover:scale-110 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (
            id &&
            src.includes("maxresdefault") &&
            img.naturalWidth > 0 &&
            img.naturalWidth <= 120
          ) {
            setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
            return;
          }
          setLoaded(true);
        }}
        onError={() => {
          if (id && src.includes("maxresdefault")) {
            setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
            return;
          }
          setLoaded(true);
        }}
      />
    </>
  );
}

export default function VideoHub() {
  const { data } = useAppData();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="videos" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Media Hub
          </p>
          <h2 className="inline-flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            <span>Watch Our Latest Broadcasts</span>
            <motion.span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full align-middle"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 0 rgba(16,185,129,0.35)",
                        "0 0 0 8px rgba(16,185,129,0)",
                        "0 0 0 0 rgba(16,185,129,0)",
                      ],
                    }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </span>
              Live
            </motion.span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Explore sermons, leadership sessions, and community workshops from Siluvai Media.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.videos.map((video) => (
            <StaggerItem key={video.id}>
              <motion.button
                type="button"
                onClick={() => setActiveVideo(video)}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="video-card group relative w-full text-left bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-500/20 transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <VideoThumb url={video.url} title={video.title} />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-6 h-6 ml-0.5" fill="currentColor" strokeWidth={0} />
                    </span>
                  </div>
                  <span
                    className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors(video.category)}`}
                  >
                    {video.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{formatDate(video.publishDate)}</p>
                </div>
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            key={activeVideo.id}
            embedUrl={youtubeEmbedUrl(activeVideo.url)}
            title={activeVideo.title}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
