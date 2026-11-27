"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X, Aperture } from "lucide-react";
import { CATEGORY_ORDER, categoryLabel, CategoryType } from "@/data/projects";
import { SOCIALS } from "@/data/socials";
import { safeTrack } from "@/lib/analytics";

export function Navbar({ onCategory }: { onCategory: (category: CategoryType) => void }) {
  const [open, setOpen] = useState(false);
  return <header className="studio-header" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <div className="studio-nav">
      <a className="wordmark" href="#hero" onClick={() => setOpen(false)} aria-label="Dhairya home"><Aperture size={26} strokeWidth={2.4} />{SOCIALS.instagram.handle.slice(1)}</a>
      <nav id="studio-menu" aria-label="Main navigation" className={open ? "studio-menu is-open" : "studio-menu"}>
        <select aria-label="Browse work by category" value="" onChange={event => {
          onCategory(event.target.value as CategoryType);
          setOpen(false);
          document.getElementById("work")?.scrollIntoView();
        }}>
          <option value="" disabled>Work</option>
          <option value="All">All projects</option>
          {CATEGORY_ORDER.map(category => <option key={category} value={category}>{categoryLabel(category)}</option>)}
        </select>
        {["Services", "About", "Contact"].map(name => <a href={`#${name.toLowerCase()}`} key={name} onClick={() => setOpen(false)}>{name}</a>)}
      </nav>
      <a className="nav-contact" href="#contact" onClick={() => { setOpen(false); safeTrack("hire_me_click"); }}>Let's talk <ArrowUpRight size={14} /></a>
      <button className="menu-toggle" aria-controls="studio-menu" aria-expanded={open} aria-label="Toggle navigation menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}
