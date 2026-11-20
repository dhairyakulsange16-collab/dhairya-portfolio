"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles, Film, Video, Scissors } from "lucide-react";
import { SOCIALS } from "@/data/socials";
import { InstagramIcon, ThreadsIcon, XIcon, DiscordIcon, openDiscord } from "./SocialIcons";

export function Hero() {
  const titles = ["Video Editor", "Cameraman", "Content Creator"];
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    const currentFull = titles[titleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentFull) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    } else {
      const speed = isDeleting ? 40 : 80;
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentFull.substring(0, displayText.length - 1)
            : currentFull.substring(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden diagonal-streaks">
      {/* Ambient Moving Diagonal Lights and Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/20 blur-[150px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-accent/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-primary/15 blur-[100px] pointer-events-none rounded-full" />

      {/* Subtle moving diagonal streak line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="w-[1px] h-[200%] bg-gradient-to-b from-transparent via-accent to-transparent absolute top-[-50%] left-[20%] rotate-[-45deg] animate-streak-move" />
        <div className="w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary to-transparent absolute top-[-50%] left-[60%] rotate-[-45deg] animate-streak-move" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated PFP Avatar with Soft Cyan Glow Ring */}
        <div className="relative mb-8 group">
          {/* Animated Cyan Glow Outer Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent-bright opacity-75 blur-md group-hover:opacity-100 transition duration-700 animate-pulse-glow" />
          
          {/* Circular Frame */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-accent/80 p-0.5 bg-[#030712] shadow-2xl shadow-accent/20">
            <picture>
              <source
                media="(prefers-reduced-motion: reduce)"
                srcSet="/assets/brand/avatar-static.png"
              />
              <img
                src="/assets/brand/avatar.gif"
                alt="Dhairya - Video Editor & Cameraman"
                className="w-full h-full object-cover rounded-full"
              />
            </picture>
          </div>

          {/* Status Badge Attached to Avatar */}
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#030712] border border-accent/50 shadow-md shadow-accent/20">
            <span className="w-3 h-3 rounded-full bg-accent block animate-pulse" />
          </div>
        </div>

        {/* Small Intro Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-surface border border-surface-border text-accent backdrop-blur-md glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>Dhairya • Nagpur, India</span>
        </div>

        {/* Big Name & Dynamic Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.92]">
          DHAIRYA
        </h1>

        <div className="mt-4 sm:mt-5 h-10 sm:h-12 flex items-center justify-center">
          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gradient-cyan">
            {displayText}
            <span className="inline-block w-1 h-8 sm:h-10 ml-1 bg-accent animate-pulse align-middle" />
          </span>
        </div>

        {/* Subhead / Value Proposition */}
        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-text max-w-2xl font-normal leading-relaxed">
          Crafting high-retention reels, dynamic motion graphics, and cinematic commercial films
          that stop the scroll and drive real audience engagement.
        </p>

        {/* Dual CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#work"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold text-sm tracking-wide shadow-xl shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 border border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>View My Work</span>
            <ArrowDown className="w-4 h-4 text-accent" />
          </Link>

          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-surface hover:bg-surface-elevated text-white font-medium text-sm border border-surface-border hover:border-accent/40 transition-all backdrop-blur-md shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </Link>
        </div>

        {/* Small Social Handles Row under CTAs */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href={SOCIALS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile (@editby.dhiru)"
            className="p-2.5 rounded-xl bg-[#050B2E]/70 border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <a
            href={SOCIALS.threads.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Threads Profile (@editby.dhiru)"
            className="p-2.5 rounded-xl bg-[#050B2E]/70 border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ThreadsIcon className="w-4 h-4" />
          </a>

          <a
            href={SOCIALS.x.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X Profile (@editbydhiru)"
            className="p-2.5 rounded-xl bg-[#050B2E]/70 border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <XIcon className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={openDiscord}
            aria-label="Discord Profile (User ID: 1108795562758770828)"
            className="p-2.5 rounded-xl bg-[#050B2E]/70 border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title="Open in Discord"
          >
            <DiscordIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
