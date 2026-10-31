import { useState } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { PageHeader, Button, Card, Badge } from '@/components/ui';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/currency';
import type { DebtRecord } from '@/types';
import { useDebts } from '../hooks/useDebts';
import { DebtCard } from '../components/DebtCard';
import { DebtModalForm } from '../components/DebtModalForm';

export default function DebtsPage() {
  const {
    debts,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingDebt,
    setEditingDebt,
    submitting,
    handleSaveDebt,
    handleMarkAsPaid,
    handleDeleteDebt,
  } = useDebts();

  const [deletingDebt, setDeletingDebt] = useState<DebtRecord | null>(null);

  const confirmDelete = async () => {
    if (!deletingDebt) return;
    await handleDeleteDebt(deletingDebt.id);
    setDeletingDebt(null);
  };

  const payables = debts.filter((d) => d.type === 'payable' && !d.is_settled);
  const receivables = debts.filter((d) => d.type === 'receivable' && !d.is_settled);
  const settled = debts.filter((d) => d.is_settled);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Hutang & Piutang" 
        subtitle="Pantau pinjaman dan tagihan agar tidak terlupa."
        actions={
          <Button onClick={() => { setEditingDebt(null); setIsModalOpen(true); }}>
            <Plus size={18} />
            Catat Baru
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payables (Hutang ke Orang) */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <ArrowDownLeft size={16} className="text-rose-500" /> Hutang Saya (Payable)
          </h3>
          {loading ? (
            <div className="h-44 bg-slate-100 animate-pulse rounded-3xl" />
          ) : payables.length === 0 ? (
            <Card className="py-10 text-center bg-slate-50/50 border-dashed">
              <p className="text-xs font-bold text-slate-400 uppercase">Tidak ada hutang aktif</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {payables.map((d) => (
                <DebtCard
                  key={d.id}
                  debt={d}
                  onEdit={(debt) => {
                    setEditingDebt(debt);
                    setIsModalOpen(true);
                  }}
                  onMarkPaid={handleMarkAsPaid}
                  onDelete={setDeletingDebt}
                />
              ))}
            </div>
          )}
        </section>

        {/* Receivables (Piutang / Orang Pinjam) */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <ArrowUpRight size={16} className="text-emerald-500" /> Piutang Saya (Receivable)
          </h3>
          {loading ? (
            <div className="h-44 bg-slate-100 animate-pulse rounded-3xl" />
          ) : receivables.length === 0 ? (
            <Card className="py-10 text-center bg-slate-50/50 border-dashed">
              <p className="text-xs font-bold text-slate-400 uppercase">Tidak ada piutang aktif</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {receivables.map((d) => (
                <DebtCard
                  key={d.id}
                  debt={d}
                  onEdit={(debt) => {
                    setEditingDebt(debt);
                    setIsModalOpen(true);
                  }}
                  onMarkPaid={handleMarkAsPaid}
                  onDelete={setDeletingDebt}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Settled Section */}
      {settled.length > 0 && (
        <section className="space-y-4 pt-10 border-t border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Sudah Lunas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settled.map((d) => (
              <Card key={d.id} className="p-4 opacity-60">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{d.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{formatCurrency(d.amount)}</p>
                  </div>
                  <Badge variant="emerald">Lunas</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Debt Modal Form */}
      <DebtModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDebt(null);
        }}
        onSubmit={handleSaveDebt}
        editingDebt={editingDebt}
        isSubmitting={submitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingDebt}
        onClose={() => setDeletingDebt(null)}
        onConfirm={confirmDelete}
        title="Hapus Catatan"
        message={`Hapus catatan "${deletingDebt?.name}"?`}
        confirmLabel="Hapus Catatan"
      />
    </div>
  );
}
