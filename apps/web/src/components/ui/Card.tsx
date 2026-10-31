import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'white' | 'slate';
}

export function Card({ children, className, variant = 'white' }: CardProps) {
  return (
    <div className={cn(
      'p-6 rounded-3xl transition-all duration-300',
      variant === 'white' 
        ? 'bg-white border border-slate-200 shadow-sm hover:shadow-md' 
        : 'bg-slate-900 text-white shadow-xl shadow-slate-200',
      className
    )}>
      {children}
    </div>
  );
}
