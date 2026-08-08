"use client";

import Image from "next/image";
import { BookOpen, Globe, Heart, Users } from "lucide-react";
import { useAppData } from "@/lib/data-context";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion/FadeInUp";
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
    <section id="about" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            About Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Serving Communities Through Faith &amp; Media
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">{aboutIntro}</p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-20">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? Heart;
            return (
              <StaggerItem key={pillar.id}>
                <HoverCard
                  lift
                  className="group h-full rounded-2xl p-6 border border-white/70 bg-white/55 backdrop-blur-md shadow-[0_8px_32px_rgba(15,23,42,0.06)] ring-1 ring-inset ring-white/40 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100/90 to-amber-50/80 flex items-center justify-center mb-4 shadow-inner">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeInUp>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
            Our Leadership Team
          </h3>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {trustees.map((trustee, i) => (
            <FadeInUp key={trustee.id} delay={i * 0.12}>
              <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center transition-shadow duration-300 hover:shadow-xl focus-within:shadow-xl">
                <div className="relative w-24 h-24 mx-auto mb-5 overflow-hidden rounded-full ring-4 ring-amber-100">
                  <Image
                    src={
                      trustee.image ??
                      "https://images.unsplash.com/JOELphoto-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                    }
                    alt={trustee.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <h4 className="font-bold text-xl text-slate-900">{trustee.name}</h4>
                <p className="text-amber-600 font-medium text-sm mt-1">{trustee.role}</p>
                <blockquote className="mt-4 text-sm leading-relaxed italic text-slate-500/80 opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:text-amber-700">
                  &ldquo;{trustee.quote}&rdquo;
                </blockquote>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
