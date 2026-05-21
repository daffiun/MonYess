import { useState, useEffect } from 'react';
import { 
  Plus, 
  Repeat, 
  Edit2, 
  Trash2, 
  Power,
  Calendar,
  Clock,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Info
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatCurrency, formatDate } from '../utils/finance';

const recurringSchema = z.object({
  name: z.string().min(1, 'Nama transaksi wajib diisi'),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  account_id: z.string().min(1, 'Akun wajib dipilih'),
  category_id: z.string().optional(),
  target_account_id: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  next_date: z.string().min(1, 'Tanggal berikutnya wajib diisi'),
});

type RecurringFormValues = z.infer<typeof recurringSchema>;

export default function RecurringPage() {
  const { user } = useAuth();
  const [recurring, setRecurring] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<RecurringFormValues>({
    resolver: zodResolver(recurringSchema) as any,
    defaultValues: {
      type: 'expense',
      frequency: 'monthly',
    }
  });

  const txType = watch('type');

  const fetchData = async () => {
    setLoading(true);
    const { data: recurringData } = await supabase.from('recurring_transactions').select('*').order('created_at', { ascending: false });
    const { data: accData } = await supabase.from('accounts').select('*').eq('is_active', true);
    const { data: catData } = await supabase.from('categories').select('*');
    
    setRecurring(recurringData || []);
    setAccounts(accData || []);
    setCategories(catData || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (values: RecurringFormValues) => {
    setSubmitting(true);
    if (editingRecurring) {
      const { error } = await supabase.from('recurring_transactions').update(values).eq('id', editingRecurring.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('recurring_transactions').insert([{ ...values, user_id: user?.id }]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingRecurring(null);
    reset();
    fetchData();
  };

  const toggleActive = async (item: any) => {
    const { error } = await supabase.from('recurring_transactions').update({ active: !item.active }).eq('id', item.id);
    if (error) alert(error.message);
    else fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jadwal ini?')) return;
    const { error } = await supabase.from('recurring_transactions').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Transaksi Rutin" 
        subtitle="Jadwalkan pengeluaran atau pemasukan berulangmu."
        actions={
          <Button onClick={() => { setEditingRecurring(null); reset(); setIsModalOpen(true); }}>
            <Plus size={18} />
            Jadwalkan
          </Button>
        }
      />

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-100 flex gap-4 p-6">
        <Info className="text-blue-600 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Penting: Automasi Belum Aktif</h4>
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Untuk sekarang, kamu baru bisa menyimpan jadwal transaksi. Proses otomatisasi (pencatatan otomatis) akan diaktifkan melalui sistem server di fase pengembangan berikutnya.
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />)}
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
              {recurring.map(item => (
                <div key={item.id} className={cn("p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors", !item.active && "opacity-60 grayscale-[0.5]")}>
                   <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.type === 'expense' ? "bg-rose-50 text-rose-500" : item.type === 'income' ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500")}>
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
                         <p className={cn("text-sm font-black", item.type === 'expense' ? "text-rose-600" : "text-emerald-600")}>
                           {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                         </p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{accounts.find(a => a.id === item.account_id)?.name || 'Akun'}</p>
                      </div>
                      <div className="flex gap-1">
                         <Button variant="ghost" size="sm" className={cn("p-2 h-9 w-9", item.active ? "text-slate-400" : "text-emerald-600")} onClick={() => toggleActive(item)}>
                           <Power size={16} />
                         </Button>
                         <Button variant="ghost" size="sm" className="p-2 h-9 w-9 text-slate-400" onClick={() => {
                            setEditingRecurring(item);
                            setValue('name', item.name);
                            setValue('type', item.type);
                            setValue('amount', item.amount);
                            setValue('account_id', item.account_id);
                            setValue('category_id', item.category_id || '');
                            setValue('frequency', item.frequency);
                            setValue('next_date', item.next_date);
                            setIsModalOpen(true);
                         }}>
                           <Edit2 size={16} />
                         </Button>
                         <Button variant="ghost" size="sm" className="p-2 h-9 w-9 text-rose-400" onClick={() => handleDelete(item.id)}>
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Jadwalkan Transaksi"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit as any)} isLoading={submitting}>Simpan Jadwal</Button>
          </>
        }
      >
        <form className="space-y-6">
           <div className="flex p-1 bg-slate-100 rounded-2xl">
            {['expense', 'income'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('type', type as any)}
                className={cn(
                  "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  txType === type ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {type === 'expense' ? 'Keluar' : 'Masuk'}
              </button>
            ))}
          </div>
          <Input label="Nama Transaksi" placeholder="Misal: Tagihan Listrik, Spotify" {...register('name')} error={errors.name?.message} />
          <Input label="Nominal" type="number" {...register('amount')} error={errors.amount?.message} />
          
          <div className="grid grid-cols-2 gap-4">
             <Select label="Akun Sumber" options={accounts.map(a => ({ label: a.name, value: a.id }))} {...register('account_id')} error={errors.account_id?.message} />
             <Select label="Frekuensi" options={[
                { label: 'Harian', value: 'daily' },
                { label: 'Mingguan', value: 'weekly' },
                { label: 'Bulanan', value: 'monthly' },
                { label: 'Tahunan', value: 'yearly' },
             ]} {...register('frequency')} error={errors.frequency?.message} />
          </div>

          <Input label="Tanggal Berikutnya" type="date" {...register('next_date')} error={errors.next_date?.message} />
        </form>
      </Modal>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
