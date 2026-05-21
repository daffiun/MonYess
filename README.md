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
- [x] Fase 2: Database Schema & Supabase Setup (RLS, RPCs, Gamification tables)
- [x] Fase 3: Authentication Implementation (Supabase Auth, Protected Routes)
- [x] Fase 4: Core CRUD Implementation (Accounts, Categories, Transactions, Balances)
- [x] Fase 5: Live Dashboard & Reports (Dynamic Charts, Real Stats, Reports Page)
- [x] Fase 6: Planning & Advanced Features (Budgets, Goals, Debts, Recurring)
- [x] Fase 7: Telegram Bot Integration (Cloudflare Worker, Linking, Command Parser)
- [ ] Fase 8: Deployment & Final Polish (NEXT)

## Integrasi Telegram (Fase 7)
MonYess mendukung input transaksi via Telegram. Fitur ini di-handle oleh Cloudflare Worker (`apps/worker`).

### 1. Setup Bot Telegram
1. Buka Telegram dan cari **@BotFather**.
2. Ketik `/newbot`, lalu ikuti instruksi untuk membuat bot baru.
3. Simpan **Bot Token** yang diberikan oleh BotFather.

### 2. Setup Environment Worker
Buka file `apps/worker/.dev.vars` dan pastikan data berikut sudah terisi:
```env
TELEGRAM_BOT_TOKEN="token_dari_botfather"
TELEGRAM_WEBHOOK_SECRET="bebas_isi_password_rahasia_untuk_webhook"
TELEGRAM_WEBHOOK_SETUP_SECRET="bebas_isi_password_untuk_register_webhook"
SUPABASE_URL="url_project_supabase_kamu"
SUPABASE_SERVICE_ROLE_KEY="kunci_rahasia_service_role_supabase"
WEBAPP_URL="http://localhost:5173"
```

### 3. Menjalankan Worker Lokal
Karena Telegram butuh URL publik untuk webhook, gunakan alat seperti `ngrok` atau Cloudflare Tunnels (terintegrasi di Wrangler) saat testing lokal.
```bash
# Jalankan worker di terminal terpisah
pnpm dev:worker
```

*(Catatan: Webhook Telegram tidak bisa mengarah langsung ke `localhost`. Kamu harus melakukan setup webhook ke URL publik yang di-generate oleh ngrok/wrangler, atau men-deploy worker ini ke Cloudflare).*

### 4. Cara Mengetes Tautan (Linking)
1. Buka web MonYess, login, lalu ke halaman **Telegram**.
2. Klik **Buat Kode Link**.
3. Buka bot Telegram kamu, ketik `/link KODE_KAMU` (misal: `/link X7B9K2`).
4. Jika berhasil, tampilan di web akan otomatis berubah menjadi "Terhubung".

### 5. Format Perintah Transaksi Telegram
Setelah akun terhubung, kamu bisa mencatat transaksi dengan format:
- `/expense 25000 | Makan | Beli bakso`
- `/income 500000 | Gaji | BCA | Bonus bulanan`
