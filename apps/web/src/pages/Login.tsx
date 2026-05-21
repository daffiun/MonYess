import { Link, useNavigate } from 'react-router-dom';
import { Coins } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard'); // Mock login success
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 mx-auto mb-6">
          <Coins size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Selamat Datang Kembali</h1>
        <p className="text-slate-500 mb-8 text-sm">Masuk untuk melanjutkan kebiasaan baikmu.</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input type="email" placeholder="nama@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4">
            Masuk ke Akun
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-500">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar gratis</Link>
        </p>
      </div>
    </div>
  );
}
