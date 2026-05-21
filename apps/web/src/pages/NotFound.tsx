import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldAlert size={64} className="text-rose-500 mx-auto mb-6" />
        <h1 className="text-4xl font-black text-slate-900 mb-2">404 - Nyasar Beb!</h1>
        <p className="text-slate-500 mb-8">Halaman yang kamu cari nggak ada di sini.</p>
        <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
