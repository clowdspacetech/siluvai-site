"use client";

import Image from "next/image";
import { BookOpen, Globe, Heart, Users } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { HoverCard } from "@/components/motion/HoverCard";

const iconMap = {
  heart: Heart,
  "book-open": BookOpen,
  globe: Globe,
  users: Users,
};

export default function About() {
  const { data } = useAppData();
  const { aboutIntro, pillars, trustees } = data.siteContent;

  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            About Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Serving Communities Through Faith &amp; Media
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">{aboutIntro}</p>
        </FadeInUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? Heart;
            return (
              <FadeInUp key={pillar.id} delay={i * 0.1}>
                <HoverCard className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
                </HoverCard>
              </FadeInUp>
            );
          })}
        </div>

        <FadeInUp>
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Our Leadership Team
          </h3>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trustees.map((trustee, i) => (
            <FadeInUp key={trustee.id} delay={i * 0.15}>
              <HoverCard className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <Image
                    src={
                      trustee.image ??
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                    }
                    alt={trustee.name}
                    fill
                    className="rounded-full object-cover ring-4 ring-amber-100"
                  />
                </div>
                <h4 className="font-bold text-xl text-slate-900">{trustee.name}</h4>
                <p className="text-amber-600 font-medium text-sm mt-1">{trustee.role}</p>
                <blockquote className="mt-4 text-slate-600 italic text-sm leading-relaxed">
                  &ldquo;{trustee.quote}&rdquo;
                </blockquote>
              </HoverCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
