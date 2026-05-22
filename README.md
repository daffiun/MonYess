# FinanceBot (MonYess)

Personal Finance Tracker for Indonesian Users with Telegram Integration and Gamification.

## Project Structure
- `apps/web`: React + Vite + TypeScript frontend with Tailwind CSS.
- `apps/worker`: Cloudflare Workers for Telegram Bot and Scheduled Tasks.
- `packages/shared`: Shared TypeScript types and utilities.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Lucide React, Recharts.
- Backend/Auth: Supabase.
- Bot/Serverless: Cloudflare Workers (Hono).
- Database: PostgreSQL (Supabase) with RLS and RPC.

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
# Run the Web App
pnpm dev:web

# Run the Cloudflare Worker (Local testing with remote bindings)
pnpm dev:worker --remote
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
- [x] Fase 8: Scheduled Automation & Reminders (Cron Triggers, Recurring Tx)
- [ ] Fase 9: Deployment & Final Polish (NEXT)

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
CRON_TEST_SECRET="bebas_isi_password_untuk_testing_cron"
SUPABASE_URL="url_project_supabase_kamu"
SUPABASE_SERVICE_ROLE_KEY="kunci_rahasia_service_role_supabase"
WEBAPP_URL="http://localhost:5173"
```

### 3. Cara Mengetes Tautan (Linking)
1. Buka web MonYess, login, lalu ke halaman **Telegram**.
2. Klik **Buat Kode Link**.
3. Buka bot Telegram kamu, ketik `/link KODE_KAMU` (misal: `/link X7B9K2`).
4. Jika berhasil, tampilan di web akan otomatis berubah menjadi "Terhubung".

### 4. Format Perintah Transaksi Telegram
Setelah akun terhubung, kamu bisa mencatat transaksi dengan format:
- `/expense 25000 | Makan | Beli bakso`
- `/income 500000 | Gaji | BCA | Bonus bulanan`

## Otomatisasi Terjadwal (Fase 8)
MonYess menggunakan **Cloudflare Cron Triggers** untuk menjalankan tugas rutin secara otomatis di latar belakang.

### 1. Jadwal Cron (UTC)
Cloudflare menggunakan waktu UTC. Berikut konversinya ke WIB (Asia/Jakarta):
- `0 0 * * *` (00:00 UTC) = **07:00 WIB** (Pengingat Pagi & Transaksi Rutin).
- `0 14 * * *` (14:00 UTC) = **21:00 WIB** (Rekap Malam).

### 2. Fitur Otomatisasi
- **Transaksi Rutin**: Mencatat transaksi secara otomatis berdasarkan jadwal yang kamu buat di web.
- **Pengingat Pagi**: Motivasi harian untuk tetap mencatat transaksi.
- **Alert Budget**: Notifikasi jika pengeluaran kategori tertentu mencapai 80% atau 100%.
- **Reminder Hutang**: Notifikasi saat ada hutang yang akan jatuh tempo (H-3) atau sudah lewat.
- **Rekap Malam**: Ringkasan uang masuk dan keluar kamu sepanjang hari.

### 3. Cara Mengetes Manual (Testing)
Kamu tidak perlu menunggu jam 7 pagi untuk mengetes fitur ini. Gunakan rute rahasia berikut:
1. Tambahkan `CRON_TEST_SECRET` di Cloudflare Worker Secrets (atau `.dev.vars` jika lokal).
2. Akses melalui browser:
   `https://[URL_WORKER]/cron/test?secret=[KATA_RAHASIA]`
3. Jika berhasil, bot Telegram kamu akan mengirimkan semua notifikasi yang relevan secara instan.
