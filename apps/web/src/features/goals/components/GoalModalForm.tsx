import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input } from '@/components/ui';
import type { Goal } from '@/types';
import { goalSchema, type GoalFormValues } from '../schemas/goalSchema';

export interface GoalModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: GoalFormValues) => Promise<void>;
  editingGoal: Goal | null;
  isSubmitting: boolean;
}

export function GoalModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
  isSubmitting,
}: GoalModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      name: '',
      target_amount: 0,
      current_amount: 0,
      deadline: '',
    },
  });

  useEffect(() => {
    if (editingGoal) {
      setValue('name', editingGoal.name);
      setValue('target_amount', editingGoal.target_amount);
      setValue('current_amount', editingGoal.current_amount);
      setValue('deadline', editingGoal.deadline || '');
    } else {
      reset({
        name: '',
        target_amount: 0,
        current_amount: 0,
        deadline: '',
      });
    }
  }, [editingGoal, isOpen, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGoal ? 'Ubah Target' : 'Buat Target Baru'}
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
        <Input
          label="Nama Target"
          placeholder="Misal: Beli MacBook, Dana Darurat"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Target Nominal (Total)"
          type="number"
          {...register('target_amount')}
          error={errors.target_amount?.message}
        />
        <Input
          label="Saldo Saat Ini"
          type="number"
          {...register('current_amount')}
          error={errors.current_amount?.message}
        />
        <Input label="Target Tanggal (Opsional)" type="date" {...register('deadline')} />
      </form>
    </Modal>
  );
}
