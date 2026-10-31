import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, Select } from '@/components/ui';
import type { DebtRecord } from '@/types';
import { debtSchema, type DebtFormValues } from '../schemas/debtSchema';

export interface DebtModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: DebtFormValues) => Promise<void>;
  editingDebt: DebtRecord | null;
  isSubmitting: boolean;
}

export function DebtModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingDebt,
  isSubmitting,
}: DebtModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema) as any,
    defaultValues: {
      type: 'payable',
      name: '',
      amount: 0,
      remaining: 0,
      due_date: '',
    },
  });

  useEffect(() => {
    if (editingDebt) {
      setValue('type', editingDebt.type);
      setValue('name', editingDebt.name);
      setValue('amount', editingDebt.amount);
      setValue('remaining', editingDebt.remaining);
      setValue('due_date', editingDebt.due_date || '');
    } else {
      reset({
        type: 'payable',
        name: '',
        amount: 0,
        remaining: 0,
        due_date: '',
      });
    }
  }, [editingDebt, isOpen, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDebt ? 'Ubah Catatan' : 'Catat Hutang/Piutang'}
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
        <Select
          label="Jenis"
          options={[
            { label: 'Hutang ke Orang (Saya meminjam)', value: 'payable' },
            { label: 'Piutang ke Orang (Orang meminjam)', value: 'receivable' },
          ]}
          {...register('type')}
          error={errors.type?.message}
        />
        <Input
          label="Keterangan / Nama Orang"
          placeholder="Misal: Pinjaman Modal, Hutang ke Andi"
          {...register('name')}
          error={errors.name?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Pinjaman"
            type="number"
            {...register('amount')}
            error={errors.amount?.message}
          />
          <Input
            label="Sisa Belum Bayar"
            type="number"
            {...register('remaining')}
            error={errors.remaining?.message}
          />
        </div>
        <Input label="Jatuh Tempo (Opsional)" type="date" {...register('due_date')} />
      </form>
    </Modal>
  );
}
