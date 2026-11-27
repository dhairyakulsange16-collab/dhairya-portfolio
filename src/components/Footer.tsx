"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, Mail, ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/data/socials";
import { InstagramIcon, ThreadsIcon, XIcon, DiscordIcon, openDiscord } from "./SocialIcons";

export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.06] bg-[#02040A] py-12 sm:py-16 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/[0.06]">
          {/* Brand & Value statement */}
          <div>
            <Link
              href="#"
              className="text-xl font-bold tracking-tighter text-white inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            >
              <span className="w-8 h-8 rounded-lg bg-[#050B2E] border border-accent/30 flex items-center justify-center">
                <span className="text-accent font-black text-sm">D</span>
              </span>
              <span className="tracking-widest uppercase text-sm font-semibold text-zinc-100">
                DHAIRYA<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Video Editor, Cameraman & Content Creator crafting high-retention commercial stories.
            </p>

            {/* Email mailto link in Footer */}
            <div className="mt-3">
              <a
                href={SOCIALS.email.mailto}
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-bright transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded py-0.5"
                aria-label={`Send inquiry email to ${SOCIALS.email.address}`}
              >
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>{SOCIALS.email.address}</span>
                <ArrowUpRight className="w-3 h-3 text-accent" />
              </a>
            </div>
          </div>

          {/* Nagpur Local Time Card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="block text-zinc-500 font-mono text-[10px] uppercase">
                Nagpur, India (IST)
              </span>
              <span className="font-mono text-zinc-200 font-medium">{time || "Loading..."}</span>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Instagram */}
            <a
              href={SOCIALS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:text-white hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Instagram Profile (@editby.dhiru)"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            {/* Threads */}
            <a
              href={SOCIALS.threads.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:text-white hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Threads Profile (@editby.dhiru)"
            >
              <ThreadsIcon className="w-4 h-4" />
            </a>

            {/* X */}
            <a
              href={SOCIALS.x.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:text-white hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="X Profile (@editbydhiru)"
            >
              <XIcon className="w-4 h-4" />
            </a>

            {/* Discord */}
            <button
              type="button"
              onClick={openDiscord}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent hover:text-white hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
              aria-label="Discord Profile (User ID: 1108795562758770828)"
              title="Open in Discord"
            >
              <DiscordIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Dhairya. All rights reserved. Video Editor & Cameraman.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <div className="p-1 rounded-full bg-[#050B2E] border border-white/10 group-hover:border-accent transition-colors">
              <ArrowUp className="w-3 h-3 text-zinc-400 group-hover:text-accent transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
