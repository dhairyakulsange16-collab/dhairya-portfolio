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
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-14 sm:pb-20 overflow-hidden bg-transparent">
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated PFP Avatar with Soft Cyan Glow Ring */}
        <div className="relative mb-5 sm:mb-8 group">
          {/* Animated Cyan Glow Outer Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent-bright opacity-75 blur-md group-hover:opacity-100 transition duration-700 animate-pulse-glow" />
          
          {/* Circular Frame */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-accent/80 p-0.5 bg-[#020308] shadow-2xl shadow-accent/20">
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
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#020308] border border-accent/50 shadow-md shadow-accent/20">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent block animate-pulse" />
          </div>
        </div>

        {/* Small Intro Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wider uppercase mb-4 sm:mb-6 bg-white/[0.04] border border-white/10 text-accent backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>Dhairya • Nagpur, India</span>
        </div>

        {/* Big Name & Dynamic Tagline (Refined Typography) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light sm:font-normal tracking-[-0.03em] text-white uppercase leading-[0.95]">
          DHAIRYA
        </h1>

        <div className="mt-3 sm:mt-5 h-9 sm:h-12 flex items-center justify-center">
          <span className="text-xl sm:text-4xl md:text-5xl font-light sm:font-normal tracking-[-0.02em] text-gradient-cyan">
            {displayText}
            <span className="inline-block w-1 h-6 sm:h-10 ml-1 bg-accent animate-pulse align-middle" />
          </span>
        </div>

        {/* Subhead / Value Proposition */}
        <p className="mt-4 sm:mt-8 text-sm sm:text-lg md:text-xl text-muted-text max-w-2xl font-light sm:font-normal leading-relaxed">
          Crafting high-retention reels, dynamic motion graphics, and cinematic commercial films
          that stop the scroll and drive real audience engagement.
        </p>

        {/* Dual CTAs matching reference pill aesthetic */}
        <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="#work"
            className="btn-primary-pill inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm tracking-wide shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>View My Work</span>
            <ArrowDown className="w-4 h-4 text-[#020308]" />
          </Link>

          <Link
            href="#contact"
            className="btn-secondary-pill inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm tracking-wide backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </Link>
        </div>

        {/* Small Social Handles Row under CTAs */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
          <a
            href={SOCIALS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile (@editby.dhiru)"
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <a
            href={SOCIALS.threads.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Threads Profile (@editby.dhiru)"
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ThreadsIcon className="w-4 h-4" />
          </a>

          <a
            href={SOCIALS.x.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X Profile (@editbydhiru)"
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <XIcon className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={openDiscord}
            aria-label="Discord Profile (User ID: 1108795562758770828)"
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-zinc-400 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title="Open in Discord"
          >
            <DiscordIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
