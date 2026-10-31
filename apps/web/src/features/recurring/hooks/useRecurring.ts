import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recurringService } from '@/services/recurringService';
import { accountService } from '@/services/accountService';
import type { Account, RecurringTransactionRecord } from '@/types';
import type { RecurringFormValues } from '../schemas/recurringSchema';

export function useRecurring() {
  const { user } = useAuth();
  const [recurring, setRecurring] = useState<RecurringTransactionRecord[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransactionRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recurringData, accData] = await Promise.all([
        recurringService.getRecurringTransactions(),
        accountService.getAccounts(true),
      ]);
      setRecurring(recurringData);
      setAccounts(accData);
    } catch (err: any) {
      console.error('Error fetching recurring transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveRecurring = async (values: RecurringFormValues) => {
    setSubmitting(true);
    try {
      if (editingRecurring) {
        await recurringService.updateRecurring(editingRecurring.id, values);
      } else {
        await recurringService.createRecurring({ ...values, user_id: user?.id });
      }
      setIsModalOpen(false);
      setEditingRecurring(null);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: RecurringTransactionRecord) => {
    try {
      await recurringService.toggleActive(item.id, !item.active);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRecurring = async (id: string) => {
    try {
      await recurringService.deleteRecurring(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    recurring,
    accounts,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingRecurring,
    setEditingRecurring,
    submitting,
    fetchData,
    handleSaveRecurring,
    handleToggleActive,
    handleDeleteRecurring,
  };
}
