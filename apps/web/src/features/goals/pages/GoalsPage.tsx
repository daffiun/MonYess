import { useState } from 'react';
import { Plus, Target as TargetIcon, Edit2, Trash2, TrendingUp, Award, Calendar } from 'lucide-react';
import { PageHeader, Button, Card, ProgressBar } from '@/components/ui';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import type { Goal } from '@/types';
import { useGoals } from '../hooks/useGoals';
import { GoalModalForm } from '../components/GoalModalForm';

export default function GoalsPage() {
  const {
    goals,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingGoal,
    setEditingGoal,
    submitting,
    handleSaveGoal,
    handleDeleteGoal,
  } = useGoals();

  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const confirmDelete = async () => {
    if (!deletingGoal) return;
    await handleDeleteGoal(deletingGoal.id);
    setDeletingGoal(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Target Tabungan" 
        subtitle="Buat tujuan finansial dan pantau progress tabunganmu."
        actions={
          <Button onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}>
            <Plus size={18} />
            Buat Target
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2].map((i) => <div key={i} className="h-56 bg-slate-100 animate-pulse rounded-3xl" />)}
            </div>
          ) : goals.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
                <TargetIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada target</h3>
              <p className="text-slate-500 max-w-sm mb-8">
                Ingin beli laptop baru? Atau DP rumah? Catat targetmu di sini biar makin semangat nabung.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Mulai Buat Target</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((g) => {
                const percent = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
                return (
                  <Card key={g.id} className="p-7 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <TargetIcon size={24} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button
                           variant="ghost"
                           size="sm"
                           className="p-2 h-8 w-8"
                           onClick={() => {
                             setEditingGoal(g);
                             setIsModalOpen(true);
                           }}
                         >
                           <Edit2 size={14} />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="p-2 h-8 w-8 text-rose-400"
                           onClick={() => setDeletingGoal(g)}
                         >
                           <Trash2 size={14} />
                         </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">{g.name}</h4>
                        {g.deadline && (
                          <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1">
                            <Calendar size={10} /> Deadline: {formatDate(g.deadline)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                          <span className="text-sm font-black text-blue-600">{percent}%</span>
                        </div>
                        <ProgressBar value={percent} size="md" />
                      </div>

                      <div className="pt-2 flex justify-between items-center border-t border-slate-50">
                         <div>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">Terkumpul</p>
                           <p className="text-sm font-black text-slate-900">{formatCurrency(g.current_amount)}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-[9px] text-slate-400 font-bold uppercase">Target</p>
                           <p className="text-sm font-bold text-slate-500">{formatCurrency(g.target_amount)}</p>
                         </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
           <Card className="bg-slate-900 text-white p-6 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-600 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <Award size={32} className="text-amber-400 mb-4" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-3">Milestone Master</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                Selesaikan satu target tabungan untuk mendapatkan badge <strong>"Future Planner"</strong>.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">Progress Global</p>
                <ProgressBar value={30} size="xs" barClassName="bg-blue-400" className="bg-slate-800" />
              </div>
           </Card>

           <Card className="p-6 border-blue-100 bg-blue-50/30">
              <TrendingUp size={24} className="text-blue-600 mb-4" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Cara Menambah Saldo</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Untuk sekarang, kamu bisa mengupdate progress tabungan secara manual lewat tombol edit. Kedepannya, setiap transfer ke akun "Savings" akan otomatis menambah progress goal kamu!
              </p>
           </Card>
        </div>
      </div>

      {/* Goal Modal Form */}
      <GoalModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSaveGoal}
        editingGoal={editingGoal}
        isSubmitting={submitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={confirmDelete}
        title="Hapus Target Tabungan"
        message={`Hapus target tabungan "${deletingGoal?.name}"?`}
        confirmLabel="Hapus Target"
      />
    </div>
  );
}
