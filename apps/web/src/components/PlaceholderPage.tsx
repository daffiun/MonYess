import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
        <Icon size={40} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-500 max-w-md">{description}</p>
      
      <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-100">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Segera Hadir
      </div>
    </div>
  );
}
