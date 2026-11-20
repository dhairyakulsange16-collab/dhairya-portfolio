"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  ArrowUpRight,
  Film,
  HardDrive,
} from "lucide-react";
import { Project } from "@/data/projects";

interface LightboxProps {
  project: Project | null;
  projects: Project[];
  onClose: () => void;
  onNavigate: (project: Project) => void;
}

export function Lightbox({ project, projects, onClose, onNavigate }: LightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isVideo = Boolean(project?.videoPath);
  const isVertical = project?.aspect === "9:16";

  const currentIndex = projects.findIndex((p) => p.id === project?.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  // Lock body scroll when open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  // Autoplay video when project changes
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [project, isVideo]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(prevProject);
      if (e.key === "ArrowRight") onNavigate(nextProject);
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose, onNavigate, prevProject, nextProject, togglePlay, toggleMute]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!project) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent">
            {project.category}
          </span>
          <span className="text-sm font-medium text-zinc-300 hidden sm:inline">
            {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`p-2.5 rounded-full border transition-colors ${
              showDetails
                ? "bg-accent/20 border-accent/40 text-accent"
                : "bg-white/10 border-white/10 text-zinc-300 hover:text-white hover:bg-white/15"
            }`}
            title="Toggle Details"
            aria-label="Toggle project details"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/15 transition-colors hidden sm:flex"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-colors"
            title="Close (Esc)"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 md:p-12 gap-6 max-w-7xl mx-auto">
        {/* Previous Navigation Arrow */}
        <button
          onClick={() => onNavigate(prevProject)}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-zinc-300 hover:text-white hover:bg-accent hover:text-black hover:border-accent transition-all hidden sm:flex"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Media Frame Container */}
        <div
          className={`relative flex items-center justify-center max-h-[82vh] transition-all duration-300 rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 ${
            isVertical ? "h-[82vh] aspect-[9/16]" : "w-full max-w-4xl aspect-[16/9]"
          }`}
        >
          {isVideo ? (
            <>
              <video
                ref={videoRef}
                src={project.videoPath}
                poster={project.posterPath}
                playsInline
                controls={false}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Video Player Floating Overlay Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 z-10">
                {/* Scrubber Progress Bar */}
                <div
                  onClick={handleSeek}
                  className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer relative transition-all group/scrub"
                >
                  <div
                    className="h-full bg-accent rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover/scrub:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Bottom Media Controls Bar */}
                <div className="flex items-center justify-between text-xs text-zinc-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-[11px] text-zinc-400">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
                    {project.aspect} • {project.resolution}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-2">
              <img
                src={project.posterPath}
                alt={project.title}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Next Navigation Arrow */}
        <button
          onClick={() => onNavigate(nextProject)}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-zinc-300 hover:text-white hover:bg-accent hover:text-black hover:border-accent transition-all hidden sm:flex"
          aria-label="Next project"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Project Details Sidebar Panel */}
        {showDetails && (
          <aside className="w-full md:w-80 lg:w-96 flex flex-col justify-between p-6 rounded-2xl bg-[#030712]/90 border border-white/10 backdrop-blur-md max-h-[82vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-zinc-500">{project.duration}</span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {project.title}
              </h2>

              <div className="mt-4 pb-4 border-b border-white/[0.08] flex items-center gap-4 text-xs text-zinc-400">
                <div>
                  <span className="block text-[10px] uppercase text-zinc-500 font-semibold">Format</span>
                  <span className="text-zinc-200 font-medium">
                    {project.aspect === "9:16" ? "Vertical Reel" : "Horizontal Film"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-zinc-500 font-semibold">Resolution</span>
                  <span className="text-zinc-200 font-mono">{project.resolution}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-zinc-500 font-semibold">Size</span>
                  <span className="text-zinc-200 font-mono">{project.sizeFormatted}</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                  Source Archive
                </span>
                <p className="text-xs text-zinc-400 font-mono bg-white/[0.04] p-2.5 rounded-lg border border-white/5 break-all">
                  📁 {project.folder} / {project.driveFileName}
                </p>
              </div>

              <div className="mt-5">
                <span className="block text-[10px] uppercase text-zinc-500 font-semibold mb-2">
                  Tags & Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-zinc-300 bg-white/[0.06] border border-white/5 px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <a
                href="#contact"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-primary/30"
              >
                <span>Hire for Similar Video</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
              </a>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
