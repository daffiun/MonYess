import { supabase } from '@/lib/supabase';
import type { RecurringTransactionRecord } from '@/types';

export interface CreateRecurringDTO {
  name: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  account_id: string;
  category_id?: string | null;
  target_account_id?: string | null;
  user_id?: string;
}

export interface UpdateRecurringDTO extends Partial<CreateRecurringDTO> {
  active?: boolean;
}

export const recurringService = {
  async getRecurringTransactions(): Promise<RecurringTransactionRecord[]> {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as RecurringTransactionRecord[]) || [];
  },

  async createRecurring(dto: CreateRecurringDTO) {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRecurring(id: string, dto: UpdateRecurringDTO) {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleActive(id: string, active: boolean) {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .update({ active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRecurring(id: string) {
    const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
