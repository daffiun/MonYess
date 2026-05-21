import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Wallet, CreditCard, Banknote, Landmark, Smartphone, Trash2, Edit2, Power } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Account } from '@financebot/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const accountSchema = z.object({
  name: z.string().min(1, 'Nama akun wajib diisi'),
  type: z.enum(['cash', 'bank', 'ewallet', 'credit_card', 'investment', 'debt', 'other']),
  balance: z.coerce.number().min(0, 'Saldo tidak boleh negatif'),
  color: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

const ACCOUNT_TYPES = [
  { label: 'Tunai (Cash)', value: 'cash' },
  { label: 'Bank', value: 'bank' },
  { label: 'E-Wallet', value: 'ewallet' },
  { label: 'Kartu Kredit', value: 'credit_card' },
  { label: 'Investasi', value: 'investment' },
  { label: 'Hutang', value: 'debt' },
  { label: 'Lainnya', value: 'other' },
];

const TYPE_ICONS: Record<string, any> = {
  cash: Banknote,
  bank: Landmark,
  ewallet: Smartphone,
  credit_card: CreditCard,
  investment: Wallet,
  debt: CreditCard,
  other: Wallet,
};

const TYPE_COLORS: Record<string, string> = {
  cash: 'bg-amber-500',
  bank: 'bg-blue-600',
  ewallet: 'bg-emerald-500',
  credit_card: 'bg-rose-500',
  investment: 'bg-indigo-600',
  debt: 'bg-slate-800',
  other: 'bg-slate-500',
};

export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema) as any,
    defaultValues: {
      name: '',
      type: 'cash',
      balance: 0,
    }
  });

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching accounts:', error);
    else setAccounts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const onSubmit = async (values: AccountFormValues) => {
    setSubmitting(true);
    if (editingAccount) {
      const { error } = await supabase
        .from('accounts')
        .update(values)
        .eq('id', editingAccount.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from('accounts')
        .insert([{ ...values, user_id: user?.id }]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingAccount(null);
    reset();
    fetchAccounts();
  };

  const handleEdit = (acc: Account) => {
    setEditingAccount(acc);
    setValue('name', acc.name);
    setValue('type', acc.type);
    setValue('balance', acc.balance);
    setValue('color', acc.color || '');
    setIsModalOpen(true);
  };

  const toggleActive = async (acc: Account) => {
    const { error } = await supabase
      .from('accounts')
      .update({ is_active: !acc.is_active })
      .eq('id', acc.id);
    if (error) alert(error.message);
    else fetchAccounts();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Akun & Dompet" 
        subtitle="Kelola semua sumber danamu di satu tempat."
        actions={
          <Button onClick={() => { setEditingAccount(null); reset(); setIsModalOpen(true); }}>
            <Plus size={18} />
            Tambah Akun
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
            <Wallet size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada akun</h3>
          <p className="text-slate-500 max-w-sm mb-8">Mulai dengan membuat akun pertama kamu seperti Dompet Tunai atau Bank.</p>
          <Button onClick={() => setIsModalOpen(true)}>Buat Akun Pertama</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => {
            const Icon = TYPE_ICONS[acc.type] || Wallet;
            const colorClass = TYPE_COLORS[acc.type] || 'bg-slate-500';

            return (
              <div key={acc.id} className={cn(
                "bg-white p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300",
                !acc.is_active && "opacity-60 grayscale-[0.5]"
              )}>
                <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-125", colorClass)}></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={cn("p-4 rounded-2xl text-white shadow-lg", colorClass)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="p-2 h-9 w-9" onClick={() => handleEdit(acc)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className={cn("p-2 h-9 w-9", !acc.is_active ? "text-emerald-600" : "text-slate-400")} onClick={() => toggleActive(acc)}>
                      <Power size={16} />
                    </Button>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{acc.type}</p>
                  <h3 className="text-2xl font-black text-slate-900">Rp {acc.balance.toLocaleString('id-ID')}</h3>
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
            onClick={() => { setEditingAccount(null); reset(); setIsModalOpen(true); }}
            className="border-2 border-dashed border-slate-200 p-7 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer min-h-[180px]"
          >
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
              <Plus size={24} />
            </div>
            <p className="text-sm font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest">Tambah Akun Baru</p>
          </button>
        </div>
      )}

      {/* Account Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingAccount ? 'Ubah Akun' : 'Tambah Akun Baru'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit as any)} isLoading={submitting}>
              {editingAccount ? 'Simpan Perubahan' : 'Buat Akun'}
            </Button>
          </>
        }
      >
        <form className="space-y-6">
          <Input 
            label="Nama Akun" 
            placeholder="Misal: Bank BCA, Dompet Utama" 
            {...register('name')}
            error={errors.name?.message}
          />
          <Select 
            label="Jenis Akun" 
            options={ACCOUNT_TYPES}
            {...register('type')}
            error={errors.type?.message}
          />
          <Input 
            label="Saldo Saat Ini" 
            type="number"
            step="0.01"
            placeholder="0" 
            {...register('balance')}
            error={errors.balance?.message}
          />
        </form>
      </Modal>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
