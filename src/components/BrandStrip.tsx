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

  // Split into two distinct rows for a layered two-track train effect (since > 12 brands)
  const row1Base = brands.slice(0, 7);
  const row2Base = brands.slice(7);

  // Repeat each row twice in each half to ensure it exceeds the widest viewport (> 3000px)
  const row1Half = [...row1Base, ...row1Base];
  const row2Half = [...row2Base, ...row2Base];

  return (
    <section
      id="clients"
      className="py-16 sm:py-20 border-y border-white/[0.06] bg-[#02040A] relative overflow-hidden"
      aria-label="Client Roster & Trusted Brands"
    >
      {/* Ambient center blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[120px] bg-primary/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-surface border border-surface-border text-accent backdrop-blur-md glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Client Roster</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Trusted by 40+ Brands, SaaS Platforms & Commercial Creators
        </h2>
        <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-2xl mx-auto">
          Delivering high-retention video production across tech, luxury retail, automotive, and digital education.
        </p>
      </div>

      {/* =========================================================================
          1. Continuous Train-Style Marquee (Visible by default, hidden if reduced motion)
          ========================================================================= */}
      <div className="relative w-full space-y-5 sm:space-y-6 motion-reduce:hidden">
        {/* Left & Right Edge Fade Overlays for Train Passing Illusion */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 md:w-56 bg-gradient-to-r from-[#02040A] via-[#02040A]/85 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 md:w-56 bg-gradient-to-l from-[#02040A] via-[#02040A]/85 to-transparent z-20" />

        {/* --- Track 1: Moving Right-to-Left (Eastbound Train) --- */}
        <div className="marquee-container relative w-full overflow-hidden marquee-fade-mask">
          <div className="marquee-track animate-train-left">
            {/* Primary Track Set */}
            <div className="flex shrink-0 items-center gap-6 sm:gap-7 pr-6 sm:pr-7" role="list">
              {row1Half.map((brand, idx) => (
                <div
                  key={`r1-a-${brand.name}-${idx}`}
                  role="listitem"
                  className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-[#050B2E]/60 border border-white/[0.08] hover:border-accent hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:bg-[#050B2E]/90 transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 cursor-default select-none group"
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                    {brand.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate Track Set for 100% Seamless Looping */}
            <div
              className="flex shrink-0 items-center gap-6 sm:gap-7 pr-6 sm:pr-7"
              aria-hidden="true"
            >
              {row1Half.map((brand, idx) => (
                <div
                  key={`r1-b-${brand.name}-${idx}`}
                  className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-[#050B2E]/60 border border-white/[0.08] hover:border-accent hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:bg-[#050B2E]/90 transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 cursor-default select-none group"
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                    {brand.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Track 2: Moving Left-to-Right (Westbound Train, Layered Effect) --- */}
        <div className="marquee-container relative w-full overflow-hidden marquee-fade-mask">
          <div className="marquee-track animate-train-right">
            {/* Primary Track Set */}
            <div className="flex shrink-0 items-center gap-6 sm:gap-7 pr-6 sm:pr-7" role="list">
              {row2Half.map((brand, idx) => (
                <div
                  key={`r2-a-${brand.name}-${idx}`}
                  role="listitem"
                  className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-[#050B2E]/60 border border-white/[0.08] hover:border-accent hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:bg-[#050B2E]/90 transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 cursor-default select-none group"
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                    {brand.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate Track Set for 100% Seamless Looping */}
            <div
              className="flex shrink-0 items-center gap-6 sm:gap-7 pr-6 sm:pr-7"
              aria-hidden="true"
            >
              {row2Half.map((brand, idx) => (
                <div
                  key={`r2-b-${brand.name}-${idx}`}
                  className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-[#050B2E]/60 border border-white/[0.08] hover:border-accent hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:bg-[#050B2E]/90 transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 cursor-default select-none group"
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                    {brand.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. Static Wrapped Grid (Only displayed for prefers-reduced-motion)
          ========================================================================= */}
      <div
        className="hidden motion-reduce:flex flex-wrap justify-center gap-4 max-w-6xl mx-auto px-4 py-2"
        role="list"
      >
        {brands.map((brand) => (
          <div
            key={`reduced-${brand.name}`}
            role="listitem"
            className="px-6 py-3.5 rounded-2xl bg-[#050B2E]/60 border border-white/[0.08] hover:border-accent hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-all flex flex-col items-center justify-center text-center cursor-default group"
          >
            <span className="text-sm sm:text-base font-bold text-zinc-200 group-hover:text-accent transition-colors tracking-tight">
              {brand.name}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5">
              {brand.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
