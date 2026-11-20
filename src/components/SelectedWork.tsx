"use client";

import React, { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { VideoCard } from "./VideoCard";
import { Project, CategoryType, CATEGORIES } from "@/data/projects";

interface SelectedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function SelectedWork({ projects, onSelectProject }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <SectionWrapper
      id="work"
      badge="Portfolio"
      title="Selected Commercial & Creative Works"
      subtitle="Explore a curated showcase of viral short-form reels, high-end commercial campaigns, tech product demos, and high-CTR thumbnails."
    >
      {/* Category Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/[0.06]">
        {CATEGORIES.map((category) => {
          const count = category === "All"
            ? projects.length
            : projects.filter((p) => p.category === category).length;

          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                isActive
                  ? "bg-accent text-black font-semibold shadow-lg shadow-accent/20"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-white/5"
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? "bg-black/20 text-black font-bold" : "bg-white/10 text-zinc-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {filteredProjects.map((project) => (
          <VideoCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          No projects found in this category.
        </div>
      )}
    </SectionWrapper>
  );
}
