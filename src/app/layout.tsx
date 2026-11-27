import type { Metadata } from "next";
import "./globals.css";
import "./studio.css";

import { GlassBackdrop } from "@/components/GlassBackdrop";
import { SOCIALS } from "@/data/socials";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/lib/config";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  keywords: [
    "Video Editor",
    "Cameraman",
    "Reels Editor",
    "Content Creator",
    "Nagpur Video Editor",
    "Commercial Video Production",
    "Short-Form Video",
    "Commercial Video Editing",
    "Dhairya Portfolio",
    SOCIALS.instagram.handle.slice(1),
    SOCIALS.x.handle.slice(1),
  ],
  authors: [{ name: "Dhairya", url: SITE_URL }],
  creator: "Dhairya",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: "High-retention reels, brand commercials, and end-to-end video production.",
    creator: "@editbydhiru",
    site: "@editbydhiru",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dhairya",
    jobTitle: "Video Editor & Cameraman",
    description:
      "Professional video editor and cameraman with ~2 years of experience partnering with 40+ brands in Nagpur, India and globally.",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image.png`,
    email: `mailto:${SOCIALS.email.address}`,
    sameAs: [
      SOCIALS.instagram.url,
      SOCIALS.threads.url,
      SOCIALS.x.url,
      SOCIALS.discord.url,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Video Editing",
      "Cinematography",
      "Short-Form Content",
      "Instagram Reels",
      "Motion Graphics",
      "DaVinci Resolve",
      "Adobe Premiere Pro",
      "Adobe After Effects",
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-transparent text-zinc-100 antialiased selection:bg-accent selection:text-black relative">
        <GlassBackdrop />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
