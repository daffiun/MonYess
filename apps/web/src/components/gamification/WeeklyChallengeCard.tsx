import { ProgressBar } from '../ui/ProgressBar';

interface WeeklyChallengeCardProps {
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
}

export function WeeklyChallengeCard({ title, description, current, target, unit }: WeeklyChallengeCardProps) {
  return (
    <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700/50 shadow-inner group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Tantangan Mingguan</p>
        <span className="text-[10px] font-bold text-slate-400">{current}/{target} {unit}</span>
      </div>
      <p className="text-xs font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">{title}</p>
      <p className="text-[10px] text-slate-400 font-medium mb-4">{description}</p>
      <ProgressBar value={current} max={target} barClassName="bg-blue-400" className="bg-slate-700" size="xs" />
    </div>
  );
}
