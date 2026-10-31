import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types';
import type { CategoryFormValues } from '../schemas/categorySchema';
import { DEFAULT_EXPENSES, DEFAULT_INCOMES } from '../constants/category.constants';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSaveCategory = async (values: CategoryFormValues) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, values);
      } else {
        await categoryService.createCategory({ ...values, user_id: user?.id });
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDefaults = async () => {
    setSubmitting(true);
    try {
      const expenseData = DEFAULT_EXPENSES.map((name) => ({
        user_id: user?.id,
        name,
        type: 'expense' as const,
      }));
      const incomeData = DEFAULT_INCOMES.map((name) => ({
        user_id: user?.id,
        name,
        type: 'income' as const,
      }));

      for (const item of [...expenseData, ...incomeData]) {
        await categoryService.createCategory(item);
      }
      await fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      await fetchCategories();
    } catch {
      alert('Kategori tidak bisa dihapus karena mungkin sudah digunakan dalam transaksi.');
    }
  };

  return {
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    setEditingCategory,
    submitting,
    fetchCategories,
    handleSaveCategory,
    handleCreateDefaults,
    handleDeleteCategory,
  };
}
