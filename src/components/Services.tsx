"use client";

import React from "react";
import { SectionWrapper } from "./SectionWrapper";
import { Scissors, Video, Camera, Share2, Search, Sparkles, CheckCircle2 } from "lucide-react";

export function Services() {
  const servicesList = [
    {
      icon: Video,
      title: "End-to-End Video Production",
      tagline: "Concept to Final Master",
      description:
        "Full-cycle creative direction: concept ideation, storyboard planning, multi-camera shooting, sound engineering, and final delivery tailored for broadcast or web.",
      deliverables: [
        "Pre-production scripting & shot breakdown",
        "Multi-camera setup & cinema lighting",
        "Full post-production finishing",
        "Multi-format exports (16:9, 9:16)",
      ],
      // TODO: Dhairya to confirm turnaround packages and commercial rates
    },
    {
      icon: Scissors,
      title: "Reels & Short-Form Editing",
      tagline: "Retention-Engineered Hooks",
      description:
        "High-velocity editing engineered for Instagram Reels, YouTube Shorts, and TikTok. Built around dopamine-triggering sound effects, kinetic captions, and micro-cuts.",
      deliverables: [
        "First 3-second visual hook design",
        "Kinetic subtitles & animated icons",
        "Beat-matched pacing & SFX layer",
        "Visual zoom-ins & pattern interrupts",
      ],
      // TODO: Dhairya to list monthly reel retainer tiers
    },
    {
      icon: Camera,
      title: "Cameraman & Shooting",
      tagline: "On-Location & Studio Cinematography",
      description:
        "Professional camera operation on Sony cinema rigs, Ronin gimbals, and wireless lav audio. Available for on-location brand shoots, events, and commercial campaigns.",
      deliverables: [
        "Sony 4K S-Log cinema capture",
        "Dynamic gimbal movement & tracking",
        "Wireless studio audio recording",
        "Direction & on-set framing guidance",
      ],
      // TODO: Dhairya to confirm specific camera & lens lineup (e.g., FX3 / A7IV / 24-70 GM)
    },
    {
      icon: Share2,
      title: "Social Media Posting",
      tagline: "Consistent Algorithmic Cadence",
      description:
        "End-to-end scheduling and posting management across Instagram, YouTube, and LinkedIn. Ensuring your content calendar stays active without lifting a finger.",
      deliverables: [
        "Strategic posting calendar scheduling",
        "Caption copywriting & hashtag trees",
        "Community engagement monitoring",
        "Audience retention timing optimization",
      ],
      // TODO: Dhairya to confirm which platforms he actively manages
    },
    {
      icon: Search,
      title: "Video SEO & Optimization",
      tagline: "Search Visibility & High CTR",
      description:
        "Transforming views into search-driven traffic. Crafting custom click-worthy thumbnails, keyword-rich descriptions, and metadata architecture.",
      deliverables: [
        "Custom high-CTR Photoshop thumbnails",
        "Search-optimized video titles & tags",
        "YouTube chapter markers & cards",
        "Audience keyword search analysis",
      ],
      // TODO: Dhairya to specify thumbnail CTR averages or case studies
    },
  ];

  return (
    <SectionWrapper
      id="services"
      badge="Specialization"
      title="Services Engineered for Attention"
      subtitle="From on-ground cinematography in Nagpur to high-retention post-production, every service is tailored to deliver measurable brand growth."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.title}
              className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-accent/40 transition-all duration-300"
            >
              {/* Subtle accent corner glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/15 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#030712] border border-white/10 flex items-center justify-center text-accent group-hover:border-accent/50 group-hover:scale-105 transition-all shadow-md">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                  {service.tagline}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-3">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2.5">
                  Deliverables Include:
                </span>
                <ul className="space-y-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
