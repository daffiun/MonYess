import { Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface HealthScoreCardProps {
  score: number;
  label: string;
  discipline: number;
  savingRate: number;
}

export function HealthScoreCard({ score, label, discipline, savingRate }: HealthScoreCardProps) {
  const dashArray = 440;
  const dashOffset = dashArray * (1 - score / 100);

  return (
    <Card className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-6">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Kesehatan Finansial</h3>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Activity size={18} />
        </div>
      </div>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
          <circle 
            cx="80" cy="80" r="70" 
            stroke="currentColor" 
            strokeWidth="12" 
            fill="transparent" 
            strokeDasharray={dashArray} 
            strokeDashoffset={dashOffset} 
            className="text-blue-600 transition-all duration-1000 ease-out" 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900 leading-none">{score}</span>
          <div className="mt-1">
            <Badge variant="emerald">{label}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-slate-50">
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Disiplin</p>
          <p className="text-sm font-black text-slate-900">{discipline}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saving Rate</p>
          <p className="text-sm font-black text-slate-900">{savingRate}%</p>
        </div>
      </div>
    </Card>
  );
}
