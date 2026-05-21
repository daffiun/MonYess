import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  barClassName?: string;
  size?: 'xs' | 'sm' | 'md';
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  barClassName,
  size = 'sm' 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5'
  };

  return (
    <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizes[size], className)}>
      <div 
        className={cn('bg-blue-600 h-full rounded-full transition-all duration-500', barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
