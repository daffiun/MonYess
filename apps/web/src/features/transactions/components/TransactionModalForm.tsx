import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Modal, Button, Input, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Account, Category, TransactionWithRelations } from '@/types';
import { transactionSchema, type TransactionFormValues } from '../schemas/transactionSchema';

export interface TransactionModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  editingTx: TransactionWithRelations | null;
  accounts: Account[];
  categories: Category[];
  isSubmitting: boolean;
}

export function TransactionModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingTx,
  accounts,
  categories,
  isSubmitting,
}: TransactionModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: 'expense',
      amount: 0,
      account_id: '',
      category_id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      note: '',
    },
  });

  const txType = watch('type');

  useEffect(() => {
    if (editingTx) {
      setValue('type', editingTx.type);
      setValue('amount', Number(editingTx.amount));
      setValue('account_id', editingTx.account_id);
      setValue('target_account_id', editingTx.target_account_id || undefined);
      setValue('category_id', editingTx.category_id || undefined);
      setValue('date', editingTx.date);
      setValue('note', editingTx.note || '');
    } else {
      reset({
        type: 'expense',
        amount: 0,
        account_id: '',
        category_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        note: '',
      });
    }
  }, [editingTx, isOpen, setValue, reset]);

  const filteredCategories = categories.filter(
    (c) => c.type === (txType === 'income' ? 'income' : 'expense')
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTx ? 'Ubah Transaksi' : 'Catat Transaksi'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Simpan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          {(['expense', 'income', 'transfer'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setValue('type', type);
                setValue('category_id', '');
              }}
              className={cn(
                'flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all',
                txType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {type === 'expense' ? 'Keluar' : type === 'income' ? 'Masuk' : 'Pindah'}
            </button>
          ))}
        </div>

        <Input
          label="Nominal"
          type="number"
          step="0.01"
          {...register('amount')}
          error={errors.amount?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label={txType === 'transfer' ? 'Dari Akun' : 'Pilih Akun'}
            options={[
              { label: '-- Pilih Akun --', value: '' },
              ...accounts.map((a) => ({ label: a.name, value: a.id })),
            ]}
            {...register('account_id')}
            error={errors.account_id?.message}
          />

          {txType === 'transfer' ? (
            <Select
              label="Ke Akun"
              options={[
                { label: '-- Pilih Akun --', value: '' },
                ...accounts.map((a) => ({ label: a.name, value: a.id })),
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
                  ...filteredCategories.map((c) => ({ label: c.name, value: c.id })),
                ]}
                {...register('category_id')}
                error={errors.category_id?.message}
              />
              {filteredCategories.length === 0 && (
                <p className="text-[10px] text-amber-600 font-bold leading-tight mt-1">
                  ⚠️ Belum ada kategori {txType === 'income' ? 'pemasukan' : 'pengeluaran'}.{' '}
                  <Link to="/categories" className="underline">
                    Buat di sini
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>

        <Input label="Tanggal" type="date" {...register('date')} error={errors.date?.message} />
        <Input label="Catatan" placeholder="Opsional" {...register('note')} error={errors.note?.message} />
      </form>
    </Modal>
  );
}
