"use client";

import React from "react";

interface BackdropProps {
  isMobile?: boolean;
}

/**
 * Direction 1: Cinematic Aurora / Fluid Luminous Mesh
 * Ethereal, organic ribbons of light weaving across deep obsidian navy.
 * Evocative of high-end color grading suites and IMAX title visuals.
 */
export function BackdropA({ isMobile = false }: BackdropProps) {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      data-direction="aurora"
    >
      {/* 1. Deep Obsidian Void Base */}
      <div className="absolute inset-0 w-full h-full bg-[#02040A]" />

      {/* 2. Deep Royal Navy Atmospheric Bloom (Centered) */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[80vh] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11, 25, 54, 0.75) 0%, rgba(5, 11, 24, 0.45) 50%, transparent 75%)",
          transform: "translateZ(0)",
        }}
      />

      {/* 3. Primary Cyan/Electric Aurora Ribbon (Upper diagonal wave) */}
      <div
        className="anim-aurora-1 absolute pointer-events-none"
        style={{
          top: "-5vh",
          left: "-20vw",
          width: isMobile ? "140vw" : "150vw",
          height: isMobile ? "50vh" : "65vh",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(34, 211, 238, 0.28) 0%, rgba(30, 91, 255, 0.22) 42%, rgba(2, 4, 10, 0) 75%)",
          filter: "blur(60px)",
          transformOrigin: "center center",
          transform: "rotate(-8deg) translateZ(0)",
        }}
      />

      {/* 4. Deep Electric Blue Counter-Wave (Lower undulating wave) */}
      <div
        className="anim-aurora-2 absolute pointer-events-none"
        style={{
          top: isMobile ? "45vh" : "38vh",
          right: "-15vw",
          width: isMobile ? "130vw" : "145vw",
          height: isMobile ? "55vh" : "70vh",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30, 91, 255, 0.25) 0%, rgba(10, 27, 68, 0.28) 45%, rgba(2, 4, 10, 0) 80%)",
          filter: "blur(70px)",
          transformOrigin: "center center",
          transform: "rotate(6deg) translateZ(0)",
        }}
      />

      {/* 5. Glacial Cyan Caustic Shimmer (Desktop only: adds organic translucent shimmer) */}
      {!isMobile && (
        <div
          className="anim-aurora-3 absolute pointer-events-none"
          style={{
            top: "22vh",
            left: "5vw",
            width: "95vw",
            height: "35vh",
            background:
              "linear-gradient(115deg, transparent 15%, rgba(92, 240, 255, 0.16) 45%, rgba(34, 211, 238, 0.12) 60%, transparent 85%)",
            filter: "blur(45px)",
            mixBlendMode: "screen",
            transformOrigin: "center center",
            transform: "translateZ(0)",
          }}
        />
      )}

      {/* 6. Subtle Upper Glass Atmosphere Glow (keeps hero calm and readable) */}
      <div
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(2, 4, 10, 0.85) 0%, rgba(2, 4, 10, 0.2) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
