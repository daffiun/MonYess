import { useState, useEffect } from 'react';
import { Plus, Tag, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Category } from '@financebot/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const DEFAULT_EXPENSES = [
  'Makan & Minum', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 
  'Kesehatan', 'Pendidikan', 'Donasi', 'Cicilan', 'Lainnya'
];

const DEFAULT_INCOMES = [
  'Gaji', 'Freelance', 'Bonus', 'Investasi', 'Hadiah', 'Lainnya'
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingAccount] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: 'expense',
    }
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (values: CategoryFormValues) => {
    setSubmitting(true);
    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', editingCategory.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([{ ...values, user_id: user?.id }]);
      if (error) alert(error.message);
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setEditingAccount(null);
    reset();
    fetchCategories();
  };

  const createDefaults = async () => {
    setSubmitting(true);
    const expenseData = DEFAULT_EXPENSES.map(name => ({ user_id: user?.id, name, type: 'expense' }));
    const incomeData = DEFAULT_INCOMES.map(name => ({ user_id: user?.id, name, type: 'income' }));
    
    const { error } = await supabase
      .from('categories')
      .insert([...expenseData, ...incomeData]);
    
    if (error) alert(error.message);
    setSubmitting(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return;
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) alert('Kategori tidak bisa dihapus karena mungkin sudah digunakan dalam transaksi.');
    else fetchCategories();
  };

  const incomes = categories.filter(c => c.type === 'income');
  const expenses = categories.filter(c => c.type === 'expense');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Kategori" 
        subtitle="Klasifikasikan transaksi agar laporan lebih akurat."
        actions={
          <Button onClick={() => { setEditingAccount(null); reset(); setIsModalOpen(true); }}>
            <Plus size={18} />
            Tambah Kategori
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
            <Tag size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada kategori</h3>
          <p className="text-slate-500 max-w-sm mb-8">Gunakan kategori bawaan kami agar kamu bisa langsung mencatat.</p>
          <Button onClick={createDefaults} isLoading={submitting}>Buat Kategori Default</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Expenses */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
              <ArrowDownLeft size={16} className="text-rose-500" /> Pengeluaran
            </h3>
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-50">
                {expenses.map(cat => (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 group">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-slate-400" onClick={() => {
                        setEditingAccount(cat);
                        setValue('name', cat.name);
                        setValue('type', cat.type as any);
                        setIsModalOpen(true);
                      }}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-rose-400 hover:text-rose-600" onClick={() => handleDelete(cat.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Incomes */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
              <ArrowUpRight size={16} className="text-emerald-500" /> Pemasukan
            </h3>
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-50">
                {incomes.map(cat => (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 group">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-slate-400" onClick={() => {
                        setEditingAccount(cat);
                        setValue('name', cat.name);
                        setValue('type', cat.type as any);
                        setIsModalOpen(true);
                      }}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-rose-400 hover:text-rose-600" onClick={() => handleDelete(cat.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Category Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? 'Ubah Kategori' : 'Tambah Kategori'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={submitting}>
              {editingCategory ? 'Simpan' : 'Tambah'}
            </Button>
          </>
        }
      >
        <form className="space-y-6">
          <Input 
            label="Nama Kategori" 
            placeholder="Misal: Jajan, Transport, Gaji" 
            {...register('name')}
            error={errors.name?.message}
          />
          <Select 
            label="Jenis Kategori" 
            options={[
              { label: 'Pengeluaran', value: 'expense' },
              { label: 'Pemasukan', value: 'income' },
            ]}
            {...register('type')}
            error={errors.type?.message}
          />
        </form>
      </Modal>
    </div>
  );
}
