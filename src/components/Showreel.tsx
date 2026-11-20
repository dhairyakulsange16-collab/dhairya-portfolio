"use client";

import React, { useRef, useState } from "react";
import { Play, Volume2, Sparkles, Film, Maximize2 } from "lucide-react";
import { Project } from "@/data/projects";

interface ShowreelProps {
  project: Project;
  onOpenLightbox: (project: Project) => void;
}

export function Showreel({ project, onOpenLightbox }: ShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section id="showreel" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-primary/20 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-accent/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-surface border border-surface-border text-accent backdrop-blur-md glow-cyan">
            <Film className="w-3.5 h-3.5 text-accent" />
            <span>Featured Commercial Showreel</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Cinematic Vision in Motion
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-text font-normal">
            A spotlight on commercial production, dynamic camera framing, and rhythmic narrative pacing.
          </p>
        </div>

        {/* Large Showreel Video Player Frame */}
        <div
          onClick={() => onOpenLightbox(project)}
          className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-accent/80 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(34,211,238,0.25)] bg-[#030712]"
        >
          {/* Aspect Ratio Container (16:9 widescreen or modern cinematic 21:9) */}
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
            {/* Ambient Backlight Glow inside container */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />

            {/* Poster fallback */}
            <img
              src={project.posterPath}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Video element */}
            <video
              ref={videoRef}
              src={project.videoPath}
              poster={project.posterPath}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Top Bar Badges */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 pointer-events-none">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 border border-white/10 text-white backdrop-blur-md">
                {project.category}
              </span>
              <span className="text-xs font-mono text-zinc-300 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
                {project.duration}
              </span>
            </div>

            {/* Center Play Overlay Button */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                {/* Glow Ring */}
                <div className="absolute -inset-2 rounded-full bg-accent/30 blur-md group-hover:bg-accent/60 transition-colors" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent text-black flex items-center justify-center shadow-2xl shadow-accent/40">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black ml-1 text-black" />
                </div>
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-1 block">
                  Click to play with sound
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                  {project.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/10 text-xs font-medium text-zinc-300 backdrop-blur-md">
                  <Volume2 className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span>Unmute in Lightbox</span>
                  <Maximize2 className="w-3 h-3 text-zinc-400 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
