"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WorkSections } from "@/components/WorkSections";
import { Services } from "@/components/Services";
import { StatsStrip } from "@/components/StatsStrip";
import { BrandStrip } from "@/components/BrandStrip";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Lightbox } from "@/components/Lightbox";
import { PROJECTS, Project, CategoryType } from "@/data/projects";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [category, setCategory] = useState<CategoryType>("All");

  return (
    <main className="relative z-10 min-h-screen bg-transparent text-zinc-100 flex flex-col selection:bg-accent selection:text-black">
      <Navbar onCategory={setCategory} />

      <Hero onSelect={setSelectedProject} />

      <WorkSections
        projects={PROJECTS}
        filterCategory={category}
        setFilterCategory={setCategory}
        playerOpen={Boolean(selectedProject)}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      <Services />

      <StatsStrip />

      <BrandStrip />

      <About />

      <Contact />

      <Footer />

      <Lightbox
        project={selectedProject}
        projects={PROJECTS}
        onClose={() => setSelectedProject(null)}
        onNavigate={(p) => setSelectedProject(p)}
      />
    </main>
  );
}
