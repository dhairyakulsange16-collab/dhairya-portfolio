# Dhairya | Video Editor, Cameraman & Content Creator Portfolio

A modern, cinematic portfolio website built for **Dhairya** — Video Editor & Cameraman based in Nagpur, India. Showcasing 43 authentic commercial productions, viral short-form reels, brand campaigns, and on-location cinematographic films.

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & Lucide React Icons
- **Design Tokens:** Deep Navy (`#030712`, `#050B2E`), Electric Blue (`#1E5BFF`), Neon Cyan (`#22D3EE`)
- **Deployment Target:** [Vercel](https://vercel.com/)

---

## Features

- **Authentic Footage:** Sourced 100% from Google Drive client archives across 7 production categories.
- **Dynamic Tagline Hero:** Animated PFP GIF brand anchor with soft cyan glow ring, live typewriter tagline, and dual CTAs.
- **Featured Commercial Showreel:** Large cinematic widescreen player with muted autoplay loop and click-to-open lightbox.
- **Adaptive Layouts:** Vertical 9:16 reels in snap-scroll horizontal carousels; horizontal 16:9 films in responsive multi-column grids.
- **Smart Single-Video Playback:** Autoplay on hover with neon cyan glow, coordinated so only one video plays at a time.
- **Fullscreen Lightbox Player:** Audio controls, scrub bar, responsive controls, and keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`, `Space`, `M`).
- **Interactive Socials & Discord Deep-Linking:** One-click launch for desktop/mobile Discord with automatic 1.5s web fallback, plus copy-to-clipboard toasts for Discord ID and Email.
- **Performance & SEO:** Full Open Graph images, JSON-LD `Person` schema, `sitemap.xml`, and `robots.txt`.

---

## Getting Started Locally

### Prerequisites

Ensure you have **Node.js 18+** installed on your system.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dhairya-portfolio.git

# Navigate into the project directory
cd dhairya-portfolio

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### Building for Production

```bash
npm run build
```

This compiles the static pages and verifies TypeScript types with 0 errors.

---

## Project Structure

```
├── public/
│   └── assets/             # Web-optimized MP4s, poster JPEGs & brand assets
├── src/
│   ├── app/
│   │   ├── globals.css     # Theme tokens & neon glow utilities
│   │   ├── layout.tsx      # Metadata, Open Graph & JSON-LD Person schema
│   │   ├── page.tsx        # Single-page layout composition
│   │   ├── robots.ts       # Robots.txt generator
│   │   └── sitemap.ts      # Sitemap generator
│   ├── components/         # Hero, WorkSections, Showreel, Services, Lightbox, etc.
│   └── data/
│       ├── projects.ts     # Typed catalog of 43 Drive projects
│       └── socials.ts      # Central source of truth for social handles
└── README.md
```

---

## License

Crafted for Dhairya. All rights reserved.
