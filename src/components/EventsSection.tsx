"use client";

import { Calendar, Clock } from "lucide-react";
import type { Event } from "@/lib/types";
import { formatDate } from "@/lib/data-store";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion/FadeInUp";

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section id="events" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Upcoming Events
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Join Us in Community
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Workshops, outreach days, and fellowship gatherings open to everyone.
          </p>
        </FadeInUp>

        {upcoming.length === 0 ? (
          <p className="text-center text-slate-500">No upcoming events at the moment. Check back soon.</p>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcoming.map((event) => (
              <StaggerItem key={event.id}>
                <article className="group rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                  <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                    {event.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.imageUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-slate-100">
                        <Calendar className="w-12 h-12 text-amber-400" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" aria-hidden />
                        {formatDate(event.date)}
                      </span>
                      {event.time && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600" aria-hidden />
                          {event.time}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
