"use client";

import React, { useEffect } from "react";

export function GlassBackdrop() {
  // Reading scrim: passive scroll listener driving --scrim CSS variable
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Opacity ramps from 0 to 0.55 between scrollY 100px and 650px (past Hero)
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const progress = Math.min(Math.max((scrollY - 100) / 550, 0), 1);
          const scrimValue = progress * 0.55;
          document.documentElement.style.setProperty("--scrim", scrimValue.toFixed(3));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial evaluation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none isolation-isolate"
      style={{ contain: "strict" }}
      aria-hidden="true"
    >
      {/* =====================================================================
          1. Base Layer: Solid Near-Black (#020308) + Deep Navy Radial Washes
          ===================================================================== */}
      <div className="absolute inset-0 bg-[#020308]">
        {/* Bottom-left corner deep-navy radial wash */}
        <div
          className="absolute -bottom-20 -left-20 w-[60vw] h-[60vh] max-w-[800px] max-h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, rgba(10, 42, 143, 0.22) 0%, rgba(10, 42, 143, 0.08) 45%, transparent 70%)",
          }}
        />
        {/* Bottom-right corner deep-navy radial wash */}
        <div
          className="absolute -bottom-20 -right-20 w-[60vw] h-[60vh] max-w-[800px] max-h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 80%, rgba(10, 42, 143, 0.20) 0%, rgba(10, 42, 143, 0.06) 45%, transparent 70%)",
          }}
        />
      </div>

      {/* =====================================================================
          2. Left Band: Tall slanted glossy slab (Blue -> Sky -> Pale Ice Blue)
          ===================================================================== */}
      <div
        className="backdrop-band-left absolute -top-[15vh] -left-[10vw] sm:-left-[6vw] w-[75vw] sm:w-[55vw] max-w-[850px] h-[115vh] sm:h-[135vh] pointer-events-none origin-top-left"
        style={{
          background:
            "linear-gradient(180deg, #0A2A8F 0%, #0B5BD3 22%, #1E5BFF 48%, #3FA9E8 74%, #B7DDF0 100%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 35%, transparent 100%)",
          borderLeft: "1px solid rgba(92, 240, 255, 0.85)",
          boxShadow:
            "0 0 25px rgba(30, 91, 255, 0.75), inset 2px 0 15px rgba(92, 240, 255, 0.5)",
          filter: "drop-shadow(0 0 35px rgba(30, 91, 255, 0.45))",
        }}
      >
        {/* Inner glossy glass sheen layer on the left third */}
        <div
          className="absolute left-0 top-0 w-[42%] h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(183, 221, 240, 0.25) 25%, rgba(255, 255, 255, 0.50) 58%, rgba(183, 221, 240, 0.25) 82%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />

        {/* Dynamic glossy sheen traveling strip */}
        <div
          className="backdrop-sheen absolute left-0 top-0 w-[70px] sm:w-[90px] h-[360px] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.65) 50%, transparent 100%)",
            filter: "blur(28px)",
          }}
        />
      </div>

      {/* =====================================================================
          3. Right Band: Diagonally angled top-right slab (Sand -> Teal -> Blue)
          ===================================================================== */}
      <div
        className="backdrop-band-right absolute -top-[12vh] -right-[12vw] sm:-right-[6vw] w-[65vw] sm:w-[45vw] max-w-[720px] h-[100vh] sm:h-[120vh] pointer-events-none origin-top-right"
        style={{
          background:
            "linear-gradient(215deg, #D9D2B8 0%, #3FC1B5 32%, #1E5BFF 60%, #0A2A8F 82%, #020308 100%)",
          maskImage:
            "linear-gradient(to left, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, black 40%, transparent 100%)",
          borderRight: "1px solid rgba(63, 193, 181, 0.65)",
          boxShadow:
            "0 0 25px rgba(63, 193, 181, 0.4), inset -2px 0 12px rgba(217, 210, 184, 0.3)",
          filter: "drop-shadow(0 0 30px rgba(63, 193, 181, 0.35))",
        }}
      />

      {/* =====================================================================
          4. The Planetary Arc: Convex black body + Dual-tone Glowing Rim
          ===================================================================== */}
      <div
        className="backdrop-arc absolute -bottom-[46vw] sm:-bottom-[48vw] left-[15vw] sm:left-[30vw] md:left-[36vw] w-[95vw] sm:w-[85vw] max-w-[1250px] h-[95vw] sm:h-[85vw] max-h-[1250px] min-w-[620px] min-h-[620px] rounded-full pointer-events-none"
      >
        {/* Atmospheric outer glow behind the crest */}
        <div
          className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(58, 160, 255, 0.55) 0%, rgba(30, 91, 255, 0.35) 30%, transparent 65%)",
            filter: "blur(60px)",
            opacity: 0.75,
          }}
        />

        {/* SVG Planetary Disc & Animated Dual Rims */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 1000"
        >
          <defs>
            {/* Warm Rim Gradient: Peach to Cyan */}
            <linearGradient id="rimWarmGrad" x1="15%" y1="0%" x2="85%" y2="0%">
              <stop offset="0%" stopColor="#020308" stopOpacity="0" />
              <stop offset="18%" stopColor="#F2C9A0" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#F2C9A0" stopOpacity="1" />
              <stop offset="62%" stopColor="#B7DDF0" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#3AA0FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020308" stopOpacity="0" />
            </linearGradient>

            {/* Cool Rim Gradient: Cyan to Electric Neon */}
            <linearGradient id="rimCoolGrad" x1="15%" y1="0%" x2="85%" y2="0%">
              <stop offset="0%" stopColor="#020308" stopOpacity="0" />
              <stop offset="25%" stopColor="#B7DDF0" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#3AA0FF" stopOpacity="1" />
              <stop offset="78%" stopColor="#5CF0FF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020308" stopOpacity="0" />
            </linearGradient>

            {/* Soft glow filter for the rim highlight */}
            <filter id="rimGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Solid Black Planetary Core (occludes all background bands behind it) */}
          <circle cx="500" cy="500" r="494" fill="#020308" />

          {/* Rim Layer 1: Warm Peach bias (alternates 0.95 -> 0.35) */}
          <circle
            cx="500"
            cy="500"
            r="495"
            fill="none"
            stroke="url(#rimWarmGrad)"
            strokeWidth="7"
            filter="url(#rimGlowFilter)"
            className="backdrop-rim-warm"
          />

          {/* Rim Layer 2: Cool Cyan bias (alternates 0.35 -> 0.95) */}
          <circle
            cx="500"
            cy="500"
            r="495"
            fill="none"
            stroke="url(#rimCoolGrad)"
            strokeWidth="7"
            filter="url(#rimGlowFilter)"
            className="backdrop-rim-cool"
          />
        </svg>
      </div>

      {/* =====================================================================
          5. Glow Bleed: Soft cyan connection where left band meets the arc
          ===================================================================== */}
      <div
        className="absolute left-[20vw] sm:left-[26vw] bottom-[12vh] sm:bottom-[15vh] w-[350px] sm:w-[460px] h-[350px] sm:h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, rgba(30, 91, 255, 0.12) 42%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* =====================================================================
          6. Film Grain Texture: Pure SVG feTurbulence Data-URI (No External Files)
          ===================================================================== */}
      <div
        className="backdrop-grain absolute -inset-[20px] w-[calc(100%+40px)] h-[calc(100%+40px)] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          opacity: 0.16,
        }}
      />

      {/* =====================================================================
          7. Vignette Layer: Soft gradient darkening towards the perimeter
          ===================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 3, 8, 0.58) 100%)",
        }}
      />

      {/* =====================================================================
          8. Reading Scrim: Dynamically controlled via scroll listener
          ===================================================================== */}
      <div
        className="absolute inset-0 bg-[#020308] pointer-events-none transition-opacity duration-200"
        style={{
          opacity: "var(--scrim, 0)",
        }}
      />
    </div>
  );
}
