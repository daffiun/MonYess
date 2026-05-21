import { useState, useEffect } from 'react';
import { 
  Plus, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Search
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
import { isAfter, isBefore, addDays, format, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatCurrency, formatDate } from '../utils/finance';

const debtSchema = z.object({
  name: z.string().min(1, 'Nama/Keterangan wajib diisi'),
  type: z.enum(['payable', 'receivable']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  remaining: z.coerce.number().min(0),
  due_date: z.string().optional(),
});

type DebtFormValues = z.infer<typeof debtSchema>;

export default function DebtsPage() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema) as any,
  });

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('debts').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setDebts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (values: DebtFormValues) => {
    setSubmitting(true);
    if (editingDebt) {
      const { error } = await supabase.from('debts').update(values).eq('id', editingDebt.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('debts').insert([{ ...values, user_id: user?.id }]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingDebt(null);
    reset();
    fetchData();
  };

  const handleMarkAsPaid = async (id: string) => {
    const { error } = await supabase.from('debts').update({ remaining: 0, is_settled: true }).eq('id', id);
    if (error) alert(error.message);
    else fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus catatan ini?')) return;
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchData();
  };

  const payables = debts.filter(d => d.type === 'payable' && !d.is_settled);
  const receivables = debts.filter(d => d.type === 'receivable' && !d.is_settled);
  const settled = debts.filter(d => d.is_settled);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Hutang & Piutang" 
        subtitle="Pantau pinjaman dan tagihan agar tidak terlupa."
        actions={
          <Button onClick={() => { setEditingDebt(null); reset({ remaining: 0 }); setIsModalOpen(true); }}>
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
           {payables.length === 0 ? (
             <Card className="py-10 text-center bg-slate-50/50 border-dashed">
                <p className="text-xs font-bold text-slate-400 uppercase">Tidak ada hutang aktif</p>
             </Card>
           ) : (
             <div className="space-y-4">
               {payables.map(d => (
                 <DebtCard key={d.id} debt={d} onEdit={setEditingDebt} onMarkPaid={handleMarkAsPaid} onDelete={handleDelete} setValue={setValue} setIsModalOpen={setIsModalOpen} />
               ))}
             </div>
           )}
        </section>

        {/* Receivables (Piutang / Orang Pinjam) */}
        <section className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
             <ArrowUpRight size={16} className="text-emerald-500" /> Piutang Saya (Receivable)
           </h3>
           {receivables.length === 0 ? (
             <Card className="py-10 text-center bg-slate-50/50 border-dashed">
                <p className="text-xs font-bold text-slate-400 uppercase">Tidak ada piutang aktif</p>
             </Card>
           ) : (
             <div className="space-y-4">
               {receivables.map(d => (
                 <DebtCard key={d.id} debt={d} onEdit={setEditingDebt} onMarkPaid={handleMarkAsPaid} onDelete={handleDelete} setValue={setValue} setIsModalOpen={setIsModalOpen} />
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
              {settled.map(d => (
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

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingDebt ? 'Ubah Catatan' : 'Catat Hutang/Piutang'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit as any)} isLoading={submitting}>Simpan</Button>
          </>
        }
      >
        <form className="space-y-6">
          <Select 
            label="Jenis" 
            options={[
              { label: 'Hutang ke Orang (Saya meminjam)', value: 'payable' },
              { label: 'Piutang ke Orang (Orang meminjam)', value: 'receivable' },
            ]}
            {...register('type')}
            error={errors.type?.message}
          />
          <Input label="Keterangan / Nama Orang" placeholder="Misal: Pinjaman Modal, Hutang ke Andi" {...register('name')} error={errors.name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Pinjaman" type="number" {...register('amount')} error={errors.amount?.message} />
            <Input label="Sisa Belum Bayar" type="number" {...register('remaining')} error={errors.remaining?.message} />
          </div>
          <Input label="Jatuh Tempo (Opsional)" type="date" {...register('due_date')} />
        </form>
      </Modal>
    </div>
  );
}

function DebtCard({ debt, onMarkPaid, onDelete, setValue, setEditingDebt, setIsModalOpen }: any) {
  const isOverdue = debt.due_date && isBefore(parseISO(debt.due_date), new Date());
  const isDueSoon = debt.due_date && isAfter(parseISO(debt.due_date), new Date()) && isBefore(parseISO(debt.due_date), addDays(new Date(), 7));
  const progress = Math.round(((debt.amount - debt.remaining) / debt.amount) * 100);

  return (
    <Card className="p-6 group relative overflow-hidden">
       <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", debt.type === 'payable' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100")}>
               <CreditCard size={20} />
             </div>
             <div>
                <h4 className="font-bold text-slate-900">{debt.name}</h4>
                <div className="flex gap-2 mt-1">
                   {isOverdue && <Badge variant="rose">Melewati Batas</Badge>}
                   {isDueSoon && <Badge variant="amber">Segera Tempo</Badge>}
                </div>
             </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-emerald-600" title="Tandai Lunas" onClick={() => onMarkPaid(debt.id)}>
              <CheckCircle2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-slate-400" onClick={() => {
              setEditingDebt(debt);
              setValue('name', debt.name);
              setValue('type', debt.type);
              setValue('amount', debt.amount);
              setValue('remaining', debt.remaining);
              setValue('due_date', debt.due_date || '');
              setIsModalOpen(true);
            }}>
              <Edit2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-rose-400" onClick={() => onDelete(debt.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
       </div>

       <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>Pembayaran: {progress}%</span>
             {debt.due_date && <span className="flex items-center gap-1"><Clock size={10}/> {formatDate(debt.due_date)}</span>}
          </div>
          <ProgressBar value={progress} size="sm" barClassName={debt.type === 'payable' ? 'bg-rose-500' : 'bg-emerald-500'} />
          <div className="flex justify-between items-end">
             <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Sisa</p>
                <p className="text-lg font-black text-slate-900">{formatCurrency(debt.remaining)}</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] text-slate-400 font-bold uppercase">Awal</p>
                <p className="text-xs font-bold text-slate-500">{formatCurrency(debt.amount)}</p>
             </div>
          </div>
       </div>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
