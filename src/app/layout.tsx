import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SOCIALS } from "@/data/socials";
import { GlassBackdrop } from "@/components/GlassBackdrop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dhairya-portfolio.vercel.app"),
  title: "Dhairya | Video Editor, Cameraman & Content Creator",
  description:
    "Portfolio of Dhairya — Video Editor & Cameraman based in Nagpur, India. Crafting high-retention short-form reels, commercial films, and end-to-end video production for 40+ brands.",
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
    "editby.dhiru",
    "editbydhiru",
  ],
  authors: [{ name: "Dhairya", url: "https://dhairya-portfolio.vercel.app" }],
  creator: "Dhairya",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dhairya-portfolio.vercel.app",
    title: "Dhairya | Video Editor, Cameraman & Content Creator",
    description:
      "Crafting high-retention short-form reels, brand commercials, and end-to-end video production for 40+ brands worldwide.",
    siteName: "Dhairya Portfolio",
    images: [
      {
        url: "/assets/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dhairya - Video Editor & Content Creator Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhairya | Video Editor, Cameraman & Content Creator",
    description: "High-retention reels, brand commercials, and end-to-end video production.",
    creator: "@editbydhiru",
    site: "@editbydhiru",
    images: ["/assets/brand/og-image.png"],
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
    url: "https://dhairya-portfolio.vercel.app",
    image: "https://dhairya-portfolio.vercel.app/assets/brand/og-image.png",
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
    <html lang="en" className={`dark bg-[#020308] ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-transparent text-zinc-100 antialiased selection:bg-accent selection:text-black relative">
        <GlassBackdrop />
        {children}
      </body>
    </html>
  );
}
