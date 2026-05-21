import { Flame } from 'lucide-react';
import { Card } from '../ui/Card';

interface StreakCardProps {
  days: number;
}

export function StreakCard({ days }: StreakCardProps) {
  return (
    <Card variant="slate" className="relative group overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/40 transform group-hover:scale-110 transition-transform">
          <Flame size={24} fill="currentColor" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Streak Harian</p>
          <p className="text-xl font-black text-white">{days} Hari Mencatat</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
        Hebat! Kamu sudah konsisten mencatat selama {days} hari. Jangan sampai terputus hari ini!
      </p>
    </Card>
  );
}
