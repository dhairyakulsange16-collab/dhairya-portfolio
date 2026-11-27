"use client";

import React, { useState, useRef, useEffect } from "react";
import { SectionWrapper } from "./SectionWrapper";
import {
  Mail,
  Send,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
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

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormDataState {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const SERVICES = [
  "Short-Form & Reels Editing",
  "End-to-End Production & Cameraman",
  "Commercial / Brand Film",
  "Long-Form Commercial & Narrative",
  "Monthly Video Retainer",
] as const;

const BUDGETS = [
  "Flexible / Exploring",
  "₹15,000 – ₹35,000",
  "₹35,000 – ₹75,000",
  "₹75,000+",
  "$500 – $2,500+ (USD)",
] as const;

const COOLDOWN_MS = 60 * 1000; // 60 seconds
const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Sanitizes input strings by stripping HTML tags and control characters
 */
function sanitizeInput(str: string): string {
  return str
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Validates standard email address format
 */
function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email);
}

export function Contact() {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    service: SERVICES[0],
    budget: BUDGETS[0],
    message: "",
  });

  const [botcheck, setBotcheck] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submittedFirstName, setSubmittedFirstName] = useState<string>("there");

  // Record when the form was mounted for minimum fill time spam check (3 seconds)
  const formRenderTimeRef = useRef<number>(Date.now());

  // Toast notification state
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    formRenderTimeRef.current = Date.now();
  }, []);

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
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast(`${label} copied to clipboard!`, type);
    }
  };

  const handleInputChange = (
    field: keyof FormDataState,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      nextErrors.name = "Your name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 80) {
      nextErrors.name = "Name must be less than 80 characters.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Your email is required.";
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedMessage) {
      nextErrors.message = "Project vision and details are required.";
    } else if (trimmedMessage.length < 10) {
      nextErrors.message = "Please provide at least 10 characters detailing your vision.";
    } else if (trimmedMessage.length > 2000) {
      nextErrors.message = "Message must be under 2000 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submissions while loading
    if (status === "loading") return;

    setGeneralError(null);

    // 1. Client-side input validation
    if (!validateForm()) {
      return;
    }

    const sanitizedName = sanitizeInput(formData.name);
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedMessage = sanitizeInput(formData.message);

    // 2. Minimum fill time check: if submitted in under 3s, silently simulate success
    const elapsedMs = Date.now() - formRenderTimeRef.current;
    if (elapsedMs < 3000) {
      const firstName = sanitizedName.split(" ")[0] || "there";
      setSubmittedFirstName(firstName);
      setStatus("success");
      return;
    }

    // 3. Cooldown & Hourly limit check via localStorage
    try {
      const lastSentStr = localStorage.getItem("portfolio_form_last_sent");
      if (lastSentStr) {
        const lastSent = parseInt(lastSentStr, 10);
        if (Date.now() - lastSent < COOLDOWN_MS) {
          setGeneralError("Please wait a moment before sending another inquiry.");
          return;
        }
      }

      const historyStr = localStorage.getItem("portfolio_form_history");
      const history: number[] = historyStr ? JSON.parse(historyStr) : [];
      const recentHistory = history.filter(
        (ts) => Date.now() - ts < RATE_LIMIT_WINDOW_MS
      );
      if (recentHistory.length >= RATE_LIMIT_COUNT) {
        setGeneralError(
          `Submission limit reached for this hour. Please contact me directly at ${SOCIALS.email.address}`
        );
        return;
      }
    } catch {
      // Storage access blocked or restricted (e.g. private browsing) — proceed
    }

    // 4. Check for public access key
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.warn(
        "Web3Forms access key is missing. Please set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env.local or Vercel environment variables."
      );
      setGeneralError(
        `Contact form is currently in setup mode. Please email me directly at ${SOCIALS.email.address}`
      );
      setStatus("error");
      return;
    }

    // 5. Submit to Web3Forms directly from the browser
    setStatus("loading");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const payload = {
        access_key: accessKey,
        subject: `New Project Inquiry from ${sanitizedName} (${formData.service})`,
        from_name: "Portfolio Contact Form",
        name: sanitizedName,
        email: sanitizedEmail,
        service: formData.service,
        budget: formData.budget,
        message: sanitizedMessage,
        botcheck: botcheck ? "true" : "",
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success === true) {
        const firstName = sanitizedName.split(" ")[0] || "there";
        setSubmittedFirstName(firstName);
        setStatus("success");
        safeTrack("contact_form_success", { service: formData.service });

        // Update localStorage cooldowns
        try {
          const now = Date.now();
          localStorage.setItem("portfolio_form_last_sent", now.toString());
          const historyStr = localStorage.getItem("portfolio_form_history");
          const history: number[] = historyStr ? JSON.parse(historyStr) : [];
          const recentHistory = history.filter(
            (ts) => now - ts < RATE_LIMIT_WINDOW_MS
          );
          recentHistory.push(now);
          localStorage.setItem(
            "portfolio_form_history",
            JSON.stringify(recentHistory)
          );
        } catch {
          // Ignore storage errors
        }
      } else {
        console.error(
          "Web3Forms submission failed:",
          data?.message || "Unknown error"
        );
        setStatus("error");
        setGeneralError(
          `Something went wrong. Please try again, or email me directly at ${SOCIALS.email.address}`
        );
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        err instanceof Error && err.name === "AbortError";
      if (isAbort) {
        console.error("Web3Forms request timed out after 10s");
        setGeneralError(
          `The request timed out. Please try again, or email me directly at ${SOCIALS.email.address}`
        );
      } else {
        console.error(
          "Web3Forms network error:",
          err instanceof Error ? err.message : err
        );
        setGeneralError(
          `Something went wrong. Please try again, or email me directly at ${SOCIALS.email.address}`
        );
      }
      setStatus("error");
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      service: SERVICES[0],
      budget: BUDGETS[0],
      message: "",
    });
    setBotcheck(false);
    setErrors({});
    setGeneralError(null);
    setStatus("idle");
    formRenderTimeRef.current = Date.now();
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
                    aria-label={`Open Discord (User ID: ${SOCIALS.discord.userId})`}
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

        {/* Right Column: Project Inquiry Form / Confirmation Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 relative">
            {/* Live announcer for accessibility status updates */}
            <div className="sr-only" aria-live="polite">
              {status === "loading"
                ? "Sending your inquiry..."
                : status === "success"
                ? "Your inquiry was sent successfully."
                : generalError || ""}
            </div>

            {status === "success" ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-accent/[0.07] border border-accent/30 text-center space-y-4 shadow-[0_0_36px_rgba(34,211,238,0.15)]">
                <div className="w-14 h-14 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(34,211,238,0.35)]">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Thank you, {submittedFirstName}!
                </h4>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Your brief is on its way. I will review your requirements and reply within 2–4 hours.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-accent hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span>Send another inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  Send a Project Brief
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                  Share details about your upcoming video, timeline, and vision. I will respond with a tailored proposal.
                </p>

                {/* Error Banner if submission failed or rate limit hit */}
                {generalError && (
                  <div
                    role="alert"
                    className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                      <span>
                        Something went wrong. Please try again, or email me directly at{" "}
                        <a
                          href={SOCIALS.email.mailto}
                          className="font-semibold text-white underline decoration-accent/60 hover:text-accent underline-offset-2"
                        >
                          {SOCIALS.email.address}
                        </a>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          SOCIALS.email.address,
                          "Email address",
                          "error-email"
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium text-[11px] shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {copiedType === "error-email" ? (
                        <Check className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy email</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot field for bot spam protection */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    id="contact-botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    style={{ display: "none" }}
                    checked={botcheck}
                    onChange={(e) => setBotcheck(e.target.checked)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        disabled={status === "loading"}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 ${
                          errors.name
                            ? "border-rose-500/70 focus:border-rose-500"
                            : "border-white/10 focus:border-accent"
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                      >
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. rahul@brand.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        disabled={status === "loading"}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 ${
                          errors.email
                            ? "border-rose-500/70 focus:border-rose-500"
                            : "border-white/10 focus:border-accent"
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service Needed Dropdown */}
                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                      >
                        Service Needed
                      </label>
                      <select
                        id="contact-service"
                        name="service"
                        value={formData.service}
                        onChange={(e) => handleInputChange("service", e.target.value)}
                        disabled={status === "loading"}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                      >
                        {SERVICES.map((srv) => (
                          <option key={srv} value={srv} className="bg-[#020308] text-white">
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Estimated Budget Dropdown */}
                    <div>
                      <label
                        htmlFor="contact-budget"
                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                      >
                        Estimated Budget
                      </label>
                      <select
                        id="contact-budget"
                        name="budget"
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                        disabled={status === "loading"}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                      >
                        {BUDGETS.map((bgt) => (
                          <option key={bgt} value={bgt} className="bg-[#020308] text-white">
                            {bgt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Vision & Details */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                    >
                      Project Vision & Details *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="Tell me about your video vision, target audience, reference links, and timeline..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      disabled={status === "loading"}
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-500 transition-colors resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 ${
                        errors.message
                          ? "border-rose-500/70 focus:border-rose-500"
                          : "border-white/10 focus:border-accent"
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submission Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary-pill w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 text-[#020308] animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#020308]" />
                          <span>Send Project Inquiry</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-zinc-500 text-center sm:text-right">
                      Response typically in 2–4 hours
                    </span>
                  </div>
                </form>
              </div>
            )}

            {/* Visible Fallback Contact beneath form */}
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
                  onClick={() =>
                    copyToClipboard(
                      SOCIALS.email.address,
                      "Email address",
                      "fallback-email"
                    )
                  }
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
