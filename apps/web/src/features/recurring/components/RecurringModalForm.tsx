import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Account, RecurringTransactionRecord } from '@/types';
import { recurringSchema, type RecurringFormValues } from '../schemas/recurringSchema';

export interface RecurringModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RecurringFormValues) => Promise<void>;
  editingRecurring: RecurringTransactionRecord | null;
  accounts: Account[];
  isSubmitting: boolean;
}

export function RecurringModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingRecurring,
  accounts,
  isSubmitting,
}: RecurringModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecurringFormValues>({
    resolver: zodResolver(recurringSchema) as any,
    defaultValues: {
      type: 'expense',
      frequency: 'monthly',
      name: '',
      amount: 0,
      account_id: '',
      next_date: '',
    },
  });

  const txType = watch('type');

  useEffect(() => {
    if (editingRecurring) {
      setValue('name', editingRecurring.name);
      setValue('type', editingRecurring.type);
      setValue('amount', editingRecurring.amount);
      setValue('account_id', editingRecurring.account_id || '');
      setValue('category_id', editingRecurring.category_id || '');
      setValue('frequency', editingRecurring.frequency);
      setValue('next_date', editingRecurring.next_date);
    } else {
      reset({
        type: 'expense',
        frequency: 'monthly',
        name: '',
        amount: 0,
        account_id: accounts.length > 0 ? accounts[0].id : '',
        next_date: '',
      });
    }
  }, [editingRecurring, isOpen, accounts, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRecurring ? 'Ubah Jadwal Transaksi' : 'Jadwalkan Transaksi'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Simpan Jadwal
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          {(['expense', 'income'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue('type', type)}
              className={cn(
                'flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all',
                txType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {type === 'expense' ? 'Keluar' : 'Masuk'}
            </button>
          ))}
        </div>
        <Input
          label="Nama Transaksi"
          placeholder="Misal: Tagihan Listrik, Spotify"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Nominal"
          type="number"
          {...register('amount')}
          error={errors.amount?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Akun Sumber"
            options={[
              { label: '-- Pilih Akun --', value: '' },
              ...accounts.map((a) => ({ label: a.name, value: a.id })),
            ]}
            {...register('account_id')}
            error={errors.account_id?.message}
          />
          <Select
            label="Frekuensi"
            options={[
              { label: 'Harian', value: 'daily' },
              { label: 'Mingguan', value: 'weekly' },
              { label: 'Bulanan', value: 'monthly' },
              { label: 'Tahunan', value: 'yearly' },
            ]}
            {...register('frequency')}
            error={errors.frequency?.message}
          />
        </div>

        <Input
          label="Tanggal Berikutnya"
          type="date"
          {...register('next_date')}
          error={errors.next_date?.message}
        />
      </form>
    </Modal>
  );
}
