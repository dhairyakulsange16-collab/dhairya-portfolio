"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { PROJECTS, Project } from "@/data/projects";
import { safeTrack } from "@/lib/analytics";

const features = [
  { id: "ai-ugc-videos-isha-jewellery-bracelet-video-1-chf3-prob4", title: "Isha Jewellery", image: "isha", genre: "Jewellery film" },
  { id: "commercial-shoots-tacobell-2", title: "Taco Bell", image: "taco", genre: "Brand campaign" },
  { id: "outdoor-shoot-final-bgauss-motors-ev-scooter", title: "BGauss Motors", image: "bgauss", genre: "On-location shoot" },
].flatMap(feature => {
  const project = PROJECTS.find(item => item.id === feature.id);
  return project ? [{ ...feature, project }] : [];
});

export function Hero({ onSelect }: { onSelect: (project: Project) => void }) {
  const [index, setIndex] = useState(0);
  const film = features[index];
  return (
    <section id="hero" className="studio-hero">
      <div className="studio-intro">
        <p className="studio-kicker"><i /> Video editor &amp; cinematographer</p>
        <h1>Dhairya<br /><em>Kulsange.</em></h1>
        <p className="intro-copy">I shoot and edit commercials, short films and reels from my base in Nagpur, India.</p>
        <div className="hero-actions">
          <a className="studio-cta" href="#work" onClick={() => safeTrack("view_work_click")}>Explore my work <ArrowDownRight size={17} /></a>
          <a className="studio-link" href="#contact" onClick={() => safeTrack("hire_me_click")}>Get in touch <ArrowUpRight size={15} /></a>
        </div>
      </div>
      {film && <div className="feature-monitor">
        <button className="feature-screen" aria-label={`Play ${film.title}`} onClick={() => onSelect(film.project)}>
          <img key={film.image} src={`/assets/features/${film.image}.webp`} alt="" fetchPriority="high" />
          <span className="feature-cap"><span className="rec-dot" /> Featured film</span>
          <span className="feature-time">{film.project.duration}</span>
          <span className="feature-caption"><small>{film.genre}</small><strong>{film.title}</strong></span>
          <span className="feature-play"><Play size={21} fill="currentColor" /></span>
        </button>
        <div className="monitor-controls">
          <span className="monitor-count" aria-live="polite">{String(index + 1).padStart(2, "0")} <span>/ {String(features.length).padStart(2, "0")}</span></span>
          <div className="film-strip" aria-label="Choose a featured film">
            {features.map((item, i) => <button key={item.id} aria-label={`Feature ${item.title}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
              <img src={`/assets/features/${item.image}.webp`} alt="" />
            </button>)}
          </div>
          <button aria-label="Previous featured film" onClick={() => setIndex((index + features.length - 1) % features.length)}><ChevronLeft size={17} /></button>
          <button aria-label="Next featured film" onClick={() => setIndex((index + 1) % features.length)}><ChevronRight size={17} /></button>
        </div>
      </div>}
    </section>
  );
}
