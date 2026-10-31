import { CreditCard, CheckCircle2, Edit2, Trash2, Clock } from 'lucide-react';
import { isBefore, isAfter, addDays, parseISO } from 'date-fns';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { cn } from '@/lib/utils';
import type { DebtRecord } from '@/types';

export interface DebtCardProps {
  debt: DebtRecord;
  onEdit: (debt: DebtRecord) => void;
  onMarkPaid: (id: string) => void;
  onDelete: (debt: DebtRecord) => void;
}

export function DebtCard({ debt, onEdit, onMarkPaid, onDelete }: DebtCardProps) {
  const isOverdue = debt.due_date && isBefore(parseISO(debt.due_date), new Date());
  const isDueSoon =
    debt.due_date &&
    isAfter(parseISO(debt.due_date), new Date()) &&
    isBefore(parseISO(debt.due_date), addDays(new Date(), 7));
  const progress = Math.round(((debt.amount - debt.remaining) / debt.amount) * 100);

  return (
    <Card className="p-6 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center border',
              debt.type === 'payable'
                ? 'bg-rose-50 text-rose-600 border-rose-100'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            )}
          >
            <CreditCard size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{debt.name}</h4>
            <div className="flex gap-2 mt-1">
              {isOverdue && <Badge variant="rose">Melewati Batas</Badge>}
              {isDueSoon && <Badge variant="amber">Segera Tempo</Badge>}
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 text-emerald-600"
            title="Tandai Lunas"
            onClick={() => onMarkPaid(debt.id)}
          >
            <CheckCircle2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 text-slate-400"
            onClick={() => onEdit(debt)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 text-rose-400"
            onClick={() => onDelete(debt)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Pembayaran: {progress}%</span>
          {debt.due_date && (
            <span className="flex items-center gap-1">
              <Clock size={10} /> {formatDate(debt.due_date)}
            </span>
          )}
        </div>
        <ProgressBar
          value={progress}
          size="sm"
          barClassName={debt.type === 'payable' ? 'bg-rose-500' : 'bg-emerald-500'}
        />
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Sisa</p>
            <p className="text-lg font-black text-slate-900">{formatCurrency(debt.remaining)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Awal</p>
            <p className="text-xs font-bold text-slate-500">{formatCurrency(debt.amount)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
