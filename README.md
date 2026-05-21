# FinanceBot

Personal Finance Tracker for Indonesian Users.

## Project Structure
- `apps/web`: React + Vite + TypeScript frontend with Tailwind CSS.
- `apps/worker`: Cloudflare Workers for Telegram Bot and backend placeholder.
- `packages/shared`: Shared TypeScript types and utilities.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Lucide React, Recharts.
- Backend/Auth: Supabase (Pending Fase 2).
- Bot/Serverless: Cloudflare Workers.

## Development
This project uses `pnpm` workspaces.

### Prerequisites
- Node.js (Latest LTS)
- pnpm (v9+ recommended)

### Setup
```bash
# 1. Install dependencies
pnpm install

# (Optional) If you get an esbuild or sharp error, run:
pnpm approve-builds
```

### Running the Project
```bash
# Run the Web Prototype
pnpm dev:web

# Run the Cloudflare Worker (Placeholder)
pnpm dev:worker
```

## Phases
- [x] Fase 0: UI Direction Confirmation (Refined Option B + Gamification)
- [x] Fase 1: Static Visual Prototype & Monorepo Setup (Mock Data, React Router)
- [ ] Fase 2: Database Schema & Supabase Setup (NEXT)
- [ ] Fase 3: Authentication Implementation
- [ ] Fase 4: Core CRUD Implementation
- [ ] Fase 5: Telegram Bot Integration
- [ ] Fase 6: Reports & Advanced Features (Detailed Gamification Logic)
- [ ] Fase 7: Deployment & Final Polish
