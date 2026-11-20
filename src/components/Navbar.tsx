"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Background blur transition
      setIsScrolled(window.scrollY > 20);

      // Scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Active section highlight
      const sections = ["hero", "showreel", "work", "services", "about", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Work", href: "#work", id: "work" },
    { name: "Showreel", href: "#showreel", id: "showreel" },
    { name: "Services", href: "#services", id: "services" },
    { name: "About", href: "#about", id: "about" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-50">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-accent-bright transition-all duration-100 ease-out shadow-[0_0_8px_#22D3EE]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#030712]/85 backdrop-blur-xl border-b border-accent/15 py-3 shadow-2xl shadow-primary/10"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo with Avatar Anchor */}
          <Link
            href="#"
            className="group flex items-center gap-2.5 text-xl font-bold tracking-tighter text-white"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-accent/60 p-0.5 bg-black/40 group-hover:border-accent group-hover:shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all">
              <img
                src="/assets/brand/avatar-static.png"
                alt="Dhairya"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="tracking-widest uppercase text-sm font-extrabold text-white">
              DHAIRYA<span className="text-accent animate-pulse">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links with Active Indicator */}
          <nav className="hidden md:flex items-center gap-1 rounded-full px-4 py-1.5 bg-[#050B2E]/60 border border-accent/20 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-accent/20 text-accent-bright border border-accent/40 shadow-[0_0_10px_rgba(34,211,238,0.25)] font-semibold"
                      : "text-muted-text hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badge & Primary CTA */}
          <div className="hidden md:flex items-center gap-3.5">
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-muted-text font-medium px-3 py-1 rounded-full bg-surface border border-surface-border">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Work</span>
            </div>

            <Link
              href="#contact"
              aria-label="Hire Me - Jump to Contact section"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-95 transition-all duration-200 shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] border border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-surface border border-surface-border text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-accent" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#030712]/95 backdrop-blur-2xl border-b border-accent/20 px-6 py-6 transition-all duration-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-text mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for Freelance & Retainers</span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-1 transition-colors ${
                    activeSection === link.id ? "text-accent font-semibold" : "text-muted-text hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Hire Me - Jump to Contact section"
                className="mt-2 text-center py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Hire Me • Start a Project
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
