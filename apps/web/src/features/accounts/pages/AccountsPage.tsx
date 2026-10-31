import { Plus, Wallet, Edit2, Power } from 'lucide-react';
import { PageHeader, Button, Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Account } from '@/types';
import { useAccounts } from '../hooks/useAccounts';
import { AccountModalForm } from '../components/AccountModalForm';
import { TYPE_ICONS, TYPE_COLORS } from '../constants/account.constants';

export default function AccountsPage() {
  const {
    accounts,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingAccount,
    setEditingAccount,
    submitting,
    handleSaveAccount,
    handleToggleActive,
  } = useAccounts();

  const handleEdit = (acc: Account) => {
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Akun & Dompet" 
        subtitle="Kelola semua sumber danamu di satu tempat."
        actions={
          <Button onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}>
            <Plus size={18} />
            Tambah Akun
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
            <Wallet size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada akun</h3>
          <p className="text-slate-500 max-w-sm mb-8">
            Mulai dengan membuat akun pertama kamu seperti Dompet Tunai atau Bank.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Buat Akun Pertama</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => {
            const Icon = TYPE_ICONS[acc.type] || Wallet;
            const colorClass = TYPE_COLORS[acc.type] || 'bg-slate-500';

            return (
              <div
                key={acc.id}
                className={cn(
                  "bg-white p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300",
                  !acc.is_active && "opacity-60 grayscale-[0.5]"
                )}
              >
                <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-125", colorClass)} />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={cn("p-4 rounded-2xl text-white shadow-lg", colorClass)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="p-2 h-9 w-9" onClick={() => handleEdit(acc)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("p-2 h-9 w-9", !acc.is_active ? "text-emerald-600" : "text-slate-400")}
                      onClick={() => handleToggleActive(acc)}
                    >
                      <Power size={16} />
                    </Button>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{acc.type}</p>
                  <h3 className="text-2xl font-black text-slate-900">Rp {Number(acc.balance).toLocaleString('id-ID')}</h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">{acc.name}</p>
                  
                  {!acc.is_active && (
                    <div className="mt-4">
                      <Badge variant="slate">Nonaktif</Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button 
            onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}
            className="border-2 border-dashed border-slate-200 p-7 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer min-h-[180px]"
          >
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
              <Plus size={24} />
            </div>
            <p className="text-sm font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest">
              Tambah Akun Baru
            </p>
          </button>
        </div>
      )}

      {/* Account Modal Form */}
      <AccountModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSaveAccount}
        editingAccount={editingAccount}
        isSubmitting={submitting}
      />
    </div>
  );
}
