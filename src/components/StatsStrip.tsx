"use client";

import React, { useEffect, useState, useRef } from "react";
import { PROJECTS, CATEGORY_ORDER } from "@/data/projects";
import { Award, Film, Users, Zap } from "lucide-react";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function Counter({ end, suffix = "", duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const step = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="font-mono">
      {count}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  const totalProjects = PROJECTS.length;

  const stats = [
    {
      value: totalProjects,
      suffix: "",
      label: "Portfolio Projects",
      sublabel: "Films in the work archive",
      icon: Film,
    },
    {
      value: 40,
      suffix: "+",
      label: "Brands",
      sublabel: "Across retail, SaaS & corporate",
      icon: Users,
    },
    {
      value: 2,
      suffix: "+ Yrs",
      label: "Production Experience",
      sublabel: "Shooting, editing & motion graphics",
      icon: Award,
    },
    {
      value: CATEGORY_ORDER.length,
      suffix: "",
      label: "Categories",
      sublabel: "Across the work archive",
      icon: Zap,
    },
  ];

  return (
    <section className="py-16 border-y border-white/[0.06] bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-accent mb-3 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-light sm:font-normal text-white tracking-[-0.02em] text-gradient-cyan">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-zinc-200 mt-2">
                  {stat.label}
                </span>
                <span className="text-[11px] text-muted-text mt-0.5 font-light">
                  {stat.sublabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
