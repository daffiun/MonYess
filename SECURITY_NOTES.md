# Security Notes - MonYess

MonYess dirancang dengan memprioritaskan keamanan data finansial pengguna. Berikut adalah poin-penting mengenai arsitektur keamanan kami:

## 1. Row Level Security (RLS)
Setiap tabel di database Supabase kami memiliki kebijakan RLS (Row Level Security) yang ketat. 
- Pengguna hanya dapat melakukan operasi CRUD pada data yang memiliki `user_id` yang sesuai dengan `auth.uid()`.
- Hal ini memastikan bahwa meskipun seseorang memiliki akses ke API Key Anon, mereka tetap tidak bisa mengintip data milik pengguna lain.

## 2. Penggunaan Service Role Key
Kunci `SUPABASE_SERVICE_ROLE_KEY` hanya diletakkan dan digunakan di dalam lingkungan server yang aman (Cloudflare Workers). 
- Kunci ini **tidak pernah** dikirimkan ke browser atau aplikasi frontend.
- Worker menggunakan kunci ini hanya untuk memvalidasi input dari Telegram dan melakukan update saldo melalui RPC yang aman.

## 3. Validasi Webhook Telegram
Integrasi Telegram kami dijaga oleh sistem validasi dua lapis:
- **Secret Token**: Setiap request dari Telegram harus menyertakan header `X-Telegram-Bot-Api-Secret-Token` yang dicocokkan dengan rahasia di server kami.
- **Setup Secret**: Rute pendaftaran webhook (`/telegram/set-webhook`) dikunci oleh `TELEGRAM_WEBHOOK_SETUP_SECRET` buatan pengguna sendiri.

## 4. Mutasi Saldo yang Aman (Atomik)
Perubahan saldo tidak dilakukan secara langsung oleh kode frontend. Kami menggunakan **Database RPC (Stored Procedures)**:
- `create_transaction_with_balance`
- `update_transaction_with_balance_safe`
- `delete_transaction_with_balance`
Prosedur ini memastikan bahwa penambahan transaksi dan perubahan saldo akun terjadi dalam satu transaksi database yang atomik (semua sukses atau semua gagal), mencegah ketidakkonsistenan saldo.

## 5. Validasi Input & Portabilitas
- **Amount Validation**: Sistem menolak nominal negatif, NaN, atau format yang tidak dikenal baik dari Form Web maupun Bot Telegram.
- **CSV Import**: Proses impor melakukan validasi baris demi baris. Baris yang tidak valid (misal: nama akun tidak ditemukan) akan dilewati dan dilaporkan kepada pengguna sebelum proses impor dimulai.

## 6. Sesi Pengguna
Sistem menggunakan autentikasi bawaan Supabase (GoTrue) dengan JWT yang aman. Sesi akan tetap terjaga di browser secara aman tanpa mengekspos kredensial sensitif.

---
*Catatan: MonYess adalah aplikasi tracker mandiri dan tidak memiliki akses langsung ke rekening bank Anda.*
