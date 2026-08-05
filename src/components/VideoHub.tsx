"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useAppData, categoryColors, youtubeEmbedUrl } from "@/lib/data-context";
import { formatDate } from "@/lib/data-store";
import type { Video } from "@/lib/types";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { HoverCard } from "@/components/motion/HoverCard";
import VideoModal from "./VideoModal";

export default function VideoHub() {
  const { data } = useAppData();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  return (
    <section id="videos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Media Hub
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Watch Our Latest Broadcasts
          </h2>
          <p className="text-slate-600">
            Explore sermons, leadership sessions, and community workshops from Siluvai Media.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.videos.map((video, i) => (
            <FadeInUp key={video.id} delay={i * 0.1}>
              <HoverCard
                as="button"
                type="button"
                onClick={() => setActiveVideo(video)}
                className="group w-full text-left bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={
                      video.thumbnail ??
                      "https://images.unsplash.com/photo-1511637765836-557673e227f0?w=640&h=360&fit=crop"
                    }
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors(video.category)}`}
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
              </HoverCard>
            </FadeInUp>
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoModal
          embedUrl={youtubeEmbedUrl(activeVideo.url)}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}
