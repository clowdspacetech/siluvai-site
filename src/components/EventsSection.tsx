"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Calendar, CalendarPlus, Clock, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import { formatDate } from "@/lib/data-store";
import { useRegistrationIntent } from "@/lib/registration-intent";
import { useTheme } from "@/lib/theme-context";
import { cn, token } from "@/lib/theme-styles";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion/FadeInUp";

interface EventsSectionProps {
  events: Event[];
}

interface DisplayEvent extends Event {
  tag?: string;
  venue?: string;
  address?: string;
  details?: string;
  mapQuery?: string;
}

const PLACEHOLDER_EVENTS: DisplayEvent[] = [
  {
    id: "placeholder-masterclass",
    title: "Media Production Masterclass",
    date: "2026-10-18",
    time: "10:00 – 16:00",
    tag: "Workshop",
    description: "Hands-on Christian digital broadcasting and studio editing techniques.",
    venue: "Siluvai Media Studio",
    address: "London, United Kingdom",
    details:
      "A full-day studio workshop covering camera language, live switching, and faith-centred storytelling. Bring a laptop if you would like to follow the edit lab. Refreshments included.",
    mapQuery: "London, United Kingdom",
  },
  {
    id: "placeholder-gala",
    title: "Annual Faith & Charity Gala",
    date: "2026-12-05",
    time: "18:30 onwards",
    tag: "Fellowship",
    description: "An evening of celebration, live broadcasting highlights, and community updates.",
    venue: "The Grand Hall",
    address: "Birmingham, United Kingdom",
    details:
      "Join trustees, volunteers, and friends of Siluvai Media for dinner, worship highlights, and a look at the year ahead. Formal attire welcome. Gift Aid envelopes available at the door.",
    mapQuery: "Birmingham, United Kingdom",
  },
];

function extrasFor(event: DisplayEvent) {
  return {
    venue: event.venue ?? "Siluvai Media · United Kingdom",
    address: event.address ?? "United Kingdom",
    details:
      event.details ??
      "Join us for worship, fellowship, and community updates. All are welcome — please register so our team can prepare for your arrival.",
    mapQuery: event.mapQuery ?? event.address ?? "United Kingdom",
  };
}

export default function EventsSection({ events }: EventsSectionProps) {
  const upcoming: DisplayEvent[] =
    events.length > 0
      ? [...events].sort((a, b) => a.date.localeCompare(b.date))
      : PLACEHOLDER_EVENTS;

  const { theme, isDark } = useTheme();
  const { prefillEvent } = useRegistrationIntent();
  const reduceMotion = useReducedMotion();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleJoin = (event: DisplayEvent) => {
    prefillEvent(event.title);
    const target = document.getElementById("register");
    const top = target
      ? target.getBoundingClientRect().top + window.scrollY - 88
      : document.body.scrollHeight;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    window.setTimeout(() => {
      document.getElementById("registration-event-select")?.focus();
    }, reduceMotion ? 0 : 450);
  };

  return (
    <section id="events" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className={cn(token("eyebrow", theme), "font-semibold text-sm uppercase tracking-[0.22em] mb-4")}>
            Upcoming Events
          </p>
          <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4", token("heading", theme))}>
            Join Us in Community
          </h2>
          <p className={cn("text-base sm:text-lg leading-relaxed", token("body", theme))}>
            Workshops, outreach days, and fellowship gatherings open to everyone.
          </p>
        </FadeInUp>

        <StaggerContainer className="relative max-w-4xl mx-auto space-y-5 sm:space-y-6">
          <div
            className={cn(
              "pointer-events-none absolute left-[2.15rem] top-8 bottom-8 hidden sm:block w-px bg-gradient-to-b to-transparent",
              isDark ? "from-amber-400/50 via-white/10" : "from-amber-500/60 via-slate-200"
            )}
            aria-hidden
          />

          {upcoming.map((event) => {
            const expanded = expandedId === event.id;
            const extra = extrasFor(event);

            return (
              <StaggerItem key={event.id}>
                <motion.article
                  layout
                  transition={{ layout: { duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] } }}
                  onClick={() => setExpandedId(expanded ? null : event.id)}
                  className={cn(
                    "group glass-card relative flex flex-col gap-5 p-5 sm:p-6 cursor-pointer",
                    token("cardHover", theme),
                    expanded && (isDark ? "bg-slate-800/60 border-amber-500/30" : "bg-white border-amber-400/40")
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    <div className="flex sm:flex-col items-center sm:justify-start gap-3 sm:w-20 shrink-0">
                      <div
                        className={cn(
                          "relative z-10 w-14 h-14 rounded-2xl border flex items-center justify-center",
                          isDark
                            ? "bg-gradient-to-br from-amber-400/15 to-yellow-600/10 border-amber-400/25"
                            : "bg-amber-50 border-amber-200"
                        )}
                      >
                        <Calendar className="w-6 h-6 text-amber-500" aria-hidden />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        {event.tag && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-amber-400/40 bg-amber-500/10 text-amber-600 dark:text-amber-300">
                            {event.tag}
                          </span>
                        )}
                        <span className={cn("inline-flex items-center gap-1.5 text-sm", token("body", theme))}>
                          <Calendar className="w-3.5 h-3.5 text-amber-500" aria-hidden />
                          {formatDate(event.date)}
                        </span>
                        {event.time && (
                          <span className={cn("inline-flex items-center gap-1.5 text-sm", token("body", theme))}>
                            <Clock className="w-3.5 h-3.5 text-amber-500" aria-hidden />
                            {event.time}
                          </span>
                        )}
                      </div>
                      <h3
                        className={cn(
                          "font-bold text-xl mb-2 transition-colors",
                          token("heading", theme),
                          isDark ? "group-hover:text-amber-200" : "group-hover:text-amber-800"
                        )}
                      >
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className={cn("text-sm leading-relaxed", token("body", theme))}>{event.description}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(event);
                      }}
                      className={cn(
                        "self-start sm:self-center shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
                        isDark
                          ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950"
                          : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-400 hover:text-slate-950"
                      )}
                      aria-label={`Join ${event.title}`}
                    >
                      Join
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="details"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={cn("pt-2 border-t grid gap-4 sm:grid-cols-2", token("hairline", theme))}>
                          <div className="pt-4">
                            <p className={cn("inline-flex items-center gap-2 text-sm font-semibold mb-2", token("heading", theme))}>
                              <MapPin className="w-4 h-4 text-amber-500" />
                              {extra.venue}
                            </p>
                            <p className={cn("text-sm mb-3", token("body", theme))}>{extra.address}</p>
                            <p className={cn("text-sm leading-relaxed", token("body", theme))}>{extra.details}</p>
                          </div>
                          <div className="pt-4">
                            <div
                              className={cn(
                                "overflow-hidden rounded-xl border h-48",
                                isDark ? "border-white/10" : "border-slate-200"
                              )}
                            >
                              <iframe
                                title={`${event.title} location map`}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(extra.mapQuery)}&z=12&output=embed`}
                                className="h-full w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
