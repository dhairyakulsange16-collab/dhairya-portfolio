"use client";

import React, { useEffect, useState } from "react";
import { BackdropA } from "./BackdropA";
import { BackdropB } from "./BackdropB";
import { BackdropC } from "./BackdropC";

type BgChoice = "1" | "2" | "3";

const STORAGE_KEY = "dhairya_bg_choice";

export function BackdropSwitch() {
  const [choice, setChoice] = useState<BgChoice>("1");
  const [showToggle, setShowToggle] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // 1. Hardware / Mobile check
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

    // 2. Query parameter and SessionStorage check
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const bgParam = searchParams.get("bg");

      if (bgParam) {
        setShowToggle(true);
        if (bgParam === "1" || bgParam === "2" || bgParam === "3") {
          setChoice(bgParam as BgChoice);
          sessionStorage.setItem(STORAGE_KEY, bgParam);
        }
      } else {
        const savedChoice = sessionStorage.getItem(STORAGE_KEY);
        if (savedChoice === "1" || savedChoice === "2" || savedChoice === "3") {
          setChoice(savedChoice as BgChoice);
        }
      }
    } catch {
      // Safe fallback on storage/security errors
    }

    // 3. Dynamic Reading Scrim scroll listener
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

  const selectBg = (newChoice: BgChoice) => {
    setChoice(newChoice);
    try {
      sessionStorage.setItem(STORAGE_KEY, newChoice);
      const url = new URL(window.location.href);
      url.searchParams.set("bg", newChoice);
      window.history.replaceState(null, "", url.toString());
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Fixed Root Backdrop at z-index: 0 */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none isolation-isolate"
        style={{ contain: "strict" }}
        aria-hidden="true"
        data-active-bg={choice}
      >
        {/* Active Direction */}
        {choice === "1" && <BackdropA isMobile={isMobile} />}
        {choice === "2" && <BackdropB isMobile={isMobile} />}
        {choice === "3" && <BackdropC isMobile={isMobile} />}

        {/* Cinematic Vignette (Subtle edge falloff for depth) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(2, 4, 10, 0.88) 100%)",
          }}
        />

        {/* 35mm Subtle Film Grain (Inline SVG feTurbulence data URI) */}
        <div
          className="anim-film-grain absolute inset-0 w-full h-full pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            transform: "translateZ(0)",
          }}
        />

        {/* Dynamic Reading Scrim (Rises as user scrolls down) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-200"
          style={{
            backgroundColor: "rgba(2, 4, 10, var(--scrim, 0))",
          }}
        />
      </div>

      {/* Floating Toggle: ONLY visible when URL contains ?bg= */}
      {showToggle && (
        <aside
          aria-label="Background Switcher Preview"
          className="fixed bottom-6 left-6 z-50 pointer-events-auto"
        >
          <div className="glass-panel px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-mono shadow-2xl border border-white/15 bg-black/70 backdrop-blur-xl rounded-full">
            <span className="text-zinc-400 pl-1.5 pr-1 text-[11px] uppercase tracking-wider font-semibold">
              BG:
            </span>
            <button
              type="button"
              onClick={() => selectBg("1")}
              className={`px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
                choice === "1"
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              1: Aurora
            </button>
            <button
              type="button"
              onClick={() => selectBg("2")}
              className={`px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
                choice === "2"
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              2: Anamorphic
            </button>
            <button
              type="button"
              onClick={() => selectBg("3")}
              className={`px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
                choice === "3"
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              3: Timeline
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
