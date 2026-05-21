import { LucideIcon, TrendingUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  amount: number | string;
  icon: LucideIcon;
  trend?: string;
  color: string;
  labelColor: string;
  className?: string;
}

export function StatCard({ 
  title, 
  amount, 
  icon: Icon, 
  trend, 
  color, 
  labelColor, 
  className 
}: StatCardProps) {
  const formattedAmount = typeof amount === 'number' 
    ? `Rp ${amount.toLocaleString('id-ID')}` 
    : amount;

  return (
    <div className={cn(
      "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold", labelColor)}>
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{formattedAmount}</h3>
      </div>
    </div>
  );
}
