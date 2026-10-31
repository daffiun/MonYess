import { supabase } from '@/lib/supabase';
import type { BudgetWithCategory } from '@/types';

export interface CreateBudgetDTO {
  category_id: string;
  amount: number;
  period: string; // YYYY-MM
  user_id?: string;
}

export interface UpdateBudgetDTO {
  category_id?: string;
  amount?: number;
  period?: string;
}

export const budgetService = {
  async getBudgets(period: string): Promise<BudgetWithCategory[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*, category:category_id(name)')
      .eq('period', period);

    if (error) throw error;
    return (data as unknown as BudgetWithCategory[]) || [];
  },

  async getMonthlyCategorySpending(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const spendingMap: Record<string, number> = {};
    data?.forEach((tx) => {
      if (tx.category_id) {
        spendingMap[tx.category_id] = (spendingMap[tx.category_id] || 0) + Number(tx.amount);
      }
    });

    return spendingMap;
  },

  async createBudget(dto: CreateBudgetDTO) {
    const { data, error } = await supabase
      .from('budgets')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBudget(id: string, dto: UpdateBudgetDTO) {
    const { data, error } = await supabase
      .from('budgets')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
