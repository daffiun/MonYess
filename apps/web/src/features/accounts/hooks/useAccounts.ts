import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { accountService } from '@/services/accountService';
import type { Account } from '@/types';
import type { AccountFormValues } from '../schemas/accountSchema';

export function useAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSaveAccount = async (values: AccountFormValues) => {
    setSubmitting(true);
    try {
      if (editingAccount) {
        await accountService.updateAccount(editingAccount.id, values);
      } else {
        await accountService.createAccount({ ...values, user_id: user?.id });
      }
      setIsModalOpen(false);
      setEditingAccount(null);
      await fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (acc: Account) => {
    try {
      await accountService.updateAccount(acc.id, { is_active: !acc.is_active });
      await fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    accounts,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingAccount,
    setEditingAccount,
    submitting,
    fetchAccounts,
    handleSaveAccount,
    handleToggleActive,
  };
}
