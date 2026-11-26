"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Film, Play } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { Project, CATEGORIES, CategoryType, CATEGORY_ORDER } from "@/data/projects";

interface WorkSectionsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

interface CategoryConfig {
  key: string;
  name: string;
  badge: string;
  description: string;
  type: "carousel" | "grid";
}

const RAW_CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  "Commercial Shoots": {
    key: "Commercial Shoots",
    name: "Commercial Brand Campaigns",
    badge: "Commercial",
    description: "High-production brand advertisements, food styling, and broadcast-ready commercials.",
    type: "carousel",
  },
  "Outdoor Shoots": {
    key: "Outdoor Shoots",
    name: "On-Location & Event Shoots",
    badge: "Cinematography",
    description: "Real-world footage, international trade exhibitions in Hong Kong & Dubai, and retail launch films.",
    type: "carousel",
  },
  "Talking Head & Reels": {
    key: "Talking Head & Reels",
    name: "Talking Head & Founder Reels",
    badge: "Personal Brand",
    description: "Rhythm-cut founder videos, educational content, and high-retention social commentary.",
    type: "carousel",
  },
  "Animations & Motion": {
    key: "Animations & Motion",
    name: "Motion Graphics & App Demos",
    badge: "Motion Design",
    description: "SaaS interface animations, kinetic typography, and digital product walkthroughs.",
    type: "grid",
  },
  "Gaming Content": {
    key: "Gaming Content",
    name: "Gaming Content & Highlights",
    badge: "Entertainment",
    description: "Fast-paced gaming montages, meme pacing, and viral stream highlights.",
    type: "grid",
  },
  "Podcasts & Long-Form": {
    key: "Podcasts & Long-Form",
    name: "Podcasts & Long-Form Videos",
    badge: "Long-Form",
    description: "Multi-camera podcast discussions, real estate property tours, and full-length episodes.",
    type: "grid",
  },
  "AI UGC Videos": {
    key: "AI UGC Videos",
    name: "AI UGC & E-Commerce Reels",
    badge: "Short-Form",
    description: "High-converting UGC videos, AI jewelry showcases, and dynamic lifestyle product promotions.",
    type: "carousel",
  },
};

/**
 * Ordered strictly by CATEGORY_ORDER single source of truth from @/data/projects:
 * 1. Commercial Brand Campaigns ("Commercial Shoots") - FIRST
 * 2-6. Intermediate production genres
 * 7. AI UGC & E-Commerce Reels ("AI UGC Videos") - LAST
 */
const CATEGORY_CONFIGS: CategoryConfig[] = CATEGORY_ORDER.map(
  (key) => RAW_CATEGORY_CONFIGS[key]
);

export function WorkSections({ projects, onSelectProject }: WorkSectionsProps) {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<CategoryType>("All");

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScroll = (key: string, direction: "left" | "right") => {
    const el = scrollRefs.current[key];
    if (el) {
      const scrollAmount = direction === "left" ? -350 : 350;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const visibleConfigs =
    filterCategory === "All"
      ? CATEGORY_CONFIGS
      : CATEGORY_CONFIGS.filter((c) => c.key === filterCategory);

  return (
    <div id="work" className="relative py-16 space-y-24 bg-transparent">
      {/* Work Section Anchor Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-4 bg-white/[0.04] border border-white/10 text-accent backdrop-blur-md">
          <Film className="w-3.5 h-3.5 text-accent" />
          <span>Complete Video Portfolio</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light sm:font-normal tracking-[-0.03em] text-white uppercase">
          Real Projects • Authentic Footage
        </h2>
        <p className="mt-4 text-sm sm:text-base text-muted-text max-w-2xl mx-auto font-light sm:font-normal">
          Every video, reel, and frame below is sourced directly from client production archives across Nagpur, India, and global brands.
        </p>

        {/* Category Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((p) => p.category === cat).length;
            const isActive = filterCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#020308] font-medium shadow-sm"
                    : "bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                <span>{cat}</span>
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
      <div className="space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {visibleConfigs.map((config) => {
          const categoryProjects = projects.filter((p) => p.category === config.key);
          if (categoryProjects.length === 0) return null;

          const isCarousel = config.type === "carousel";

          return (
            <section
              key={config.key}
              className="glass-card relative p-6 sm:p-8 rounded-3xl"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-widest mb-2">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>{config.badge}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-mono text-zinc-400">
                      {categoryProjects.length} {categoryProjects.length === 1 ? "Video" : "Videos"}
                    </span>
                  </div>
                  <div className="relative inline-block pb-2">
                    <h3 className="text-2xl sm:text-3xl font-light sm:font-normal text-white tracking-tight uppercase">
                      {config.name}
                    </h3>
                    <div className="absolute bottom-0 left-0 w-20 h-[2px] bg-gradient-to-r from-[#1E5BFF] to-[#22D3EE] rounded-full" />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl font-light">
                    {config.description}
                  </p>
                </div>

                {/* Carousel Navigation Buttons */}
                {isCarousel && (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleScroll(config.key, "left")}
                      className="p-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-surface-border hover:border-accent/40 text-zinc-300 hover:text-white transition-all shadow-md active:scale-95"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleScroll(config.key, "right")}
                      className="p-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-surface-border hover:border-accent/40 text-zinc-300 hover:text-white transition-all shadow-md active:scale-95"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Videos Layout: Carousel vs Grid */}
              {isCarousel ? (
                <div
                  ref={(el) => {
                    scrollRefs.current[config.key] = el;
                  }}
                  className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {categoryProjects.map((project) => (
                    <div key={project.id} className="snap-start shrink-0">
                      <VideoCard
                        project={project}
                        onSelect={onSelectProject}
                        activePlayingId={activePlayingId}
                        onActivate={setActivePlayingId}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProjects.map((project) => (
                    <VideoCard
                      key={project.id}
                      project={project}
                      onSelect={onSelectProject}
                      activePlayingId={activePlayingId}
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
