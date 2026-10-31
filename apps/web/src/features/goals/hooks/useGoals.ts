import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { goalService } from '@/services/goalService';
import type { Goal } from '@/types';
import type { GoalFormValues } from '../schemas/goalSchema';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err: any) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSaveGoal = async (values: GoalFormValues) => {
    setSubmitting(true);
    try {
      if (editingGoal) {
        await goalService.updateGoal(editingGoal.id, values);
      } else {
        await goalService.createGoal({ ...values, user_id: user?.id });
      }
      setIsModalOpen(false);
      setEditingGoal(null);
      await fetchGoals();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      await fetchGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    goals,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingGoal,
    setEditingGoal,
    submitting,
    fetchGoals,
    handleSaveGoal,
    handleDeleteGoal,
  };
}
