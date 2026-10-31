import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { budgetService } from '@/services/budgetService';
import { categoryService } from '@/services/categoryService';
import { getCurrentMonthRange } from '@/utils/date';
import type { Category } from '@/types';
import type { BudgetFormValues } from '../schemas/budgetSchema';
import type { EnrichedBudget } from '../components/BudgetModalForm';

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<EnrichedBudget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<EnrichedBudget | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { start, end } = getCurrentMonthRange();
      const currentPeriod = format(new Date(), 'yyyy-MM');

      const [catData, budgetData, spendingMap] = await Promise.all([
        categoryService.getCategories('expense'),
        budgetService.getBudgets(currentPeriod),
        budgetService.getMonthlyCategorySpending(start, end),
      ]);

      setCategories(catData);

      const enriched: EnrichedBudget[] = budgetData.map((b) => {
        const spent = spendingMap[b.category_id] || 0;
        const percent = Math.round((spent / b.amount) * 100);
        return {
          ...b,
          spent,
          percent,
        };
      });

      setBudgets(enriched);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveBudget = async (values: BudgetFormValues) => {
    setSubmitting(true);
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, values);
      } else {
        await budgetService.createBudget({ ...values, user_id: user?.id });
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await budgetService.deleteBudget(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    budgets,
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingBudget,
    setEditingBudget,
    submitting,
    fetchData,
    handleSaveBudget,
    handleDeleteBudget,
  };
}
