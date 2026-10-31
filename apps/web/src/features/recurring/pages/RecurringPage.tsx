import { useState } from 'react';
import { Plus, Repeat, Edit2, Trash2, Power, Calendar, Info } from 'lucide-react';
import { PageHeader, Button, Card, Badge } from '@/components/ui';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { cn } from '@/lib/utils';
import type { RecurringTransactionRecord } from '@/types';
import { useRecurring } from '../hooks/useRecurring';
import { RecurringModalForm } from '../components/RecurringModalForm';

export default function RecurringPage() {
  const {
    recurring,
    accounts,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingRecurring,
    setEditingRecurring,
    submitting,
    handleSaveRecurring,
    handleToggleActive,
    handleDeleteRecurring,
  } = useRecurring();

  const [deletingRecurring, setDeletingRecurring] = useState<RecurringTransactionRecord | null>(null);

  const confirmDelete = async () => {
    if (!deletingRecurring) return;
    await handleDeleteRecurring(deletingRecurring.id);
    setDeletingRecurring(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Transaksi Rutin" 
        subtitle="Jadwalkan pengeluaran atau pemasukan berulangmu."
        actions={
          <Button onClick={() => { setEditingRecurring(null); setIsModalOpen(true); }}>
            <Plus size={18} />
            Jadwalkan
          </Button>
        }
      />

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-100 flex gap-4 p-6">
        <Info className="text-blue-600 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">
            Penting: Automasi Belum Aktif
          </h4>
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Untuk sekarang, kamu baru bisa menyimpan jadwal transaksi. Proses otomatisasi (pencatatan otomatis) akan diaktifkan melalui sistem server di fase pengembangan berikutnya.
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />)}
          </div>
        ) : recurring.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <Repeat size={32} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase">Belum ada transaksi rutin</p>
          </Card>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50">
              {recurring.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors',
                    !item.active && 'opacity-60 grayscale-[0.5]'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center',
                        item.type === 'expense'
                          ? 'bg-rose-50 text-rose-500'
                          : item.type === 'income'
                          ? 'bg-emerald-50 text-emerald-500'
                          : 'bg-blue-50 text-blue-500'
                      )}
                    >
                      <Repeat size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="slate">{item.frequency}</Badge>
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                          <Calendar size={10} /> Next: {formatDate(item.next_date, 'dd MMM')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-black',
                          item.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                        )}
                      >
                        {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {accounts.find((a) => a.id === item.account_id)?.name || 'Akun'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn('p-2 h-9 w-9', item.active ? 'text-slate-400' : 'text-emerald-600')}
                        onClick={() => handleToggleActive(item)}
                      >
                        <Power size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-9 w-9 text-slate-400"
                        onClick={() => {
                          setEditingRecurring(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-9 w-9 text-rose-400"
                        onClick={() => setDeletingRecurring(item)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recurring Modal Form */}
      <RecurringModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecurring(null);
        }}
        onSubmit={handleSaveRecurring}
        editingRecurring={editingRecurring}
        accounts={accounts}
        isSubmitting={submitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingRecurring}
        onClose={() => setDeletingRecurring(null)}
        onConfirm={confirmDelete}
        title="Hapus Transaksi Rutin"
        message={`Hapus jadwal transaksi rutin "${deletingRecurring?.name}"?`}
        confirmLabel="Hapus Jadwal"
      />
    </div>
  );
}
