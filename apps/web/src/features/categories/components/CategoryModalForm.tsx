import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, Select } from '@/components/ui';
import type { Category } from '@/types';
import { categorySchema, type CategoryFormValues } from '../schemas/categorySchema';

export interface CategoryModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  editingCategory: Category | null;
  isSubmitting: boolean;
}

export function CategoryModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isSubmitting,
}: CategoryModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: 'expense',
    },
  });

  useEffect(() => {
    if (editingCategory) {
      setValue('name', editingCategory.name);
      setValue('type', editingCategory.type === 'income' ? 'income' : 'expense');
    } else {
      reset({
        name: '',
        type: 'expense',
      });
    }
  }, [editingCategory, isOpen, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? 'Ubah Kategori' : 'Tambah Kategori'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {editingCategory ? 'Simpan' : 'Tambah'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
  );
}
