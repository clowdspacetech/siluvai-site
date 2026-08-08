"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import {
  useAppData,
  categoryColors,
  extractYouTubeId,
  youtubeEmbedUrl,
  youtubeThumbnail,
} from "@/lib/data-context";
import { formatDate } from "@/lib/data-store";
import type { Video } from "@/lib/types";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";
import { FadeInUp } from "@/components/motion/FadeInUp";
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
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

function BroadcastCard({
  video,
  onSelect,
  reduceMotion,
  isDark,
}: {
  video: Video;
  onSelect: (video: Video) => void;
  reduceMotion: boolean | null;
  isDark: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(video)}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="video-card group relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left glass-card hover:border-amber-500/35 hover:shadow-[0_0_48px_rgba(245,158,11,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      <div className="relative aspect-video overflow-hidden">
        <VideoThumb url={video.url} title={video.title} />
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            isDark ? "bg-slate-950/0 group-hover:bg-slate-950/40" : "bg-slate-900/0 group-hover:bg-slate-900/25"
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <Play className="w-6 h-6 ml-0.5" fill="currentColor" strokeWidth={0} />
          </span>
        </div>
        <span
          className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors(video.category, isDark)}`}
        >
          {video.category}
        </span>
      </div>
      <div className="p-5">
        <h3
          className={cn(
            "font-bold text-lg transition-colors",
            isDark ? "text-white group-hover:text-amber-300" : "text-slate-900 group-hover:text-amber-700"
          )}
        >
          {video.title}
        </h3>
        <p className={cn("text-sm mt-1.5", isDark ? "text-slate-400" : "text-slate-600")}>
          {formatDate(video.publishDate)}
        </p>
      </div>
    </motion.button>
  );
}

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setCount(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function VideoHub() {
  const { data } = useAppData();
  const { theme, isDark } = useTheme();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [page, setPage] = useState(0);
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const visible = useVisibleCount();
  const broadcasts = data.videos;
  const maxPage = Math.max(0, broadcasts.length - visible);

  const scrollToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, maxPage));
      const el = scrollerRef.current;
      const card = el?.querySelector<HTMLElement>("[data-broadcast-card]");
      if (!el || !card) {
        setPage(clamped);
        return;
      }
      const styles = window.getComputedStyle(el);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "24") || 24;
      el.scrollTo({
        left: clamped * (card.offsetWidth + gap),
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setPage(clamped);
    },
    [maxPage, reduceMotion]
  );

  useEffect(() => {
    if (page > maxPage) scrollToPage(maxPage);
  }, [maxPage, page, scrollToPage]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>("[data-broadcast-card]");
    if (!el || !card) return;
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "24") || 24;
    const next = Math.round(el.scrollLeft / (card.offsetWidth + gap));
    setPage(Math.max(0, Math.min(next, maxPage)));
  };

  return (
    <section id="videos" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className={cn(token("eyebrow", theme), "font-semibold text-sm uppercase tracking-[0.22em] mb-4")}>
            Media Hub
          </p>
          <h2 className="inline-flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className={token("heading", theme)}>Watch Our Latest Broadcasts</span>
            <motion.span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 px-2.5 py-1 rounded-full align-middle"
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
          <p className={cn("text-sm sm:text-base", token("body", theme))}>
            Explore sermons, leadership sessions, and community workshops from Siluvai Media.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.08}>
          {broadcasts.length === 0 ? (
            <p className={cn("text-center", token("body", theme))}>Broadcasts will appear here soon.</p>
          ) : (
            <div>
              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-2"
              >
                {broadcasts.map((video) => (
                  <div
                    key={video.id}
                    data-broadcast-card
                    className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
                  >
                    <BroadcastCard
                      video={video}
                      onSelect={setActiveVideo}
                      reduceMotion={reduceMotion}
                      isDark={isDark}
                    />
                  </div>
                ))}
              </div>

              {maxPage > 0 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => scrollToPage(page - 1)}
                    disabled={page === 0}
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:opacity-40",
                      isDark
                        ? "border-white/10 text-slate-200 hover:bg-white/5"
                        : "border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                    aria-label="Previous broadcasts"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2" role="tablist" aria-label="Broadcast pages">
                    {Array.from({ length: maxPage + 1 }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        role="tab"
                        aria-selected={page === index}
                        aria-label={`Show broadcast set ${index + 1}`}
                        onClick={() => scrollToPage(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          page === index
                            ? "w-8 bg-gradient-to-r from-amber-400 to-yellow-600"
                            : isDark
                              ? "w-2.5 bg-white/20 hover:bg-white/40"
                              : "w-2.5 bg-slate-300 hover:bg-slate-400"
                        )}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToPage(page + 1)}
                    disabled={page === maxPage}
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:opacity-40",
                      isDark
                        ? "border-white/10 text-slate-200 hover:bg-white/5"
                        : "border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                    aria-label="Next broadcasts"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </FadeInUp>
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
