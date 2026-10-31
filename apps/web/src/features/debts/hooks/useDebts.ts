import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { debtService } from '@/services/debtService';
import type { DebtRecord } from '@/types';
import type { DebtFormValues } from '../schemas/debtSchema';

export function useDebts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await debtService.getDebts();
      setDebts(data);
    } catch (err: any) {
      console.error('Error fetching debts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveDebt = async (values: DebtFormValues) => {
    setSubmitting(true);
    try {
      if (editingDebt) {
        await debtService.updateDebt(editingDebt.id, values);
      } else {
        await debtService.createDebt({ ...values, user_id: user?.id });
      }
      setIsModalOpen(false);
      setEditingDebt(null);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await debtService.settleDebt(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteDebt = async (id: string) => {
    try {
      await debtService.deleteDebt(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    debts,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingDebt,
    setEditingDebt,
    submitting,
    fetchData,
    handleSaveDebt,
    handleMarkAsPaid,
    handleDeleteDebt,
  };
}
