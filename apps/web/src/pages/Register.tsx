import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coins, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase auto-logins or requires email confirmation depending on settings
      // For now, redirect to dashboard as a success indicator
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 mx-auto mb-6 active:scale-95 transition-transform">
          <Coins size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Mulai Langkah Baru</h1>
        <p className="text-slate-500 mb-8 text-sm font-medium">Daftar MonYess dan jadilah master finansial.</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm text-left animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">Nama Panggilan</label>
            <input 
              type="text" 
              placeholder="Budi" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="Minimal 8 karakter" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : 'Buat Akun Gratis'}
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-500 font-medium">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4 tracking-tight">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
