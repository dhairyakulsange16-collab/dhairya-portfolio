"use client";

import React, { useEffect, useState } from "react";

/**
 * Cinematic Aurora / Fluid Luminous Mesh Backdrop
 * Ethereal, organic ribbons of light weaving across deep obsidian navy.
 * Evocative of high-end color grading suites and IMAX title visuals.
 * Fixed at z-index 0 with pointer-events-none and strict containment.
 */
export function Backdrop() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // 1. Hardware / Mobile responsiveness check
    const mobileWidth = window.innerWidth < 768;
    const lowConcurrency =
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;
    const prefersReducedData =
      typeof navigator !== "undefined" &&
      // @ts-expect-error - connection API
      navigator.connection?.saveData === true;

    setIsMobile(Boolean(mobileWidth || lowConcurrency || prefersReducedData));

    // 2. Dynamic Reading Scrim scroll listener
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || 0;
          // Slowly darken background as user scrolls down beyond the hero
          const scrimValue = Math.min(Math.max(scrollY / 800, 0), 0.72);
          document.documentElement.style.setProperty(
            "--scrim",
            scrimValue.toFixed(3)
          );
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none isolation-isolate"
      style={{ contain: "strict" }}
      aria-hidden="true"
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

      {/* 5. Glacial Cyan Caustic Shimmer (Desktop only: adds translucent shimmer depth) */}
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

      {/* 7. Cinematic Vignette (Edge falloff for depth) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(2, 4, 10, 0.88) 100%)",
        }}
      />

      {/* 8. 35mm Subtle Film Grain (Inline SVG feTurbulence data URI) */}
      <div
        className="anim-film-grain absolute inset-0 w-full h-full pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          transform: "translateZ(0)",
        }}
      />

      {/* 9. Dynamic Reading Scrim (Rises as user scrolls down) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-200"
        style={{
          backgroundColor: "rgba(2, 4, 10, var(--scrim, 0))",
        }}
      />
    </div>
  );
}
