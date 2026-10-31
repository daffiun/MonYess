# MonYess Studio — Award-Winning Creative Landing Page

An Awwwards/FWA-style, editorial creative agency landing page built for **MonYess** (Amsterdam & Jakarta). Follows the pacing, interaction design, and fluid typographic weight of European creative studios (such as lamalama.com), while fitting directly into the MonYess ecosystem.

---

## 🎨 Tech Stack & Architecture

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Fluid Clamp Typography + Custom Design Tokens
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) (60fps momentum scrolling with `prefers-reduced-motion` detection)
- **Animation**: CSS Micro-interactions, infinite marquees, custom lerp cursor, and responsive layout scaling
- **Icons**: Lucide React

---

## 📂 Component Structure

All landing page code is isolated cleanly inside `src/features/landing/`:

```
src/features/landing/
├── content.ts                   # 🌟 Single source of truth for all copy, images, and projects
├── pages/
│   └── LandingPage.tsx          # Main orchestrator & Lenis smooth scroll provider
└── components/
    ├── Preloader.tsx            # 0% -> 100% counter with curtain reveal
    ├── CustomCursor.tsx         # Organic RAF lerp follower with "VIEW"/"PLAY" text
    ├── ScrollProgressBar.tsx    # Minimal top progress indicator (#CCFF00)
    ├── Navbar.tsx               # Fixed header with roll-over buttons & mobile drawer
    ├── ChapterNav.tsx           # Floating vertical side chapter navigation
    ├── ProjectModal.tsx         # Multi-step project brief builder (chips + validation)
    ├── ShowreelModal.tsx        # Fullscreen looping showreel with playback controls
    │
    ├── HeroSection.tsx          # 01. Video background, fluid 8-14vw headline & showreel controller
    ├── IntroSection.tsx         # 02. [ We are MONYESS ] statement & doctrine
    ├── FeaturedWorkSection.tsx  # 03. 6 selected cases with tags, awards & links
    ├── PitchdeckSection.tsx     # 04. 3-slide interactive blueprint preview
    ├── WhatWeDoSection.tsx      # 05. 3-column service matrix with hover image reveal & hotline
    ├── HappyClientsSection.tsx  # 06. Infinite horizontal logo marquee
    ├── CultureTeaserSection.tsx # 07. Amsterdam & Jakarta roots with overlapping photography
    ├── WhoWeAreSection.tsx      # 08. "Small team. Big energy. No fluff." 3-image collage
    ├── OurVibeSection.tsx       # 09. "Rock 'n roll minds with warm hearts" visual banner
    ├── CoreValuesSection.tsx    # 10. 4 core value cards with interactive hover states
    ├── WhatWeBelieveSection.tsx # 11. "All in or nothing." manifesto
    ├── TheWorkSection.tsx       # 12. "We design brands people feel" tall portrait
    ├── AwardsSection.tsx        # 13. High-contrast awards table (Awwwards, FWA, CSSDA, Webby)
    ├── ClientsHeartSection.tsx  # 14. Reverse marquee for sustainability & public initiatives
    ├── ContactSection.tsx       # 15. Hotline with hover partner avatar + CTAs
    └── FooterSection.tsx        # 16. Giant MONYESS wordmark, sitemap & live timezone clocks
```

---

## 🛠️ How to Swap Content, Fonts & Colors

### 1. Update Copy, Projects & Assets
Edit `src/features/landing/content.ts`. You do not need to touch JSX files to change:
- Brand name, locations, coordinates, phone numbers, and Telegram links
- Featured projects, client names, awards, and case study links
- Pitchdeck slides and service listings
- Core values and manifesto statements

### 2. Update Colors & Design Tokens
Edit `apps/web/tailwind.config.js`:
- `colors.accent.DEFAULT`: Default accent color is **Electric Lime** (`#CCFF00`). You can swap it to electric orange (`#FF5500`), cyan (`#00F0FF`), or any brand hex.
- `colors.brand.black`: Dark canvas background (`#070708`).

### 3. Update Fonts
Fonts are loaded in `apps/web/index.html`:
- Display Font: `Syne` (Weights 600, 700, 800, 900)
- Body Font: `Plus Jakarta Sans`
- Monospace / Eyebrows: `Space Grotesk`

To swap to another display font (e.g. `Clash Display`, `Cabinet Grotesk`), change the Google Fonts `<link>` in `index.html` and update `fontFamily.display` in `tailwind.config.js`.

---

## 🚀 Running the Development Server

From the root directory:
```bash
pnpm --filter @financebot/web dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
