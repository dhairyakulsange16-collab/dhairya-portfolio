import React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  badge,
  title,
  subtitle,
  align = "left",
  children,
  className,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", className)}
      {...props}
    >
      {(badge || title || subtitle) && (
        <div
          className={cn(
            "mb-12 md:mb-16",
            align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-3xl"
          )}
        >
          {badge && (
            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4 bg-white/[0.04] border border-white/10 text-accent backdrop-blur-md", align === "center" && "mx-auto")}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {badge}
            </div>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light sm:font-normal tracking-[-0.03em] text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-base sm:text-lg text-muted-text font-light sm:font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
