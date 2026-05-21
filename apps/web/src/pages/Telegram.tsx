import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Copy, Loader2, Unlink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { generateLinkCode } from '@financebot/shared';

export default function TelegramPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [linkData, setLinkData] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  const fetchLinkStatus = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('telegram_links')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle(); // One user, one active link max theoretically
    
    setLinkData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinkStatus();

    // Subscribe to changes so UI updates automatically when linked via bot
    const subscription = supabase
      .channel('telegram_links_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'telegram_links', filter: `user_id=eq.${user?.id}` }, (payload) => {
        setLinkData(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    const code = generateLinkCode();
    
    // Expires in 15 mins
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // If exists and not linked, update it. If linked, don't touch (though shouldn't hit this button)
    // Safest is to delete unlinked old codes and create new
    if (linkData && !linkData.is_linked) {
       await supabase.from('telegram_links').delete().eq('id', linkData.id);
    }

    const { data, error } = await supabase
      .from('telegram_links')
      .insert({
        user_id: user?.id,
        link_code: code,
        code_expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      setLinkData(data);
    }
    setGenerating(false);
  };

  const handleUnlink = async () => {
    if (!confirm('Lepaskan tautan dari akun Telegram ini?')) return;
    setGenerating(true);
    await supabase.from('telegram_links').delete().eq('id', linkData.id);
    setLinkData(null);
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const isExpired = linkData && new Date() > new Date(linkData.code_expires_at) && !linkData.is_linked;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
          <Smartphone size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">Integrasi Telegram</h1>
        <p className="text-slate-500">Mencatat keuangan semudah chating sama teman. Sambungkan akunmu sekarang.</p>
      </div>

      <Card className="p-8 text-center relative overflow-hidden">
        {linkData?.is_linked ? (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg shadow-emerald-100">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <div>
              <Badge variant="emerald" className="mb-2 px-3 py-1">Terhubung</Badge>
              <h3 className="text-xl font-bold text-slate-900">Telegram Aktif!</h3>
              <p className="text-sm text-slate-500 mt-2">Terhubung dengan <strong className="text-slate-700">@{linkData.telegram_username}</strong></p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 mt-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Cara Mencatat:</p>
              <code className="block bg-white p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700">
                <span className="text-blue-600">/expense</span> 25000 | Makan | Beli nasgor
              </code>
              <code className="block bg-white p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700">
                <span className="text-emerald-600">/income</span> 500000 | Gaji | BCA | Bonus bulanan
              </code>
            </div>

            <Button variant="danger" className="w-full mt-6" onClick={handleUnlink} isLoading={generating}>
              <Unlink size={18} /> Putus Koneksi
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Kode Unik Kamu</h3>
              {linkData && !isExpired ? (
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-black tracking-[0.2em] text-slate-900 bg-slate-50 py-8 px-12 rounded-3xl mb-4 border-2 border-slate-200 border-dashed select-all w-fit">
                    {linkData.link_code}
                  </div>
                  <p className="text-xs text-rose-500 font-bold mb-2">Kadaluarsa dalam 15 menit</p>
                </div>
              ) : (
                <Button onClick={handleGenerateCode} isLoading={generating} size="lg" className="w-full sm:w-auto">
                  Buat Kode Link
                </Button>
              )}
            </div>
            
            <div className="text-left space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                <CheckCircle size={18}/> Cara Menghubungkan:
              </h4>
              <ol className="list-decimal pl-5 space-y-3 text-sm font-medium text-slate-700">
                <li>Buka Telegram dan cari bot <strong className="text-blue-600">@MonYessBot</strong></li>
                <li>Ketik perintah <code className="bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-900 font-bold">/link KODEMU</code></li>
                <li>Kirim pesan tersebut dan tampilan ini akan berubah otomatis!</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 text-left border border-amber-100">
              <span className="text-amber-500">🔥</span>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                <strong>Tips:</strong> Mencatat lewat Telegram juga akan memperpanjang <strong>Streak Harian</strong> kamu. Lebih praktis dan cepat!
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
