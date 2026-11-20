"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function BrandStrip() {
  // TODO: Dhairya to attach vector/PNG brand logos to replace text placeholders
  const brands = [
    { name: "SwarnApp", category: "Jewellery ERP Tech" },
    { name: "JewelSteps", category: "Retail SaaS" },
    { name: "SalonSteps", category: "Salon Automation" },
    { name: "ThinkerSteps", category: "Enterprise Solutions" },
    { name: "Isha Jewellery", category: "Luxury Fine Jewels" },
    { name: "Tariq Riaz", category: "Haute Joaillerie (Dubai)" },
    { name: "BGauss Motors", category: "EV Mobility" },
    { name: "Taco Bell", category: "QSR Commercial" },
    { name: "Prestige Realtors", category: "Real Estate" },
    { name: "Albo", category: "Fintech Platform" },
    { name: "Leos Pros", category: "English Academy" },
    { name: "Gandhi Builders", category: "Infrastructure" },
    { name: "Hari Om Granite", category: "Architectural Stone" },
    { name: "Sai Madhav", category: "Commercial Retail" },
  ];

  // Duplicate for smooth seamless loop
  const marqueeList = [...brands, ...brands];

  return (
    <section id="brands" className="py-16 border-y border-white/[0.06] bg-[#02040A] relative overflow-hidden">
      {/* Ambient center blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-primary/10 blur-[80px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-2 bg-surface border border-surface-border text-accent backdrop-blur-md glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Client Roster</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          Trusted by 40+ Brands, SaaS Platforms & Commercial Creators
        </h3>
        <p className="text-xs text-muted-text mt-1">
          {/* TODO: Add official brand logo vectors once available from Dhairya */}
          Delivering high-retention video production across tech, luxury retail, automotive, and digital education.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Container */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        {/* Left and Right Gradient Fade Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#02040A] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#02040A] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee space-x-4 py-2 hover:[animation-play-state:paused]">
          {marqueeList.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="px-6 py-3.5 rounded-2xl bg-[#050B2E]/50 border border-white/[0.08] hover:border-accent/50 hover:bg-[#050B2E]/80 transition-all flex flex-col items-center justify-center text-center shrink-0 cursor-default group backdrop-blur-sm"
            >
              <span className="text-sm sm:text-base font-bold text-zinc-200 group-hover:text-accent transition-colors tracking-tight">
                {brand.name}
              </span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono tracking-tight mt-0.5">
                {brand.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
