"use client";

import React from "react";

interface BackdropProps {
  isMobile?: boolean;
}

/**
 * Direction 2: Anamorphic Light Leaks & Lens Flares / 35mm Film Studio
 * Cinema optical aesthetics: horizontal anamorphic streak flares, soft out-of-focus
 * bokeh discs, and a slow-drifting projector light wash.
 */
export function BackdropB({ isMobile = false }: BackdropProps) {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      data-direction="anamorphic"
    >
      {/* 1. Deep Obsidian Void Base */}
      <div className="absolute inset-0 w-full h-full bg-[#020308]" />

      {/* 2. Soft Ambient Film Stage Wash */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] h-[100vh] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(8, 20, 48, 0.6) 0%, rgba(3, 7, 18, 0.4) 55%, transparent 80%)",
          transform: "translateZ(0)",
        }}
      />

      {/* 3. Primary Horizontal Anamorphic Streak Flare (Upper-Mid) */}
      <div
        className="anim-flare-1 absolute pointer-events-none"
        style={{
          top: isMobile ? "24vh" : "28vh",
          left: "-20vw",
          width: "140vw",
          height: isMobile ? "70px" : "110px",
          transformOrigin: "center center",
          transform: "translateZ(0)",
        }}
      >
        {/* Diffuse Flare Halo */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(30, 91, 255, 0.32) 0%, rgba(34, 211, 238, 0.18) 35%, transparent 75%)",
            filter: "blur(28px)",
          }}
        />
        {/* Laser-Sharp Anamorphic Core Streak */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[2.5px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(30, 91, 255, 0.6) 25%, rgba(92, 240, 255, 0.95) 50%, rgba(30, 91, 255, 0.6) 75%, transparent 95%)",
            filter: "blur(1px)",
            boxShadow: "0 0 16px rgba(92, 240, 255, 0.7), 0 0 35px rgba(30, 91, 255, 0.5)",
          }}
        />
      </div>

      {/* 4. Secondary Offset Anamorphic Streak Flare (Lower) */}
      <div
        className="anim-flare-2 absolute pointer-events-none"
        style={{
          top: isMobile ? "68vh" : "62vh",
          left: "-15vw",
          width: "130vw",
          height: isMobile ? "50px" : "80px",
          transformOrigin: "center center",
          transform: "translateZ(0)",
        }}
      >
        {/* Soft Halo */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(34, 211, 238, 0.22) 0%, rgba(14, 165, 233, 0.12) 40%, transparent 75%)",
            filter: "blur(24px)",
          }}
        />
        {/* Thin Anamorphic Core */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[1.5px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 10%, rgba(14, 165, 233, 0.5) 30%, rgba(34, 211, 238, 0.85) 50%, rgba(14, 165, 233, 0.5) 70%, transparent 90%)",
            filter: "blur(0.8px)",
            boxShadow: "0 0 12px rgba(34, 211, 238, 0.6)",
          }}
        />
      </div>

      {/* 5. Cinema Optical Bokeh Discs */}
      <div
        className="anim-bokeh-1 absolute pointer-events-none rounded-full"
        style={{
          top: "16vh",
          left: "14vw",
          width: isMobile ? "110px" : "180px",
          height: isMobile ? "110px" : "180px",
          background:
            "radial-gradient(circle at 45% 45%, rgba(30, 91, 255, 0.35) 0%, rgba(30, 91, 255, 0.1) 60%, transparent 85%)",
          border: "1px solid rgba(92, 240, 255, 0.22)",
          filter: "blur(14px)",
          transform: "translateZ(0)",
        }}
      />

      <div
        className="anim-bokeh-2 absolute pointer-events-none rounded-full"
        style={{
          top: "52vh",
          right: "12vw",
          width: isMobile ? "130px" : "220px",
          height: isMobile ? "130px" : "220px",
          background:
            "radial-gradient(circle at 45% 45%, rgba(56, 189, 248, 0.28) 0%, rgba(30, 91, 255, 0.08) 55%, transparent 80%)",
          border: "1px solid rgba(56, 189, 248, 0.18)",
          filter: "blur(18px)",
          transform: "translateZ(0)",
        }}
      />

      {!isMobile && (
        <>
          <div
            className="anim-bokeh-1 absolute pointer-events-none rounded-full"
            style={{
              top: "76vh",
              left: "28vw",
              width: "140px",
              height: "140px",
              background:
                "radial-gradient(circle at 45% 45%, rgba(34, 211, 238, 0.22) 0%, rgba(30, 91, 255, 0.06) 60%, transparent 80%)",
              border: "1px solid rgba(34, 211, 238, 0.15)",
              filter: "blur(16px)",
              transform: "translateZ(0)",
            }}
          />

          {/* 6. Soft Conical Projector Light Cone (Adds studio depth) */}
          <div
            className="anim-projector absolute pointer-events-none"
            style={{
              top: "-15vh",
              left: "15vw",
              width: "70vw",
              height: "115vh",
              background:
                "linear-gradient(135deg, rgba(30, 91, 255, 0.12) 0%, rgba(34, 211, 238, 0.04) 40%, transparent 75%)",
              filter: "blur(48px)",
              transformOrigin: "top left",
              transform: "translateZ(0)",
            }}
          />
        </>
      )}

      {/* 7. Calm Hero Gradient Mask */}
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
