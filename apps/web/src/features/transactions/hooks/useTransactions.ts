import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionService } from '@/services/transactionService';
import { accountService } from '@/services/accountService';
import { categoryService } from '@/services/categoryService';
import type { Account, Category, TransactionWithRelations } from '@/types';
import type { TransactionFormValues } from '../schemas/transactionSchema';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionWithRelations | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [accData, catData, txData] = await Promise.all([
        accountService.getAccounts(true),
        categoryService.getCategories(),
        transactionService.getTransactions({
          type: typeFilter,
          accountId: accountFilter,
        }),
      ]);

      setAccounts(accData);
      setCategories(catData);
      setTransactions(txData);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, accountFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveTransaction = async (values: TransactionFormValues) => {
    setSubmitting(true);
    try {
      if (editingTx) {
        await transactionService.updateTransaction({
          p_tx_id: editingTx.id,
          p_user_id: user?.id,
          p_account_id: values.account_id,
          p_target_account_id: values.type === 'transfer' ? values.target_account_id : null,
          p_category_id: values.type !== 'transfer' ? values.category_id : null,
          p_amount: values.amount,
          p_type: values.type,
          p_date: values.date,
          p_note: values.note || '',
        });
      } else {
        await transactionService.createTransaction({
          p_user_id: user?.id,
          p_account_id: values.account_id,
          p_target_account_id: values.type === 'transfer' ? values.target_account_id : null,
          p_category_id: values.type !== 'transfer' ? values.category_id : null,
          p_amount: values.amount,
          p_type: values.type,
          p_date: values.date,
          p_note: values.note || '',
        });
      }

      setIsModalOpen(false);
      setEditingTx(null);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (txId: string) => {
    try {
      await transactionService.deleteTransaction({
        p_tx_id: txId,
        p_user_id: user?.id,
      });
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.note?.toLowerCase().includes(term) ||
        tx.category?.name?.toLowerCase().includes(term) ||
        tx.account?.name?.toLowerCase().includes(term)
    );
  }, [transactions, searchTerm]);

  return {
    transactions: filteredTransactions,
    accounts,
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingTx,
    setEditingTx,
    submitting,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    fetchData,
    handleSaveTransaction,
    handleDeleteTransaction,
  };
}
