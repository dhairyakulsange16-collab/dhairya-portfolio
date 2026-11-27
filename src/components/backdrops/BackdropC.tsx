"use client";

import React, { useEffect, useRef, useState } from "react";

interface BackdropProps {
  isMobile?: boolean;
}

/**
 * Direction 3: Editorial Timeline & Precision Grid / Grading Suite
 * Professional video editor aesthetic: subtle timecode grid lines, horizontal clip tracks,
 * a slow-sweeping playback head light line, and an interactive luminous spotlight
 * that gracefully tracks cursor position on desktop (or drifts ambiently on mobile).
 */
export function BackdropC({ isMobile = false }: BackdropProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 40 });
  const targetPos = useRef({ x: 50, y: 40 });
  const currentPos = useRef({ x: 50, y: 40 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile) return;

    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to percentage
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      targetPos.current = { x, y };

      if (!ticking) {
        ticking = true;
        const lerpLoop = () => {
          // Smooth spring interpolation (0.06 factor)
          const dx = targetPos.current.x - currentPos.current.x;
          const dy = targetPos.current.y - currentPos.current.y;

          currentPos.current.x += dx * 0.06;
          currentPos.current.y += dy * 0.06;

          setMousePos({
            x: Math.round(currentPos.current.x * 10) / 10,
            y: Math.round(currentPos.current.y * 10) / 10,
          });

          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            animFrameId.current = requestAnimationFrame(lerpLoop);
          } else {
            ticking = false;
          }
        };
        animFrameId.current = requestAnimationFrame(lerpLoop);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isMobile]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      data-direction="timeline"
    >
      {/* 1. Deep Obsidian Void Base */}
      <div className="absolute inset-0 w-full h-full bg-[#020308]" />

      {/* 2. Interactive / Ambient Spotlight */}
      {isMobile ? (
        // Mobile / Low-Power: Autonomous ambient drift
        <div
          className="anim-timeline-ambient absolute pointer-events-none rounded-full"
          style={{
            top: "30vh",
            left: "20vw",
            width: "80vw",
            height: "80vw",
            background:
              "radial-gradient(circle at center, rgba(30, 91, 255, 0.24) 0%, rgba(34, 211, 238, 0.12) 40%, transparent 75%)",
            filter: "blur(50px)",
            transform: "translateZ(0)",
          }}
        />
      ) : (
        // Desktop: Fluid cursor-tracking spotlight
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle 520px at ${mousePos.x}% ${mousePos.y}%, rgba(30, 91, 255, 0.25) 0%, rgba(34, 211, 238, 0.10) 35%, rgba(5, 11, 24, 0.05) 60%, transparent 80%)`,
            filter: "blur(40px)",
            transform: "translateZ(0)",
            willChange: "background",
          }}
        />
      )}

      {/* 3. Subtle Editorial Timeline Tracks & Timecode Grid */}
      <div
        className="anim-timeline-grid absolute inset-0 w-full h-full pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? "64px 64px" : "96px 96px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, #000000 30%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, #000000 30%, transparent 95%)",
        }}
      />

      {/* 4. Fine Timecode Beat Markers (Horizontal Tracks) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent calc(100% - 1px), rgba(30, 91, 255, 0.06) 1px)",
          backgroundSize: "100% 192px",
        }}
      />

      {/* 5. Playhead Vertical Light Sweep (Simulates a moving playback head) */}
      <div
        className="anim-timeline-playhead absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: isMobile ? "60px" : "100px",
          transform: "translateZ(0)",
        }}
      >
        {/* Soft cyan playhead beam glow */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.12) 50%, transparent 100%)",
            filter: "blur(12px)",
          }}
        />
        {/* Needle Playhead Line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(92, 240, 255, 0.75) 20%, rgba(34, 211, 238, 0.85) 50%, rgba(92, 240, 255, 0.75) 80%, transparent 100%)",
            boxShadow: "0 0 8px rgba(92, 240, 255, 0.6)",
          }}
        />
      </div>

      {/* 6. Calm Hero Gradient Mask */}
      <div
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(2, 3, 8, 0.85) 0%, rgba(2, 3, 8, 0.2) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
