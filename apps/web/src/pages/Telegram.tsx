import { Smartphone, CheckCircle } from 'lucide-react';

export default function Telegram() {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
          <Smartphone size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">Hubungkan Telegram</h1>
        <p className="text-slate-500">Mencatat keuangan semudah chating sama teman. Sambungkan akunmu sekarang.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Kode Unik Kamu</h3>
        <div className="text-4xl font-black tracking-[0.2em] text-slate-900 bg-slate-50 py-6 rounded-2xl mb-8 border border-slate-200 border-dashed select-all">
          X7B9K2
        </div>
        
        <div className="text-left space-y-4 bg-blue-50/50 p-6 rounded-2xl">
          <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4"><CheckCircle size={18}/> Cara menghubungkan:</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm font-medium text-slate-700">
            <li>Buka Telegram dan cari bot <strong>@MonYessBot</strong></li>
            <li>Ketik perintah <code className="bg-white px-2 py-1 rounded-md border border-slate-200 text-blue-600">/link X7B9K2</code></li>
            <li>Kirim pesan tersebut dan tunggu balasan sukses.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
