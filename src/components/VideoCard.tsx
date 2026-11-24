"use client";

import React, { useRef, useEffect, useState } from "react";
import { Play, VolumeX, Sparkles } from "lucide-react";
import { Project } from "@/data/projects";
import { safeTrack } from "@/lib/analytics";

interface VideoCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  activePlayingId?: string | null;
  onActivate?: (id: string | null) => void;
}

export function VideoCard({
  project,
  onSelect,
  activePlayingId,
  onActivate,
}: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isVideo = Boolean(project.videoPath);
  const isVertical = project.aspect === "9:16";
  const shouldPlay = isVideo && activePlayingId === project.id;

  // Lazy-load using IntersectionObserver
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Manage single-video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay policy fallback
      });
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onActivate?.(project.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (activePlayingId === project.id) {
      onActivate?.(null);
    }
  };

  const handleTouch = () => {
    if (activePlayingId !== project.id) {
      onActivate?.(project.id);
    }
  };

  const handleClick = () => {
    safeTrack("video_open", { category: project.category });
    onSelect(project);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-[#050B2E]/60 border border-white/[0.08] transition-all duration-300 hover:border-accent hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] shrink-0 select-none ${
        isVertical
          ? "w-[240px] sm:w-[280px] aspect-[9/16]"
          : "w-full aspect-[16/9]"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View ${project.title}`}
    >
      {/* Poster Image (Always rendered with lazy loading) */}
      <div className="absolute inset-0 w-full h-full bg-[#030712] overflow-hidden">
        <img
          src={project.posterPath}
          alt={project.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            shouldPlay ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Video Element (Autoplays muted on hover, only one at a time) */}
      {isVideo && isInView && (
        <video
          ref={videoRef}
          src={project.videoPath}
          poster={project.posterPath}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            shouldPlay ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

      {/* Top Bar Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/70 border border-white/10 text-zinc-300 backdrop-blur-md">
          {project.category}
        </span>

        {/* Hover Volume / Status Indicator */}
        <div
          className={`p-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md transition-all ${
            shouldPlay ? "text-accent border-accent/40" : "text-zinc-400 opacity-60 group-hover:opacity-100"
          }`}
        >
          <VolumeX className="w-3 h-3" />
        </div>
      </div>

      {/* Center Action Button Reveal with neon cyan glow */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center transform scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-accent/40">
          <Play className="w-5 h-5 fill-black ml-0.5 text-black" />
        </div>
      </div>

      {/* Bottom Information Details */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 flex flex-col justify-end pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mb-1">
          <span className="text-accent font-semibold">{project.aspect}</span>
          <span>•</span>
          <span>{project.duration}</span>
          <span>•</span>
          <span>{project.resolution}</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-2 group-hover:text-accent transition-colors drop-shadow-sm">
          {project.title}
        </h3>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] uppercase tracking-wider text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
          <span className="text-[9px] font-mono text-zinc-400 ml-auto">
            {project.sizeFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
