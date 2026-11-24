"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function BrandStrip() {
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

  // Since > 12 clients, split into two layered tracks moving in opposite directions
  const row1Base = brands.slice(0, 7);
  const row2Base = brands.slice(7);

  // Repeat items 3 times inside each copy so one copy spans > 4500px (exceeding > 3x any viewport)
  const row1Copy = [...row1Base, ...row1Base, ...row1Base];
  const row2Copy = [...row2Base, ...row2Base, ...row2Base];

  return (
    <section
      id="clients"
      style={
        {
          "--marquee-duration": "35s",
          "--marquee-duration-reverse": "45s",
        } as React.CSSProperties
      }
      className="py-16 sm:py-20 border-y border-white/[0.06] bg-transparent relative overflow-x-hidden"
      aria-label="Client Roster & Trusted Brands"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-3 bg-white/[0.04] border border-white/10 text-accent backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Client Roster</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light sm:font-normal text-white uppercase tracking-[-0.02em]">
          Trusted by 40+ Brands, SaaS Platforms & Commercial Creators
        </h2>
        <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-2xl mx-auto font-light sm:font-normal">
          Delivering high-retention video production across tech, luxury retail, automotive, and digital education.
        </p>
      </div>

      {/* =========================================================================
          Continuous Train-Style Marquee Tracks
          ========================================================================= */}
      <div className="relative w-full">
        {/* Track 1: Moving Right-to-Left (marquee-left, 35s) */}
        <div className="marquee">
          <div className="marquee-track marquee-track--left">
            {/* Original List */}
            <ul className="flex items-center shrink-0 list-none m-0 p-0" role="list">
              {row1Copy.map((brand, idx) => (
                <li
                  key={`r1-orig-${brand.name}-${idx}`}
                  className="shrink-0 pr-6 sm:pr-8 whitespace-nowrap"
                  role="listitem"
                >
                  <div className="glass-card h-[74px] sm:h-[80px] px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-default select-none group">
                    <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                      {brand.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                      {brand.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Exact Duplicate List for 100% Seamless -50% Loop */}
            <ul className="flex items-center shrink-0 list-none m-0 p-0" aria-hidden="true">
              {row1Copy.map((brand, idx) => (
                <li
                  key={`r1-dup-${brand.name}-${idx}`}
                  className="shrink-0 pr-6 sm:pr-8 whitespace-nowrap"
                  tabIndex={-1}
                >
                  <div className="glass-card h-[74px] sm:h-[80px] px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-default select-none group">
                    <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                      {brand.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                      {brand.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Track 2: Moving Left-to-Right (marquee-right, 45s) */}
        <div className="marquee mt-5 sm:mt-6">
          <div className="marquee-track marquee-track--right">
            {/* Original List */}
            <ul className="flex items-center shrink-0 list-none m-0 p-0" role="list">
              {row2Copy.map((brand, idx) => (
                <li
                  key={`r2-orig-${brand.name}-${idx}`}
                  className="shrink-0 pr-6 sm:pr-8 whitespace-nowrap"
                  role="listitem"
                >
                  <div className="glass-card h-[74px] sm:h-[80px] px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-default select-none group">
                    <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                      {brand.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                      {brand.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Exact Duplicate List for 100% Seamless -50% Loop */}
            <ul className="flex items-center shrink-0 list-none m-0 p-0" aria-hidden="true">
              {row2Copy.map((brand, idx) => (
                <li
                  key={`r2-dup-${brand.name}-${idx}`}
                  className="shrink-0 pr-6 sm:pr-8 whitespace-nowrap"
                  tabIndex={-1}
                >
                  <div className="glass-card h-[74px] sm:h-[80px] px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-default select-none group">
                    <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-accent transition-colors tracking-tight whitespace-nowrap">
                      {brand.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 tracking-tight mt-0.5 whitespace-nowrap">
                      {brand.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
