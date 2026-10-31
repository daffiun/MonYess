import { useState } from 'react';
import { Plus, Tag, ArrowUpRight, ArrowDownLeft, Calendar, CreditCard, Edit2, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Badge } from '@/components/ui';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';
import type { TransactionWithRelations } from '@/types';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionModalForm } from '../components/TransactionModalForm';

export default function TransactionsPage() {
  const {
    transactions,
    accounts,
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingTx,
    setEditingTx,
    submitting,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    handleSaveTransaction,
    handleDeleteTransaction,
  } = useTransactions();

  const [deletingTx, setDeletingTx] = useState<TransactionWithRelations | null>(null);

  const confirmDelete = async () => {
    if (!deletingTx) return;
    await handleDeleteTransaction(deletingTx.id);
    setDeletingTx(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Riwayat Transaksi" 
        subtitle="Semua catatan keuanganmu secara mendetail."
        actions={
          <>
            <Link to="/categories">
              <Button variant="outline">
                <Tag size={18} />
                Kelola Kategori
              </Button>
            </Link>
            <Button onClick={() => { 
              if (accounts.length === 0) {
                alert('Kamu harus membuat Akun dulu sebelum mencatat transaksi.');
                return;
              }
              setEditingTx(null); 
              setIsModalOpen(true); 
            }}>
              <Plus size={18} />
              Catat Baru
            </Button>
          </>
        }
      />

      {/* Filters */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        accountFilter={accountFilter}
        onAccountFilterChange={setAccountFilter}
        accounts={accounts}
      />

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Tidak ditemukan transaksi
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaksi</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Kategori</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Metode</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</th>
                  <th className="px-6 py-5 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          tx.type === 'expense' ? 'bg-rose-50 text-rose-500' : 
                          tx.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                        )}>
                          {tx.type === 'expense' ? <ArrowDownLeft size={18} /> : 
                           tx.type === 'income' ? <ArrowUpRight size={18} /> : <Tag size={18} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{tx.category?.name || 'Transfer'}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                              <Calendar size={10} /> {tx.date}
                            </span>
                            {tx.note && (
                              <span className="text-[10px] text-slate-400 font-medium truncate italic max-w-[150px]">"{tx.note}"</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <Badge variant={tx.type === 'income' ? 'emerald' : tx.type === 'expense' ? 'rose' : 'blue'}>
                        {tx.type === 'transfer' ? 'Transfer' : tx.category?.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard size={14} className="text-slate-400" />
                        <span className="text-xs font-bold">{tx.account?.name}</span>
                        {tx.type === 'transfer' && (
                          <>
                             <ArrowUpRight size={10} />
                             <span className="text-xs font-bold">{tx.target_account?.name}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className={cn(
                      "px-6 py-5 text-sm font-black text-right",
                      tx.type === 'expense' ? 'text-rose-600' : 
                      tx.type === 'income' ? 'text-emerald-600' : 'text-blue-600'
                    )}>
                      {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''} Rp {Number(tx.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 h-8 w-8 text-slate-400" 
                          onClick={() => {
                            setEditingTx(tx);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 h-8 w-8 text-rose-400" 
                          onClick={() => setDeletingTx(tx)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tx Modal Form */}
      <TransactionModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTx(null);
        }}
        onSubmit={handleSaveTransaction}
        editingTx={editingTx}
        accounts={accounts}
        categories={categories}
        isSubmitting={submitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        onConfirm={confirmDelete}
        title="Hapus Transaksi"
        message="Hapus transaksi ini? Saldo akun akan dikembalikan secara otomatis."
        confirmLabel="Hapus Transaksi"
      />
    </div>
  );
}
