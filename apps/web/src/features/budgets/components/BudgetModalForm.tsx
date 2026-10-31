import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Modal, Button, Input, Select } from '@/components/ui';
import type { Category } from '@/types';
import { budgetSchema, type BudgetFormValues } from '../schemas/budgetSchema';

export interface EnrichedBudget {
  id: string;
  category_id: string;
  amount: number;
  period: string;
  category?: { name: string } | null;
  spent: number;
  percent: number;
}

export interface BudgetModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  editingBudget: EnrichedBudget | null;
  categories: Category[];
  isSubmitting: boolean;
}

export function BudgetModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingBudget,
  categories,
  isSubmitting,
}: BudgetModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      period: format(new Date(), 'yyyy-MM'),
    },
  });

  useEffect(() => {
    if (editingBudget) {
      setValue('category_id', editingBudget.category_id);
      setValue('amount', editingBudget.amount);
      setValue('period', editingBudget.period);
    } else {
      reset({
        category_id: '',
        amount: 0,
        period: format(new Date(), 'yyyy-MM'),
      });
    }
  }, [editingBudget, isOpen, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBudget ? 'Ubah Anggaran' : 'Set Anggaran Baru'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {editingBudget ? 'Simpan' : 'Buat Anggaran'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Select
          label="Kategori Pengeluaran"
          options={[
            { label: '-- Pilih Kategori --', value: '' },
            ...categories.map((c) => ({ label: c.name, value: c.id })),
          ]}
          {...register('category_id')}
          error={errors.category_id?.message}
        />
        <Input
          label="Limit Bulanan"
          type="number"
          placeholder="0"
          {...register('amount')}
          error={errors.amount?.message}
        />
        <Input
          label="Bulan (Periode)"
          type="month"
          {...register('period')}
          error={errors.period?.message}
        />
      </form>
    </Modal>
  );
}
