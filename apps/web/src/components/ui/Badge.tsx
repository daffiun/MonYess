import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'emerald' | 'rose' | 'amber' | 'slate';
  className?: string;
}

export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <span className={cn(
      'px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
