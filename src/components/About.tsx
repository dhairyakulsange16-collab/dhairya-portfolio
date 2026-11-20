"use client";

import React from "react";
import { SectionWrapper } from "./SectionWrapper";
import { MapPin, Film, Sparkles, CheckCircle2, Clock, Layers, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function About() {
  const tools = [
    { name: "Adobe Premiere Pro", level: "Primary NLE • Advanced Multicam, Pacing & Audio Sync" },
    { name: "Adobe After Effects", level: "Motion Graphics, Kinetic Typography & Tracking" },
    { name: "DaVinci Resolve", level: "Color Grading & Cinematic Film Emulation" },
    { name: "Adobe Photoshop", level: "High-CTR Custom Thumbnails & Cover Art" },
    // TODO: Dhairya to confirm any additional 3D or audio software (e.g., Blender, Audition, CapCut)
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Hook & Pacing Blueprint",
      desc: "Analyzing viewer psychology, script rhythm, and designing visual hooks in the first 3 seconds.",
    },
    {
      step: "02",
      title: "Assembly & Beat-Matched Cut",
      desc: "Trimming dead space, locking cadence with musical downbeats, and maintaining constant visual curiosity.",
    },
    {
      step: "03",
      title: "Motion & Audio Engineering",
      desc: "Layering custom sound effects (whooshes, risers, impacts) with kinetic typography and smooth zoom-ins.",
    },
    {
      step: "04",
      title: "Color Grade & Master Delivery",
      desc: "Polishing skin tones and contrast, rendering 4K & mobile exports, paired with high-CTR thumbnails.",
    },
  ];

  return (
    <SectionWrapper
      id="about"
      badge="About Me"
      title="Crafting Visuals That Stop The Scroll"
      subtitle="Based in Nagpur, India, I bridge the gap between creative storytelling and algorithmic retention."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: PFP Avatar + Personal Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Dhairya Avatar Showcase inside About */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group shrink-0">
                {/* Cyan Glow Outer Ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent-bright opacity-80 blur-md group-hover:opacity-100 transition duration-700 animate-pulse-glow" />
                
                {/* Avatar Frame */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-accent/80 p-0.5 bg-[#030712] shadow-xl shadow-accent/20">
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
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Hey, I&apos;m Dhairya 👋
                </h3>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider block mt-1">
                  Video Editor • Cameraman • Content Creator
                </span>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                  Nagpur, Maharashtra, India • Working with 40+ brands worldwide
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              With ~2 years of hands-on video editing and on-location shooting experience, I specialize in transforming raw footage into high-retention commercial assets. Over the last two years, I have collaborated with{" "}
              <span className="text-accent font-semibold">40+ brands, SaaS platforms, and digital creators</span> across India and international markets.
            </p>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              My editing philosophy centers on <span className="text-white font-medium">retention engineering</span>. In today&apos;s hyper-saturated feeds, visuals must grab attention in the first 3 seconds, lock the audience in with punchy sound design, and tell a memorable story before the viewer swipes away.
            </p>

            {/* TODO: Dhairya can add personal backstory or camera gear preferences here */}

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#030712] border border-white/5">
                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Base Location</span>
                </div>
                <span className="text-sm font-semibold text-white">Nagpur, Maharashtra, India</span>
                <span className="block text-[11px] text-zinc-500 mt-0.5">Available for remote & on-site</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#030712] border border-white/5">
                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>Turnaround Time</span>
                </div>
                {/* TODO: Dhairya can update average delivery timeline */}
                <span className="text-sm font-semibold text-white">24 - 48 Hours</span>
                <span className="block text-[11px] text-zinc-500 mt-0.5">Rapid short-form deliverables</span>
              </div>
            </div>

            {/* Let's Work Together CTA */}
            <div className="pt-2">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Let&apos;s Work Together</span>
                <ArrowUpRight className="w-4 h-4 text-accent" />
              </Link>
            </div>
          </div>

          {/* Core Production Stack */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span>Production & Post-Production Toolkit</span>
            </h4>
            <div className="space-y-3">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#030712] border border-white/5 text-xs gap-1 hover:border-accent/30 transition-colors"
                >
                  <span className="font-semibold text-zinc-200">{tool.name}</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{tool.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>The 4-Step Editing Process</span>
            </h4>

            <div className="space-y-6">
              {workflowSteps.map((wf) => (
                <div key={wf.step} className="flex gap-4">
                  <span className="font-mono text-sm font-bold text-accent bg-accent/10 border border-accent/20 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                    {wf.step}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white">{wf.title}</h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{wf.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability Callout Banner */}
            <div className="mt-8 p-4 rounded-2xl bg-accent/10 border border-accent/20 text-center">
              <p className="text-xs text-accent font-medium">
                🎯 Currently accepting select monthly retainer clients & brand campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
