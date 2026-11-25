# Diwakar Reddy — Next.js 14 Editorial Portfolio

A high-performance, dark editorial portfolio showcasing engineering projects, research, and technical credentials. Built with Next.js 14 App Router, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lenis smooth scrolling, and Three.js 3D interactive rooms.

## Core Highlights

- **Next.js 14 App Router & Performance Optimization:** Dynamic lazy loading (`next/dynamic`) of Three.js 3D rooms to minimize initial JS bundle size (~80 kB route size, 208 kB First Load JS). Optimized with `next/font/google` and `next/image`.
- **Three.js WebGL Interactive Rooms:** Dedicated 3D spatial environments for each featured project:
  - **Adenver AI:** Holographic developer command center with procedural 3D orrery, orbital architecture matrix, and speech synthesis voice tour.
  - **Smart ICU Monitoring:** Clinical ICU bay with telemetry monitor, ventilator, and critical alert simulation.
  - **ETS Expense Tracking:** Agribusiness operations hangar with financial ledger filters.
- **Micro-Interactions & Audio:** Synthesized Web Audio API mechanical feedback (`AudioClick.ts`), tactile 3D card tilt (`CardTilt.tsx`), text scramble animations, and smooth magnetic buttons.
- **Developer CLI Terminal Drawer (`Ctrl+K` or `~`):** Interactive terminal drawer supporting commands (`help`, `projects`, `skills`, `contact`, `resume`, `clear`).

## Project Structure

```
Diwakar portfolio/
├── public/
│   ├── certificates/
│   │   ├── icaan-2026-presentation.pdf  # ICAAN 2026 conference presentation
│   │   ├── ijircce-publication.pdf      # Peer-reviewed research paper (IJIRCCE)
│   │   └── NPTEL_IoT_Certificate.pdf    # NPTEL IIT Kharagpur certificate
│   ├── Diwakar_Reddy_Resume.pdf         # Official resume
│   ├── portrait.jpg                     # Hero portrait
│   ├── about-portrait.jpg               # About section portrait
│   └── sunset-lifestyle.jpg             # Landscape banner
├── src/
│   ├── app/
│   │   ├── globals.css                  # Global styles & custom scrollbars
│   │   ├── layout.tsx                   # Root layout, Google fonts & metadata
│   │   └── page.tsx                     # Main page orchestration & sections (01 to 09)
│   ├── components/
│   │   ├── rooms/                       # Three.js 3D WebGL rooms & CSS3D fallbacks
│   │   │   ├── AdenverRoom.tsx
│   │   │   ├── EtsRoom.tsx
│   │   │   ├── IcuRoom.tsx
│   │   │   ├── RoomShell.tsx
│   │   │   └── ThreeRoomCanvas.tsx
│   │   ├── AboutScrollReveal.tsx        # Scroll-linked portrait reveal
│   │   ├── AnimatedCounter.tsx          # GSAP count-up numbers
│   │   ├── AskMyAI.tsx                  # Grounded AI chat assistant modal & drawer
│   │   ├── AudioClick.ts                # Web Audio API sound generator
│   │   ├── CardTilt.tsx                 # Specular glare 3D card tilt
│   │   ├── ContactModal.tsx             # Slide-in contact dialog
│   │   ├── CustomCursor.tsx             # Trailing circular cursor
│   │   ├── EducationSection.tsx         # Academic background timeline (B.E., PU, 10th)
│   │   ├── Footer.tsx                   # Footer & CTA
│   │   ├── Hero.tsx                     # Fit-text wordmark & hero metadata
│   │   ├── IcuSimulator.tsx             # Interactive Smart ICU Monitoring virtual bedside console
│   │   ├── IntroApproach.tsx            # Approach phases (Discover, Design, Deliver)
│   │   ├── Navbar.tsx                   # Sticky nav with live IST time & sound toggle
│   │   ├── NavMenuOverlay.tsx           # Fullscreen navigation overlay
│   │   ├── Project3DRoomModal.tsx       # Dynamic modal wrapper for 3D rooms
│   │   ├── ProjectGrid.tsx              # Project cards, proof links & details drawer
│   │   ├── SkillsGrid.tsx               # Categorized skills with proficiency tiers
│   │   ├── StatsBar.tsx                 # Profile Snapshot metrics
│   │   ├── TerminalDrawer.tsx           # Interactive developer CLI drawer
│   │   ├── TimelineList.tsx             # Projects & Work and Achievements timeline
│   │   └── VoiceParallaxSection.tsx     # Editorial statement with SVG signature
│   ├── data/
│   │   └── portfolio.ts                 # Typed data store (projects, education, awards, skills)
│   └── lib/
│       ├── chatKnowledge.ts             # Dynamic plain-text portfolio knowledge base generator
│       ├── icuDemoLogic.ts              # Transparent rule-based clinical scoring model
│       └── offlineAnswer.ts             # Grounded deterministic offline fallback engine
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Local Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production Build & Type Check:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

## Ask My AI Configuration

The portfolio features a grounded "Ask My AI" chat assistant that only answers questions from portfolio data (`src/data/portfolio.ts`).

1. **Get an Anthropic API Key:**
   - Sign up at [https://console.anthropic.com/](https://console.anthropic.com/) and create an API key.
2. **Configure Environment Variables (`.env`):**
   ```env
   # Server-side only (never prefix with NEXT_PUBLIC_)
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   CHAT_MODEL=claude-haiku-5-5

   # Optional: Site URL (defaults to Vercel production/preview URL or http://localhost:3000)
   NEXT_PUBLIC_SITE_URL=
   ```
3. **Built-in Protections & Fallbacks:**
   - **Grounded System Prompt:** Strict defense against prompt injection, persona changes, and out-of-scope code generation.
   - **Rate Limiting:** In-memory rate limiting allows up to 8 requests/minute and 40 requests/day per IP (resets per serverless instance lifecycle; for multi-region persistent limits, connect Upstash Redis).
   - **Offline Fallback Engine (`offlineAnswer.ts`):** Automatically answers starter questions if `ANTHROPIC_API_KEY` is missing or when rate limits are reached.

