# Gamification Concept - FinanceBot

Dokumen ini mendefinisikan sistem gamifikasi ringan yang bertujuan untuk meningkatkan konsistensi pengguna dalam mencatat dan mengelola keuangan.

## 1. Gamification Goals
- Meningkatkan retensi pengguna (balik lagi buat nyatat).
- Membentuk kebiasaan finansial yang sehat (kesadaran akan pengeluaran).
- Memberikan rasa pencapaian (*sense of achievement*) tanpa tekanan finansial.

## 2. Gamification Principles
- **Habit-focused, not money-focused**: Hadiah diberikan atas kebiasaan baik, bukan karena punya banyak uang.
- **Supportive, not judgmental**: Tidak ada hukuman jika skor turun, hanya dorongan untuk memulai lagi.
- **Privacy-first**: Tidak ada leaderboard publik. Kompetisi hanya dengan diri sendiri.
- **Subtle & Professional**: Visual tetap elegan, bukan seperti game anak-anak.

## 3. Streak Concept (Konsistensi)
- **Daily Tracking Streak**: Menghitung berapa hari berturut-turut user mencatat minimal satu transaksi.
- **UI**: Tampil di dashboard sebagai teks kecil "🔥 5 Hari".
- **Benefit**: Memberikan dorongan psikologis untuk tidak memutus rantai (Don't break the chain).

## 4. Financial Health Score (Kesehatan Finansial)
Skor dari 0–100 berdasarkan placeholder logika berikut:
- **Konsistensi**: Rajin mencatat setiap hari (+).
- **Arus Kas**: Pemasukan > Pengeluaran (+).
- **Disiplin Budget**: Tidak melewati batas budget (+).
- **Status Hutang**: Membayar hutang tepat waktu (+).
- **UI**: Progress ring atau angka besar di dashboard dengan label "Skor Kesehatan".

## 5. Level System (Evolusi Pengguna)
Level mencerminkan tingkat kematangan kebiasaan pengguna:
1. **Level 1: Pemula** (Baru daftar).
2. **Level 2: Konsisten** (Mencatat 7 hari tanpa putus).
3. **Level 3: Terkendali** (Punya budget aktif dan disiplin selama 1 bulan).
4. **Level 4: Strategis** (Mencapai goal tabungan dan mengelola hutang dengan baik).

## 6. Badge List (Pencapaian)
Badget berupa ikon chip kecil yang elegan:
- 🎖️ **"Catat 7 Hari"**: Konsistensi seminggu pertama.
- 🛡️ **"Budget Aman"**: Tidak overbudget dalam satu bulan.
- 🕊️ **"Bebas Telat"**: Membayar semua pengeluaran rutin tepat waktu.
- 📈 **"Tabungan Naik"**: Saldo akun tabungan meningkat dibanding bulan lalu.
- 🧐 **"Analyst"**: Membuka halaman laporan 4 kali dalam sebulan.

## 7. Weekly Challenge (Tantangan Mingguan)
Tantangan dinamis untuk variasi interaksi:
- "Catat semua transaksi selama 7 hari tanpa bolong."
- "Kurangi kategori 'Makan Luar' sebesar 10% minggu ini."
- "Review laporan mingguan kamu di hari Minggu."

## 8. UI Placement
- **Dashboard**: Streak, Health Score, Weekly Challenge, Badge Preview.
- **Settings/Profile**: Detail Level, Daftar Badge lengkap.
- **Modals**: Pop-up kecil ucapan selamat saat naik level atau dapat badge.

## 9. What NOT to Gamify
- **Jumlah Nominal**: Jangan memberi reward karena user kaya atau belanja banyak.
- **Kompetisi Saldo**: Jangan membandingkan saldo antar user.
- **Penghematan Ekstrim**: Jangan mendorong user untuk tidak makan demi skor.

## 10. Future Implementation Notes
- Logika skor akan diperdalam di Fase 6.
- Notifikasi push/bot Telegram untuk pengingat streak.
- Animasi confetti halus saat mencapai target penting.
