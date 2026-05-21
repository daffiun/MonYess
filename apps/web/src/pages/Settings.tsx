import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pengaturan</h1>
          <p className="text-sm text-slate-500 font-medium">Kelola preferensi akun dan tampilan MonYess.</p>
        </div>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
            <User size={32} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{user?.user_metadata?.name || 'User MonYess'}</h3>
            <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mata Uang</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option>IDR (Rp)</option>
              <option>USD ($)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zona Waktu</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option>Asia/Jakarta (WIB)</option>
              <option>Asia/Makassar (WITA)</option>
              <option>Asia/Jayapura (WIT)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Gamification Prefs */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Palette size={18} className="text-blue-600" /> 
          Tampilan Gamifikasi
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Tampilkan Streak', desc: 'Tampilkan runutan hari mencatat di dashboard.', active: true },
            { label: 'Tampilkan Badge', desc: 'Tampilkan pencapaian yang sudah didapat.', active: true },
            { label: 'Tampilkan Tantangan Mingguan', desc: 'Tampilkan widget tantangan di dashboard.', active: true }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-blue-100">
              <div>
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Bell size={18} className="text-blue-600" /> 
          Pengingat (Reminders)
        </h3>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
          <Shield size={20} className="text-blue-600 shrink-0" />
          <p className="text-xs text-blue-900 font-medium leading-relaxed">
            Pengaturan pengingat akan aktif secara otomatis di bot Telegram jika akun sudah terhubung.
          </p>
        </div>
      </section>
    </div>
  );
}
