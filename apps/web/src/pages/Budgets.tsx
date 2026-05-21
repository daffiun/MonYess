import { useState, useEffect } from 'react';
import { 
  Plus, 
  PieChart as PieChartIcon, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatCurrency, getCurrentMonthRange } from '../utils/finance';

const budgetSchema = z.object({
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  period: z.string().min(1, 'Periode wajib diisi'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export default function BudgetsPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      period: format(new Date(), 'yyyy-MM'),
    }
  });

  const fetchData = async () => {
    setLoading(true);
    const { start, end } = getCurrentMonthRange();
    const currentPeriod = format(new Date(), 'yyyy-MM');

    // 1. Fetch Categories (Expenses only)
    const { data: catData } = await supabase.from('categories').select('*').eq('type', 'expense');
    setCategories(catData || []);

    // 2. Fetch Budgets for current period
    const { data: budgetData } = await supabase
      .from('budgets')
      .select('*, category:category_id(name)')
      .eq('period', currentPeriod);

    // 3. Fetch Spending per category for this month
    const { data: txData } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('type', 'expense')
      .gte('date', start)
      .lte('date', end);

    const spendingMap: Record<string, number> = {};
    txData?.forEach(tx => {
      spendingMap[tx.category_id] = (spendingMap[tx.category_id] || 0) + Number(tx.amount);
    });

    const enrichedBudgets = (budgetData || []).map(b => ({
      ...b,
      spent: spendingMap[b.category_id] || 0,
      percent: Math.round(((spendingMap[b.category_id] || 0) / b.amount) * 100)
    }));

    setBudgets(enrichedBudgets);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (values: BudgetFormValues) => {
    setSubmitting(true);
    if (editingBudget) {
      const { error } = await supabase.from('budgets').update(values).eq('id', editingBudget.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('budgets').insert([{ ...values, user_id: user?.id }]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingBudget(null);
    reset();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus anggaran ini?')) return;
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Anggaran Bulanan" 
        subtitle="Kendalikan pengeluaranmu agar tidak melebihi batas."
        actions={
          <Button onClick={() => { setEditingBudget(null); reset(); setIsModalOpen(true); }}>
            <Plus size={18} />
            Set Anggaran
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />)}
             </div>
          ) : budgets.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
                <PieChartIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada anggaran</h3>
              <p className="text-slate-500 max-w-sm mb-8">Buat anggaran per kategori (misal: Makan & Minum) untuk memantau pengeluaranmu.</p>
              <Button onClick={() => setIsModalOpen(true)}>Mulai Buat Anggaran</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {budgets.map((b) => {
                const isOver = b.percent >= 100;
                const isWarning = b.percent >= 70 && b.percent < 100;

                return (
                  <Card key={b.id} className="p-6 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border",
                          isOver ? "bg-rose-50 text-rose-600 border-rose-100" : 
                          isWarning ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          <PieChartIcon size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{b.category?.name}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{format(new Date(b.period), 'MMMM yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="sm" className="p-2 h-8 w-8" onClick={() => {
                           setEditingBudget(b);
                           setValue('category_id', b.category_id);
                           setValue('amount', b.amount);
                           setValue('period', b.period);
                           setIsModalOpen(true);
                         }}>
                           <Edit2 size={14} />
                         </Button>
                         <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-rose-400" onClick={() => handleDelete(b.id)}>
                           <Trash2 size={14} />
                         </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Terpakai</p>
                          <p className="text-sm font-black text-slate-900">{formatCurrency(b.spent)} <span className="text-slate-400 font-medium">/ {formatCurrency(b.amount)}</span></p>
                        </div>
                        <Badge variant={isOver ? 'rose' : isWarning ? 'amber' : 'emerald'}>
                          {isOver ? 'Melebihi Budget' : isWarning ? 'Waspada' : 'Aman'}
                        </Badge>
                      </div>
                      <ProgressBar 
                        value={b.spent} 
                        max={b.amount} 
                        size="md" 
                        barClassName={isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'} 
                      />
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        <span>{b.percent}% Terpakai</span>
                        <span>Sisa: {formatCurrency(Math.max(0, b.amount - b.spent))}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Gamification/Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-emerald-50 border-emerald-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
             <ShieldCheck size={32} className="text-emerald-600 mb-4" />
             <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-2">Budget Aman</h3>
             <p className="text-xs text-emerald-700 leading-relaxed font-medium">
               Pertahankan pengeluaran di bawah budget untuk mendapatkan badge <strong>"Budget Master"</strong> di akhir bulan!
             </p>
          </Card>

          <Card variant="slate" className="p-6">
             <TrendingDown size={32} className="text-blue-400 mb-4" />
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Tips Hemat</h3>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">
               Coba kurangi budget kategori yang tidak terlalu mendesak sebesar 10% untuk mempercepat target tabunganmu.
             </p>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBudget ? 'Ubah Anggaran' : 'Set Anggaran Baru'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit as any)} isLoading={submitting}>
              {editingBudget ? 'Simpan' : 'Buat Anggaran'}
            </Button>
          </>
        }
      >
        <form className="space-y-6">
          <Select 
            label="Kategori Pengeluaran" 
            options={[
              { label: '-- Pilih Kategori --', value: '' },
              ...categories.map(c => ({ label: c.name, value: c.id }))
            ]}
            {...register('category_id')}
            error={errors.category_id?.message}
          />
          <Input 
            label="Limit Bulanan" 
            type="number" 
            placeholder="0"
            {...register('amount')}
            error={errors.amount?.message}
          />
          <Input 
            label="Bulan (Periode)" 
            type="month"
            {...register('period')}
            error={errors.period?.message}
          />
        </form>
      </Modal>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
