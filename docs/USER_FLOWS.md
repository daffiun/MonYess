# User Flows - FinanceBot (Refined)

Alur pengguna untuk berbagai fitur utama dengan elemen gamifikasi.

### 1. Register and Login
- User buka Landing Page -> Klik Daftar -> Isi Form -> Verifikasi Email (Supabase) -> Login -> Masuk ke Dashboard (Level 1: Pemula).

### 2. Create First Account
- Dashboard kosong -> Klik "Tambah Akun" -> Isi nama akun (misal: "BCA", "Cash") & Saldo awal -> Simpan -> Saldo muncul di Dashboard -> **Achievement "First Account" didapat.**

### 3. Create Default Categories
- User masuk ke Categories -> Muncul tombol "Gunakan Kategori Default" -> Klik -> Otomatis terisi.

### 4. Add Expense/Income Manually
- Klik tombol "+" -> Pilih Jenis -> Masukkan Nominal -> Pilih Akun & Kategori -> Simpan -> **Streak bertambah/berlanjut.**

### 5. Add Transfer
- Klik tombol "+" -> Pilih Jenis (Transfer) -> Masukkan Nominal -> Pilih Akun Asal & Tujuan -> Simpan.

### 6. View Dashboard & Gamification Feedback
- Lihat ringkasan saldo -> Lihat **Financial Health Score** -> Cek **Weekly Challenge** -> Lihat badge yang baru didapat di **Achievement Preview**.

### 7. Link Telegram Bot
- Buka Menu Telegram -> Generate Code -> Masukkan di Bot -> Sukses -> **Badge "Bot Master" didapat.**

### 8. Add Expense from Telegram
- User ketik di Bot: `/add 50000 Makan siang` -> Pilih akun -> Sukses -> **Streak berlanjut dari Telegram.**

### 9. Export CSV
- Buka Export/Import -> Pilih rentang tanggal -> Klik "Export" -> File `.csv` terunduh.
