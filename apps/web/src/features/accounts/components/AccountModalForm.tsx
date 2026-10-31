import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, Select } from '@/components/ui';
import type { Account } from '@/types';
import { accountSchema, type AccountFormValues } from '../schemas/accountSchema';
import { ACCOUNT_TYPES } from '../constants/account.constants';

export interface AccountModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AccountFormValues) => Promise<void>;
  editingAccount: Account | null;
  isSubmitting: boolean;
}

export function AccountModalForm({
  isOpen,
  onClose,
  onSubmit,
  editingAccount,
  isSubmitting,
}: AccountModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema) as any,
    defaultValues: {
      name: '',
      type: 'cash',
      balance: 0,
    },
  });

  useEffect(() => {
    if (editingAccount) {
      setValue('name', editingAccount.name);
      setValue('type', editingAccount.type);
      setValue('balance', editingAccount.balance);
      setValue('color', editingAccount.color || '');
    } else {
      reset({
        name: '',
        type: 'cash',
        balance: 0,
      });
    }
  }, [editingAccount, isOpen, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAccount ? 'Ubah Akun' : 'Tambah Akun Baru'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {editingAccount ? 'Simpan Perubahan' : 'Buat Akun'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nama Akun"
          placeholder="Misal: Bank BCA, Dompet Utama"
          {...register('name')}
          error={errors.name?.message}
        />
        <Select
          label="Jenis Akun"
          options={ACCOUNT_TYPES}
          {...register('type')}
          error={errors.type?.message}
        />
        <Input
          label="Saldo Saat Ini"
          type="number"
          step="0.01"
          placeholder="0"
          {...register('balance')}
          error={errors.balance?.message}
        />
      </form>
    </Modal>
  );
}
