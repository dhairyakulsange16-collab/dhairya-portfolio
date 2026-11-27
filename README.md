# Dhairya | Video Editor, Cameraman & Content Creator Portfolio

A modern, cinematic portfolio website built for **Dhairya** — Video Editor & Cameraman based in Nagpur, India. Showcasing 45 authentic commercial productions, viral short-form reels, brand campaigns, and on-location cinematographic films.

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
- **Adaptive Layouts:** Vertical 9:16 reels in snap-scroll horizontal carousels; horizontal 16:9 films in responsive multi-column grids.
- **Smart Single-Video Playback:** Autoplay on hover with neon cyan glow, coordinated so only one video plays at a time.
- **Fullscreen Lightbox Player:** Audio controls, scrub bar, responsive controls, and keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`, `Space`, `M`).
- **Interactive Socials & Discord Deep-Linking:** One-click launch for desktop/mobile Discord with automatic 1.5s web fallback, plus copy-to-clipboard toasts for Discord ID and Email.
- **Performance & SEO:** Full Open Graph images, JSON-LD `Person` schema, `sitemap.xml`, and `robots.txt`.

---

## Catalog

The gallery and project metrics read from `src/data/projects.ts`. Run the following read-only check from the repository root for the current Drive, site and approved local counts:

```powershell
python tools/verify_drive.py
```

Drive records are matched against the local mapping in `tools`. Ash Frames and Nishant Reel are the approved local exceptions listed in `tools/manual-sources.json`. The media pipeline adds missing Drive entries and preserves existing catalog entries. Originals remain outside the public assets directory.

## Getting Started Locally

### Prerequisites

Ensure you have **Node.js 18+** installed on your system.

### Installation

```bash
# Clone the repository
git clone https://github.com/dhairyakulsange16-collab/dhairya-portfolio.git

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

## Contact Form Setup

The portfolio's **"Send a Project Brief"** contact form submits inquiries directly from the browser to [Web3Forms](https://web3forms.com/) (using their free client-side API, avoiding server-side IP blocks).

### 1. Environment Variable Configuration
Get a free access key from [web3forms.com](https://web3forms.com/) and configure it:

- **Local Development (`.env.local`):**
  ```env
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
  ```
  *(See `.env.example` for the template. `.env.local` is ignored by Git.)*

- **Vercel Deployment:**
  1. Open your project on Vercel Dashboard.
  2. Navigate to **Settings** > **Environment Variables**.
  3. Add a new variable:
     - **Key:** `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
     - **Value:** `your-web3forms-access-key`
     - **Environments:** Check **Production**, **Preview**, and **Development**.
  4. **Redeploy** the project (or push a new commit) — `NEXT_PUBLIC_` variables are baked into static assets at build time.

### 2. Client-Side Features & Spam Protection
- **Direct Browser Submission:** Sends `POST` requests to `https://api.web3forms.com/submit` with standard CORS headers.
- **Honeypot Protection:** Hidden `botcheck` field catches automated bot submissions.
- **Minimum Fill Time:** Rejects submissions completed in under 3 seconds to deter scripts.
- **Client Cooldown & Hourly Limits:** Enforces a 60-second cooldown between messages and a maximum of 3 submissions per hour per browser via `localStorage`.
- **Inline Validation & Accessible States:** Provides inline error badges with `aria-invalid` / `aria-describedby`, a disabled loading spinner state, and an accessible confirmation panel with a reset option.

---

## Project Structure

```
├── public/
│   └── assets/             # Web-optimized MP4s, poster JPEGs & brand assets
├── src/
│   ├── app/
│   │   ├── globals.css     # Theme tokens, glassmorphism utilities & keyframes
│   │   ├── layout.tsx      # Metadata, Open Graph & JSON-LD Person schema
│   │   ├── page.tsx        # Single-page layout composition
│   │   ├── robots.ts       # Robots.txt generator
│   │   └── sitemap.ts      # Sitemap generator
│   ├── components/         # Hero, WorkSections, Services, Lightbox, etc.
│   └── data/
│       ├── projects.ts     # Typed catalog of portfolio projects
│       └── socials.ts      # Central source of truth for social handles
├── tools/                  # Pipeline and verification toolchain
│   ├── process_pipeline.py # Media compression and poster extraction pipeline
│   ├── verify_drive.py     # 1:1 Parity verifier between Drive archive & /public/assets
│   ├── all_drive_files.json, drive_with_local.json, local_mapped_drive_files.json
│   ├── test-backdrop.js    # Automated headless Chrome test for background transforms
│   └── test-marquee.js     # Continuous marquee train loop verifier
└── README.md
```

---

## Credits

Background design: BRIX Templates, Gradient Backgrounds (Figma Community, free)

---

## License

Crafted for Dhairya. All rights reserved.
