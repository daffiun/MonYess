import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder:text-slate-400',
            error && 'border-rose-300 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-bold text-rose-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
