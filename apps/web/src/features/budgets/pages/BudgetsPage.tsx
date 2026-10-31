import { useState } from 'react';
import { Plus, PieChart as PieChartIcon, Edit2, Trash2, ShieldCheck, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader, Button, Card, Badge, ProgressBar } from '@/components/ui';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { useBudgets } from '../hooks/useBudgets';
import { BudgetModalForm, type EnrichedBudget } from '../components/BudgetModalForm';

export default function BudgetsPage() {
  const {
    budgets,
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingBudget,
    setEditingBudget,
    submitting,
    handleSaveBudget,
    handleDeleteBudget,
  } = useBudgets();

  const [deletingBudget, setDeletingBudget] = useState<EnrichedBudget | null>(null);

  const confirmDelete = async () => {
    if (!deletingBudget) return;
    await handleDeleteBudget(deletingBudget.id);
    setDeletingBudget(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Anggaran Bulanan" 
        subtitle="Kendalikan pengeluaranmu agar tidak melebihi batas."
        actions={
          <Button onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}>
            <Plus size={18} />
            Set Anggaran
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />)}
             </div>
          ) : budgets.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
                <PieChartIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada anggaran</h3>
              <p className="text-slate-500 max-w-sm mb-8">
                Buat anggaran per kategori (misal: Makan & Minum) untuk memantau pengeluaranmu.
              </p>
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
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {format(new Date(b.period), 'MMMM yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button
                           variant="ghost"
                           size="sm"
                           className="p-2 h-8 w-8"
                           onClick={() => {
                             setEditingBudget(b);
                             setIsModalOpen(true);
                           }}
                         >
                           <Edit2 size={14} />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="p-2 h-8 w-8 text-rose-400"
                           onClick={() => setDeletingBudget(b)}
                         >
                           <Trash2 size={14} />
                         </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Terpakai</p>
                          <p className="text-sm font-black text-slate-900">
                            {formatCurrency(b.spent)}{' '}
                            <span className="text-slate-400 font-medium">/ {formatCurrency(b.amount)}</span>
                          </p>
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
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full -mr-12 -mt-12 opacity-50" />
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

      {/* Budget Modal Form */}
      <BudgetModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSaveBudget}
        editingBudget={editingBudget}
        categories={categories}
        isSubmitting={submitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        onConfirm={confirmDelete}
        title="Hapus Anggaran"
        message={`Hapus anggaran kategori "${deletingBudget?.category?.name || 'ini'}"?`}
        confirmLabel="Hapus Anggaran"
      />
    </div>
  );
}
