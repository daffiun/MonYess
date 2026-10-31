import { supabase } from '@/lib/supabase';
import type { Account } from '@/types';

export interface CreateAccountDTO {
  name: string;
  type: string;
  balance: number;
  color?: string;
  user_id?: string;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: string;
  balance?: number;
  color?: string;
  is_active?: boolean;
}

export const accountService = {
  async getAccounts(activeOnly = false): Promise<Account[]> {
    let query = supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createAccount(dto: CreateAccountDTO) {
    const { data, error } = await supabase
      .from('accounts')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccount(id: string, dto: UpdateAccountDTO) {
    const { data, error } = await supabase
      .from('accounts')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount(id: string) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
