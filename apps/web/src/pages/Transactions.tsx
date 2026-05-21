import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Calendar, Tag, CreditCard, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Transaction, Account, Category } from '@financebot/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  account_id: z.string().min(1, 'Akun wajib dipilih'),
  target_account_id: z.string().optional(),
  category_id: z.string().optional(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  note: z.string().optional(),
}).refine(data => {
  if (data.type === 'transfer' && !data.target_account_id) return false;
  if (data.type === 'transfer' && data.account_id === data.target_account_id) return false;
  if (data.type !== 'transfer' && !data.category_id) return false;
  return true;
}, {
  message: "Input tidak valid (cek akun transfer atau kategori)",
  path: ["category_id"]
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: 'expense',
      amount: 0,
      account_id: '',
      category_id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      note: '',
    }
  });

  const txType = watch('type');

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Accounts
    const { data: accData } = await supabase.from('accounts').select('*').eq('is_active', true);
    setAccounts(accData || []);

    // Fetch Categories
    const { data: catData } = await supabase.from('categories').select('*');
    setCategories(catData || []);

    // Fetch Transactions
    let query = supabase
      .from('transactions')
      .select(`
        *,
        account:account_id(name),
        target_account:target_account_id(name),
        category:category_id(name)
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (typeFilter !== 'all') query = query.eq('type', typeFilter);
    if (accountFilter !== 'all') query = query.eq('account_id', accountFilter);
    
    const { data: txData } = await query;
    setTransactions(txData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [typeFilter, accountFilter]);

  const onSubmit = async (values: TransactionFormValues) => {
    setSubmitting(true);
    try {
      if (editingTx) {
        const { error } = await supabase.rpc('update_transaction_with_balance_safe', {
          p_tx_id: editingTx.id,
          p_user_id: user?.id,
          p_account_id: values.account_id,
          p_target_account_id: values.type === 'transfer' ? values.target_account_id : null,
          p_category_id: values.type !== 'transfer' ? values.category_id : null,
          p_amount: values.amount,
          p_type: values.type,
          p_date: values.date,
          p_note: values.note || ''
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('create_transaction_with_balance', {
          p_user_id: user?.id,
          p_account_id: values.account_id,
          p_target_account_id: values.type === 'transfer' ? values.target_account_id : null,
          p_category_id: values.type !== 'transfer' ? values.category_id : null,
          p_amount: values.amount,
          p_type: values.type,
          p_date: values.date,
          p_note: values.note || ''
        });
        if (error) throw error;
      }
      setIsModalOpen(false);
      reset();
      setEditingTx(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tx: any) => {
    if (!confirm('Hapus transaksi ini? Saldo akun akan dikembalikan.')) return;
    const { error } = await supabase.rpc('delete_transaction_with_balance', {
      p_tx_id: tx.id,
      p_user_id: user?.id
    });
    if (error) alert(error.message);
    else fetchData();
  };

  const filteredTx = transactions.filter(tx => 
    tx.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.account?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(c => c.type === (txType === 'income' ? 'income' : 'expense'));

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
              reset({
                type: 'expense',
                amount: 0,
                account_id: '',
                category_id: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                note: '',
              }); 
              setIsModalOpen(true); 
            }}>
              <Plus size={18} />
              Catat Baru
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Cari catatan atau kategori..." 
            className="pl-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select 
            className="w-32"
            options={[
              { label: 'Semua Tipe', value: 'all' },
              { label: 'Pemasukan', value: 'income' },
              { label: 'Pengeluaran', value: 'expense' },
              { label: 'Transfer', value: 'transfer' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Select 
            className="w-40"
            options={[
              { label: 'Semua Akun', value: 'all' },
              ...accounts.map(a => ({ label: a.name, value: a.id }))
            ]}
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)}
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tidak ditemukan transaksi</p>
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
                {filteredTx.map((tx) => (
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
                      {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-slate-400" onClick={() => {
                          setEditingTx(tx);
                          setValue('type', tx.type);
                          setValue('amount', tx.amount);
                          setValue('account_id', tx.account_id);
                          setValue('target_account_id', tx.target_account_id || undefined);
                          setValue('category_id', tx.category_id || undefined);
                          setValue('date', tx.date);
                          setValue('note', tx.note || '');
                          setIsModalOpen(true);
                        }}>
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-rose-400" onClick={() => handleDelete(tx)}>
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

      {/* Tx Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTx ? 'Ubah Transaksi' : 'Catat Transaksi'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit as any)} isLoading={submitting}>Simpan</Button>
          </>
        }
      >
        <form className="space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            {['expense', 'income', 'transfer'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setValue('type', type as any);
                  setValue('category_id', ''); // Clear category when switching types
                }}
                className={cn(
                  "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  txType === type ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {type === 'expense' ? 'Keluar' : type === 'income' ? 'Masuk' : 'Pindah'}
              </button>
            ))}
          </div>

          <Input label="Nominal" type="number" step="0.01" {...register('amount')} error={errors.amount?.message} />
          
          <div className="grid grid-cols-2 gap-4">
             <Select 
                label={txType === 'transfer' ? 'Dari Akun' : 'Pilih Akun'} 
                options={[
                  { label: '-- Pilih Akun --', value: '' },
                  ...accounts.map(a => ({ label: a.name, value: a.id }))
                ]} 
                {...register('account_id')} 
                error={errors.account_id?.message}
             />
             {txType === 'transfer' ? (
                <Select 
                  label="Ke Akun" 
                  options={[
                    { label: '-- Pilih Akun --', value: '' },
                    ...accounts.map(a => ({ label: a.name, value: a.id }))
                  ]} 
                  {...register('target_account_id')} 
                  error={errors.target_account_id?.message}
                />
             ) : (
                <div className="space-y-1">
                  <Select 
                    label="Kategori" 
                    options={[
                      { label: '-- Pilih Kategori --', value: '' },
                      ...filteredCategories.map(c => ({ label: c.name, value: c.id }))
                    ]} 
                    {...register('category_id')} 
                    error={errors.category_id?.message}
                  />
                  {filteredCategories.length === 0 && !loading && (
                    <p className="text-[10px] text-amber-600 font-bold leading-tight mt-1">
                      ⚠️ Belum ada kategori {txType === 'income' ? 'pemasukan' : 'pengeluaran'}. <Link to="/categories" className="underline">Buat di sini</Link>
                    </p>
                  )}
                </div>
             )}
          </div>

          <Input label="Tanggal" type="date" {...register('date')} error={errors.date?.message} />
          <Input label="Catatan" placeholder="Opsional" {...register('note')} error={errors.note?.message} />
        </form>
      </Modal>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
