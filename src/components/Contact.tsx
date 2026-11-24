"use client";

import React, { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import {
  Mail,
  Send,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { SOCIALS } from "@/data/socials";
import {
  InstagramIcon,
  ThreadsIcon,
  XIcon,
  DiscordIcon,
  openDiscord,
  ToastNotification,
} from "./SocialIcons";
import { safeTrack } from "@/lib/analytics";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "reels",
    budget: "flexible",
    message: "",
  });

  const showToast = (msg: string, type: string) => {
    setToastMessage(msg);
    setCopiedType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      setCopiedType(null);
    }, 2500);
  };

  const copyToClipboard = async (text: string, label: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`, type);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast(`${label} copied to clipboard!`, type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: In Phase 2, connect this to Formspree, Resend, or EmailJS
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <SectionWrapper
      id="contact"
      badge="Let's Collaborate"
      title="Ready to Elevate Your Visual Content?"
      subtitle="Whether you need on-ground camera production in Nagpur or high-converting short-form editing, let's talk about your project goals."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Communication Channels & Socials */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Connect Directly
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                Reach out on your preferred platform or drop a direct email inquiry.
              </p>
            </div>

            <div className="space-y-3">
              {/* 1. Email Channel with Direct Mailto + Copy Button */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] transition-all group">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={SOCIALS.email.mailto}
                    onClick={() => safeTrack("contact_click", { channel: "email" })}
                    aria-label={`Send inquiry email to ${SOCIALS.email.address}`}
                    className="flex items-center gap-3.5 flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase font-bold text-accent tracking-wider">
                        Direct Email
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                        {SOCIALS.email.address}
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(SOCIALS.email.address, "Email address", "email");
                        safeTrack("contact_click", { channel: "email" });
                      }}
                      title="Copy email address"
                      aria-label="Copy email address"
                      className="p-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-accent hover:text-accent text-zinc-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {copiedType === "email" ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={SOCIALS.email.mailto}
                      onClick={() => safeTrack("contact_click", { channel: "email" })}
                      aria-label="Open email client"
                      className="p-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-accent text-zinc-400 hover:text-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. Discord Channel with Automatic Open + Fallback + Copy ID Button */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] transition-all group">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      openDiscord();
                      safeTrack("contact_click", { channel: "discord" });
                    }}
                    aria-label="Open Discord (User ID: 1108795562758770828)"
                    className="flex items-center gap-3.5 flex-1 min-w-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform shrink-0">
                      <DiscordIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="block text-[10px] uppercase font-bold text-accent tracking-wider">
                          Discord
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/15 text-accent font-mono border border-accent/30">
                          Auto App Open
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                        ID: {SOCIALS.discord.userId}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(SOCIALS.discord.userId, "Discord User ID", "discord");
                        safeTrack("contact_click", { channel: "discord" });
                      }}
                      title="Copy Discord User ID"
                      aria-label="Copy Discord User ID"
                      className="p-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-accent hover:text-accent text-zinc-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {copiedType === "discord" ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openDiscord();
                        safeTrack("contact_click", { channel: "discord" });
                      }}
                      title="Launch Discord"
                      aria-label="Launch Discord"
                      className="p-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-accent text-zinc-400 hover:text-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Instagram Channel */}
              <a
                href={SOCIALS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => safeTrack("contact_click", { channel: "instagram" })}
                aria-label={`Instagram Profile (${SOCIALS.instagram.handle})`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                    <InstagramIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-accent tracking-wider">
                      Instagram
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {SOCIALS.instagram.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* 4. Threads Channel */}
              <a
                href={SOCIALS.threads.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => safeTrack("contact_click", { channel: "threads" })}
                aria-label={`Threads Profile (${SOCIALS.threads.handle})`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                    <ThreadsIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-accent tracking-wider">
                      Threads
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {SOCIALS.threads.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* 5. X (Twitter) Channel */}
              <a
                href={SOCIALS.x.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => safeTrack("contact_click", { channel: "x" })}
                aria-label={`X Profile (${SOCIALS.x.handle})`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                    <XIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-accent tracking-wider">
                      X (Twitter)
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {SOCIALS.x.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* Location Badge */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Studio Location
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-zinc-200">
                    Nagpur, Maharashtra, India (IST)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Project Inquiry Form & Visible Email Fallback */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              Send a Project Brief
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6">
              Share details about your upcoming video, timeline, and vision. I will respond with a tailored proposal.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-accent/10 border border-accent/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Inquiry Received!</h4>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                  Thank you! I will review your requirements and reach out via email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Service Needed
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <option value="reels" className="bg-[#020308]">Short-Form & Reels Editing</option>
                      <option value="production" className="bg-[#020308]">End-to-End Production & Cameraman</option>
                      <option value="commercial" className="bg-[#020308]">Commercial / Brand Film</option>
                      <option value="longform" className="bg-[#020308]">Long-Form Commercial & Narrative</option>
                      <option value="retainer" className="bg-[#020308]">Monthly Video Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <option value="flexible" className="bg-[#020308]">Flexible / Exploring</option>
                      <option value="starter" className="bg-[#020308]">₹15,000 – ₹35,000</option>
                      <option value="growth" className="bg-[#020308]">₹35,000 – ₹75,000</option>
                      <option value="commercial" className="bg-[#020308]">₹75,000+</option>
                      <option value="international" className="bg-[#020308]">$500 – $2,500+ (USD)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Project Vision & Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your video vision, target audience, reference links, and timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors resize-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    className="btn-primary-pill w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Send className="w-4 h-4 text-[#020308]" />
                    <span>Send Project Inquiry</span>
                  </button>

                  <span className="text-[11px] text-zinc-500 text-center sm:text-right">
                    Response typically in 2–4 hours
                  </span>
                </div>
              </form>
            )}

            {/* Visible Fallback Contact next to/below form as instructed */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 bg-white/[0.02] p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>Prefer direct email? Contact me at:</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={SOCIALS.email.mailto}
                  className="font-semibold text-white hover:text-accent transition-colors underline decoration-accent/40 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  {SOCIALS.email.address}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(SOCIALS.email.address, "Email address", "fallback-email")}
                  title="Copy email address"
                  aria-label="Copy email address"
                  className="p-1.5 rounded-lg bg-[#050B2E] border border-white/10 hover:border-accent hover:text-accent transition-all text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {copiedType === "fallback-email" ? (
                    <Check className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} visible={toastVisible} />
    </SectionWrapper>
  );
}
