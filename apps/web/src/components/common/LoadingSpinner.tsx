import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  message?: string;
}

export function LoadingSpinner({
  className,
  size = 32,
  message = 'Memuat data...',
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[50vh] gap-3', className)}>
      <Loader2 size={size} className="animate-spin text-blue-600" />
      {message && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{message}</p>}
    </div>
  );
}
