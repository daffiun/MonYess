import { supabase } from '@/lib/supabase';
import type { DebtRecord } from '@/types';

export interface CreateDebtDTO {
  name: string;
  type: 'payable' | 'receivable';
  amount: number;
  remaining?: number;
  due_date?: string;
  user_id?: string;
}

export interface UpdateDebtDTO {
  name?: string;
  type?: 'payable' | 'receivable';
  amount?: number;
  remaining?: number;
  due_date?: string;
  is_settled?: boolean;
}

export const debtService = {
  async getDebts(): Promise<DebtRecord[]> {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as DebtRecord[]) || [];
  },

  async createDebt(dto: CreateDebtDTO) {
    const { data, error } = await supabase
      .from('debts')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDebt(id: string, dto: UpdateDebtDTO) {
    const { data, error } = await supabase
      .from('debts')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async settleDebt(id: string) {
    const { data, error } = await supabase
      .from('debts')
      .update({ remaining: 0, is_settled: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDebt(id: string) {
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
