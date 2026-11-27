"use client";

import React, { useEffect, useState } from "react";

interface BarConfig {
  left: number;
  top: number;
  stop: number;
  mirror?: boolean;
}

// 7 Left Bars from Figma CSS
const LEFT_BARS: BarConfig[] = [
  { left: 0, top: 473.61, stop: 71.34 },
  { left: 102.86, top: 407.16, stop: 71.34 },
  { left: 205.71, top: 374.42, stop: 71.34 },
  { left: 308.57, top: 389.83, stop: 71.34 },
  { left: 411.43, top: 427.38, stop: 71.34 },
  { left: 514.29, top: 490.94, stop: 71.34 },
  { left: 617.14, top: 607.46, stop: 61.17 },
];

// 7 Right Bars from Figma CSS (mirrored with scaleX(-1))
const RIGHT_BARS: BarConfig[] = [
  { left: 1337.14, top: 473.61, stop: 48.62, mirror: true },
  { left: 1234.29, top: 407.16, stop: 42.17, mirror: true },
  { left: 1131.43, top: 374.42, stop: 39, mirror: true },
  { left: 1028.57, top: 389.83, stop: 40.55, mirror: true },
  { left: 925.71, top: 427.38, stop: 43.86, mirror: true },
  { left: 822.86, top: 490.94, stop: 50.16, mirror: true },
  { left: 720, top: 607.46, stop: 61.17, mirror: true },
];

const ALL_BARS: BarConfig[] = [...LEFT_BARS, ...RIGHT_BARS];

