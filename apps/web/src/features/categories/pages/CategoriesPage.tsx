import { useState } from 'react';
import { Plus, Tag, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { PageHeader, Button, Card } from '@/components/ui';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { Category } from '@/types';
import { useCategories } from '../hooks/useCategories';
import { CategoryModalForm } from '../components/CategoryModalForm';

export default function CategoriesPage() {
  const {
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    setEditingCategory,
    submitting,
    handleSaveCategory,
    handleCreateDefaults,
    handleDeleteCategory,
  } = useCategories();

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    await handleDeleteCategory(deletingCategory.id);
    setDeletingCategory(null);
  };

  const incomes = categories.filter((c) => c.type === 'income');
  const expenses = categories.filter((c) => c.type === 'expense');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Kategori" 
        subtitle="Klasifikasikan transaksi agar laporan lebih akurat."
        actions={
          <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}>
            <Plus size={18} />
            Tambah Kategori
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
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
          <Button onClick={handleCreateDefaults} isLoading={submitting}>Buat Kategori Default</Button>
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
                {expenses.map((cat) => (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 group">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-slate-400"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-rose-400 hover:text-rose-600"
                        onClick={() => setDeletingCategory(cat)}
                      >
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
                {incomes.map((cat) => (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 group">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-slate-400"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-rose-400 hover:text-rose-600"
                        onClick={() => setDeletingCategory(cat)}
                      >
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

      {/* Category Modal Form */}
      <CategoryModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSaveCategory}
        editingCategory={editingCategory}
        isSubmitting={submitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={confirmDelete}
        title="Hapus Kategori"
        message={`Hapus kategori "${deletingCategory?.name}"? Transaksi yang menggunakan kategori ini mungkin terdampak.`}
        confirmLabel="Hapus Kategori"
      />
    </div>
  );
}
