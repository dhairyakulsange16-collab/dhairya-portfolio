"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Showreel } from "@/components/Showreel";
import { WorkSections } from "@/components/WorkSections";
import { Services } from "@/components/Services";
import { StatsStrip } from "@/components/StatsStrip";
import { BrandStrip } from "@/components/BrandStrip";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Lightbox } from "@/components/Lightbox";
import { PROJECTS, Project } from "@/data/projects";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Pick the premier commercial showreel from authentic Drive files
  // (BGauss Motors EV Scooter or Taco Bell Commercial)
  const showreelProject =
    PROJECTS.find((p) => p.id === "commercial-shoots-tacobell-2") ||
    PROJECTS.find((p) => p.id === "outdoor-shoot-final-bgauss-motors-ev-scooter") ||
    PROJECTS[0];

  return (
    <main className="relative min-h-screen bg-background text-zinc-100 flex flex-col selection:bg-accent selection:text-black">
      {/* 0. Sticky Global Navbar with Scroll Progress Bar & Section Tracker */}
      <Navbar />

      {/* 1. Hero: Animated PFP, Name, Dynamic Taglines, Dual CTAs, Moving Diagonal Lights */}
      <Hero />

      {/* 2. Showreel: Large muted autoplay loop, click to open with sound in Lightbox */}
      {showreelProject && (
        <Showreel
          project={showreelProject}
          onOpenLightbox={(p) => setSelectedProject(p)}
        />
      )}

      {/* 3. Work sections (one per Drive subfolder: vertical snap carousel, horizontal grids) */}
      <WorkSections
        projects={PROJECTS}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {/* 4. Services: 5 glass cards (End-to-end, Reels, Cameraman, Social posting, SEO) */}
      <Services />

      {/* 5. Stats strip: Animated count-up (2+ yrs, 40+ brands, auto-calculated project count) */}
      <StatsStrip />

      {/* 6. Brands I've worked with: Infinite marquee strip */}
      <BrandStrip />

      {/* 7. About: PFP avatar, short bio, tools, Let's work together CTA */}
      <About />

      {/* 8. Contact: WhatsApp, Email, Instagram, YouTube, and Brief form */}
      <Contact />

      {/* 9. Minimal Footer with back-to-top */}
      <Footer />

      {/* Fullscreen Video Lightbox with keyboard navigation & next/previous */}
      <Lightbox
        project={selectedProject}
        projects={PROJECTS}
        onClose={() => setSelectedProject(null)}
        onNavigate={(p) => setSelectedProject(p)}
      />
    </main>
  );
}
