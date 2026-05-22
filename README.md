# MonYess (FinanceBot)

Personal Finance Tracker untuk pengguna di Indonesia dengan integrasi Telegram dan Gamifikasi Kebiasaan.

## 🚀 Gambaran Umum
MonYess adalah aplikasi pencatat keuangan pribadi yang ringan namun lengkap. Didesain untuk membantu Anda membangun kebiasaan mencatat transaksi secara konsisten melalui web app yang modern dan bot Telegram yang praktis.

## ✨ Fitur Utama
- **Pencatatan Multi-Platform**: Input transaksi via Web atau bot Telegram.
- **Manajemen Saldo**: Pantau banyak akun/dompet secara real-time.
- **Anggaran (Budgeting)**: Set batasan pengeluaran per kategori.
- **Target Tabungan (Goals)**: Visualisasi progress menuju barang impian.
- **Laporan Visual**: Grafik tren arus kas dan breakdown pengeluaran.
- **Gamifikasi Ringan**: Sistem Streak, Level, Badge, dan Skor Kesehatan Finansial.
- **Portabilitas Data**: Ekspor semua data dan Impor transaksi via CSV.
- **Otomatisasi**: Pengingat harian dan pencatatan transaksi rutin otomatis via Cloudflare Workers.

## 🛠️ Tech Stack
- **Frontend**: React + Vite + TypeScript, Tailwind CSS, React Router, Recharts.
- **Backend/Auth**: Supabase (PostgreSQL, Auth, RLS).
- **Serverless/Bot**: Cloudflare Workers (Hono).
- **Package Manager**: pnpm workspaces.

## 📦 Struktur Proyek
- `apps/web`: Aplikasi frontend utama.
- `apps/worker`: Logic bot Telegram dan tugas terjadwal (cron).
- `packages/shared`: Tipe data dan utilitas bersama.
- `supabase/migrations`: Skema database dan fungsi RPC.

## ⚙️ Persiapan & Instalasi

### Prasyarat
- Node.js (Versi LTS terbaru).
- pnpm (`npm install -g pnpm`).
- Supabase Account.
- Cloudflare Account & Wrangler CLI.

### 1. Kloning & Install
```bash
git clone [url-repo]
cd MonYess
pnpm install
```

### 2. Setup Supabase
1. Buat project baru di [Supabase](https://supabase.com).
2. Jalankan isi folder `supabase/migrations/` di SQL Editor (Urutkan dari 0 ke 1).
3. Copy **Project URL** dan **Anon Key** ke `apps/web/.env`.
4. Copy **Service Role Key** ke `apps/worker/.dev.vars`.

### 3. Setup Telegram Bot
1. Buat bot via **@BotFather** di Telegram.
2. Masukkan **Bot Token** ke `apps/worker/.dev.vars`.

### 4. Menjalankan Lokal
```bash
# Jalankan Web App
pnpm dev:web

# Jalankan Worker (untuk bot Telegram)
pnpm dev:worker --remote
```

## 🌐 Deployment

### Cloudflare Pages (Frontend)
1. Hubungkan repo GitHub Anda ke Cloudflare Pages.
2. Gunakan Build Command: `pnpm run build` (atau spesifik ke apps/web).
3. Set Environment Variables yang dibutuhkan.

### Cloudflare Workers (Backend/Bot)
```bash
cd apps/worker
pnpm deploy
```
*Jangan lupa mendaftarkan webhook setelah deploy: `https://[URL]/telegram/set-webhook?secret=[SETUP_SECRET]`*

## 🔒 Keamanan
Detail mengenai arsitektur keamanan dapat dilihat di [SECURITY_NOTES.md](./SECURITY_NOTES.md).

## 🎮 Gamifikasi
Panduan mengenai sistem skor, level, dan badge dapat dilihat di [GAMIFICATION_NOTES.md](./GAMIFICATION_NOTES.md).

## 📊 Format CSV (Impor)
Kolom yang dibutuhkan: `transaction_date, type, amount, account_name, category_name, note`.

## 📌 Batasan Saat Ini
- Transaksi rutin otomatis membutuhkan jadwal Cron yang aktif di Cloudflare.
- Fitur Impor CSV saat ini hanya mendukung tabel Transaksi.

---
*Dibuat dengan ❤️ untuk membantu keuangan masyarakat Indonesia menjadi lebih "Yess!"*
