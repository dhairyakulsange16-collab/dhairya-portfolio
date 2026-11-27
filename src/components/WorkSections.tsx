"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { Project, CATEGORIES, CategoryType, CATEGORY_ORDER, categoryLabel } from "@/data/projects";

interface WorkSectionsProps {
  projects: Project[];
  playerOpen: boolean;
  filterCategory: CategoryType;
  setFilterCategory: (category: CategoryType) => void;
  onSelectProject: (project: Project) => void;
}

export function WorkSections({ projects, onSelectProject, playerOpen, filterCategory, setFilterCategory }: WorkSectionsProps) {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);


  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScroll = (key: string, direction: "left" | "right") => {
    const el = scrollRefs.current[key];
    if (el) {
      const scrollAmount = direction === "left" ? -350 : 350;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const visibleCategories =
    filterCategory === "All"
      ? CATEGORY_ORDER
      : CATEGORY_ORDER.filter(category => category === filterCategory);

  return (
    <div id="work" className="archive">
      <div className="archive-head">
        <div className="archive-title"><h2>Work archive<span>.</span></h2><p>{projects.length} films / {CATEGORY_ORDER.length} categories</p></div>
        <div className="archive-filters" aria-label="Filter projects by category">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((p) => p.category === cat).length;
            const isActive = filterCategory === cat;

            return (
              <button
                key={cat}
                aria-pressed={isActive}
                onClick={() => setFilterCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#020308] font-medium shadow-sm"
                    : "bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                <span>{categoryLabel(cat)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-black/15 text-[#020308] font-medium" : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Each Subfolder Section */}
      <div className="archive-sections">
        {visibleCategories.map((category) => {
          const categoryProjects = projects.filter((p) => p.category === category);
          if (categoryProjects.length === 0) return null;

          const reels = categoryProjects.filter(project => project.aspect === "9:16");
          const films = categoryProjects.filter(project => project.aspect !== "9:16");

          return (
            <section
              key={category}
              className="archive-section"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h3 className="category-title">{categoryLabel(category)}<sup>{categoryProjects.length}</sup></h3>
                </div>

                {/* Carousel Navigation Buttons */}
                {reels.length > 0 && (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleScroll(category, "left")}
                      className="p-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-surface-border hover:border-accent/40 text-zinc-300 hover:text-white transition-all shadow-md active:scale-95"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleScroll(category, "right")}
                      className="p-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-surface-border hover:border-accent/40 text-zinc-300 hover:text-white transition-all shadow-md active:scale-95"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Videos Layout: Carousel vs Grid */}
              {reels.length > 0 && (
                <div
                  ref={(el) => {
                    scrollRefs.current[category] = el;
                  }}
                  className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {reels.map((project) => (
                    <div key={project.id} className="snap-start shrink-0">
                      <VideoCard
                        project={project}
                        onSelect={onSelectProject}
                        activePlayingId={playerOpen ? null : activePlayingId}
                        onActivate={setActivePlayingId}
                      />
                    </div>
                  ))}
                </div>
              )}
              {films.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {films.map((project) => (
                    <VideoCard
                      key={project.id}
                      project={project}
                      onSelect={onSelectProject}
                      activePlayingId={playerOpen ? null : activePlayingId}
                      onActivate={setActivePlayingId}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
