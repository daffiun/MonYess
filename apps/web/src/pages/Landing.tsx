import { Link } from 'react-router-dom';
import { Coins, ArrowRight, Smartphone, LineChart, Target } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="h-20 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            <Coins size={22} />
          </div>
          <span className="text-xl font-black text-slate-900">MonYess</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">Masuk</Link>
          <Link to="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Daftar Gratis</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Kendalikan Uangmu, <br/>
          <span className="text-blue-600">Bangun Kebiasaanmu.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Catat keuangan pribadi dari web dan Telegram. Fitur lengkap, ringan, tanpa iklan, dan bantu kamu jadi master finansial.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
            Mulai Sekarang <ArrowRight size={20} />
          </Link>
          <Link to="/telegram" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
            <Smartphone size={20} className="text-blue-500"/> Coba via Telegram
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Input Cepat Telegram</h3>
            <p className="text-slate-500">Nggak perlu buka app, tinggal chat ke bot Telegram MonYess dan transaksi otomatis tercatat.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <LineChart size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Laporan Otomatis</h3>
            <p className="text-slate-500">Pantau arus kas, budget, dan kesehatan finansialmu lewat dashboard visual yang modern.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Gamifikasi Kebiasaan</h3>
            <p className="text-slate-500">Sistem streak, level, dan badge bikin rutinitas mencatat keuangan jadi asik dan konsisten.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