export function Backdrop() {
  const [isFallback, setIsFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Initial responsive check & performance capabilities
    const mobileWidth = window.innerWidth < 768;
    setIsMobile(mobileWidth);

    const prefersReducedData =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-data: reduce)").matches;
    const lowConcurrency =
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;

    // Use fallback on mobile, reduced data, or low-concurrency devices
    if (mobileWidth || prefersReducedData || lowConcurrency) {
      setIsFallback(true);
    } else {
      // Measure initial FPS over the first 2 seconds on desktop
      let frameCount = 0;
      let startTime = performance.now();
      let animId: number;

      const measureFps = (now: number) => {
        frameCount++;
        if (now - startTime < 2000) {
          animId = requestAnimationFrame(measureFps);
        } else {
          const elapsed = (now - startTime) / 1000;
          const fps = frameCount / elapsed;
          if (fps < 40) {
            setIsFallback(true);
          }
        }
      };
      animId = requestAnimationFrame(measureFps);
    }

    // 2. Dynamic responsive scale calculation
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.max(vw / 1440, vh / 1024);
      document.documentElement.style.setProperty("--bg-scale", scale.toFixed(4));
      setIsMobile(vw < 768);
    };

    let resizeTicking = false;
    const handleResize = () => {
      if (!resizeTicking) {
        requestAnimationFrame(() => {
          updateScale();
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    updateScale();

    // 3. Reading Scrim passive scroll listener
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          // Opacity rises smoothly from 0 at top to 0.50 after the Hero (~550px)
          const progress = Math.min(Math.max((scrollY - 80) / 520, 0), 1);
          const scrimValue = (progress * 0.5).toFixed(3);
          document.documentElement.style.setProperty("--scrim", scrimValue);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none isolation-isolate"
      style={{
        contain: "strict",
        backgroundImage: "url(/assets/backgrounds/stage-desktop.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden="true"
      data-backdrop-mode={isFallback ? "fallback-image" : "live-layers"}
    >
      {/* Fallback Mode: Render optimized static baked asset with smooth scale & glow */}
      {isFallback ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            className="backdrop-anim-fallback absolute inset-[-10%] w-[120%] h-[120%] bg-cover bg-center"
            style={{
              backgroundImage: isMobile
                ? "url(/assets/backgrounds/stage-mobile.webp)"
                : "url(/assets/backgrounds/stage-desktop.webp)",
            }}
          />
        </div>
      ) : (
        /* Live Mode: Exact 1440x1024 Stage with GPU-Accelerated Live Layers */
        <div
          className="backdrop-stage absolute left-1/2 top-1/2"
          style={{
            width: "1440px",
            height: "1024px",
            transform: "translate(-50%, -50%) scale(var(--bg-scale, 1))",
            transformOrigin: "center center",
          }}
        >
          {/* Outer Stage Slow Scaling Animation (1 to 1.04, 40s) */}
          <div className="backdrop-anim-stage absolute inset-0 w-full h-full bg-[#000000]">
            {/* Layer 1: Base #000000 */}

            {/* Layer 2: White Pillar ("Element" - Centered, Breathing) */}
            <div
              className="absolute left-1/2 -top-[49.42px] -translate-x-1/2 pointer-events-none"
              style={{
                width: "947.69px",
                height: "1221.99px",
              }}
            >
              <div
                className="backdrop-anim-pillar w-full h-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0) 1.94%, rgba(255,255,255,0.72) 96.75%)",
                  mixBlendMode: "plus-lighter",
                  filter: "blur(137px)",
                  WebkitFilter: "blur(137px)",
                }}
              />
            </div>

            {/* Layer 3: Blue Blob (Left - Matrix Transform) */}
            <div
              className="absolute -left-[182.84px] top-[473.61px] pointer-events-none"
              style={{
                width: "863.13px",
                height: "561.38px",
              }}
            >
              <div className="backdrop-anim-blob-blue w-full h-full">
                <div
                  className="w-full h-full"
                  style={{
                    background: "var(--bg-blue, #2388FF)",
                    filter: "blur(200px)",
                    WebkitFilter: "blur(200px)",
                    transform: "matrix(-0.97, -0.25, -0.38, 0.93, 0, 0)",
                  }}
                />
              </div>
            </div>

            {/* Layer 4: Indigo Blob (Right - Matrix Transform) */}
            <div
              className="absolute left-[576.55px] top-[473.61px] pointer-events-none"
              style={{
                width: "863.13px",
                height: "561.38px",
              }}
            >
              <div className="backdrop-anim-blob-indigo w-full h-full">
                <div
                  className="w-full h-full"
                  style={{
                    background: "var(--bg-indigo, #4A3AFF)",
                    filter: "blur(200px)",
                    WebkitFilter: "blur(200px)",
                    transform: "matrix(0.97, -0.25, 0.38, 0.93, 0, 0)",
                  }}
                />
              </div>
            </div>

            {/* Layer 5: Center Blue Glow */}
            <div
              className="absolute left-1/2 top-[413.8px] -translate-x-1/2 pointer-events-none"
              style={{
                width: "915.71px",
                height: "580.02px",
              }}
            >
              <div
                className="backdrop-anim-glow w-full h-full"
                style={{
                  background:
                    "linear-gradient(180deg, #2388FF 0%, rgba(35,136,255,0) 100%)",
                  mixBlendMode: "plus-lighter",
                  filter: "blur(136px)",
                  WebkitFilter: "blur(136px)",
                }}
              />
            </div>

            {/* Layer 6: Ribs ("Lines") Group */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
              style={{
                opacity: 0.4,
                maskImage: "linear-gradient(to top, #000 0%, transparent 56.13%)",
                WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 56.13%)",
              }}
            >
              {/* Soft Light Sweep Traveling Left to Right */}
              <div
                className="backdrop-anim-sweep absolute top-0 w-[240px] h-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
                }}
              />

              {/* 14 Ribbed Bars */}
              {ALL_BARS.map((bar, idx) => (
                <div
                  key={`rib-bar-${idx}`}
                  className="backdrop-anim-rib absolute"
                  style={{
                    width: "102.86px",
                    height: "1066.12px",
                    left: `${bar.left}px`,
                    top: `${bar.top}px`,
                    transform: bar.mirror ? "scaleX(-1)" : "none",
                    animationDelay: `-${(idx * 0.57).toFixed(2)}s`,
                    backgroundImage: `linear-gradient(0deg, #000000 ${bar.stop}%, rgba(255,255,255,0) 100%), radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255,255,255,0) 16%, rgba(0,0,0,0.75) 74%, #000000 100%)`,
                    backgroundBlendMode: "screen",
                  }}
                />
              ))}
            </div>

            {/* Layer 7: Film-Grain Texture (SVG feTurbulence) */}
            <div
              className="backdrop-anim-grain absolute inset-0 w-full h-full pointer-events-none"
              style={{
                opacity: 0.25,
                mixBlendMode: "overlay",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
              }}
            />
          </div>
        </div>
      )}

      {/* Reading Scrim: Dynamic dark overlay rising from 0 to 0.50 after Hero */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          backgroundColor: "rgba(0, 0, 0, var(--scrim, 0))",
          zIndex: 1,
        }}
      />
    </div>
  );
}
