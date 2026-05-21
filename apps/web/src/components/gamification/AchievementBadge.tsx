import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AchievementBadgeProps {
  icon: LucideIcon;
  label: string;
  variant: 'blue' | 'emerald' | 'amber' | 'slate' | 'rose';
  isEarned?: boolean;
}

export function AchievementBadge({ icon: Icon, label, variant, isEarned = true }: AchievementBadgeProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50',
    slate: 'bg-slate-50 text-slate-400 border-slate-100 shadow-slate-100/50',
  };

  return (
    <div className="flex flex-col items-center gap-2 flex-1 group">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-sm",
        isEarned ? variants[variant] : 'bg-slate-50 text-slate-300 border-slate-100 opacity-50 grayscale',
        isEarned && "group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-lg"
      )}>
        <Icon size={24} strokeWidth={isEarned ? 2.5 : 1.5} />
      </div>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-widest transition-colors",
        isEarned ? "text-slate-500 group-hover:text-slate-900" : "text-slate-300"
      )}>
        {label}
      </span>
    </div>
  );
}
