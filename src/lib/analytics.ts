import { track } from "@vercel/analytics";

/**
 * Safe wrapper around Vercel Analytics track()
 * Silently catches errors so tracking failure never breaks clicks or user actions.
 * Ensures zero PII is sent.
 */
export function safeTrack(
  eventName: string,
  properties?: Record<string, string | number | boolean>
) {
  try {
    if (typeof window !== "undefined" && typeof track === "function") {
      track(eventName, properties);
    }
  } catch {
    // Fail silently to never interrupt user interaction
  }
}
